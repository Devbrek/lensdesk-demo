import { NextResponse } from "next/server";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { mockUsers, mockShootings, mockChecklistItems, mockInventoryItems } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

type MemoryMessage = {
  role: "user" | "assistant";
  content: string;
};

const memory: MemoryMessage[] = [];

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
Tu es un assistant IA pour un photographe.
Tu es convivial, agréable et répond normalement. N'utilise pas d'émojis, reste pro.

Si l'utilisateur te le demande :
Tu aides à :
- gérer shootings
- organiser planning
- rappeler matériel
- analyser préparation

Tu dois utiliser les données JSON fournies pour répondre.
Si une information est disponible dans les shootings, checklist ou inventory, tu dois t'appuyer dessus.
Tu n'inventes pas des informations. Si tu ne sais pas ou n'as pas accès à une donnée, dis-le simplement.

Règles:
- réponses courtes (max 5 phrases) à part si demandé autrement
- style simple et concret
- si hors photographie → refuse et recentre à part si l'utilisateur demande des conseils ou des idées
    `,
  ],
  ["user", "{context}"],
]);

export async function POST(req: Request) {
  try {
    const model = new ChatMistralAI({
      apiKey: process.env.MISTRAL_API_KEY!,
      model: "mistral-large-latest",
      temperature: 0.7,
      maxTokens: 300,
      streaming: true,
    });

    const body = await req.json();
    const { message, userId } = body;

    if (!message?.trim()) {
      return Response.json({ error: "Message manquant" }, { status: 400 });
    }

    if (!userId) {
      return Response.json({ error: "UserId manquant" }, { status: 400 });
    }

    const user = mockUsers.find((u) => u.id === userId);

    const userShootings = mockShootings
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(a.date ?? 0).getTime() - new Date(b.date ?? 0).getTime())
      .slice(0, 5)
      .map((s) => ({
        title: s.title,
        date: s.date,
        location: s.location,
        status: s.status,
        checklistCount: mockChecklistItems.filter((c) => c.shootingId === s.id).length,
        checklist: mockChecklistItems
          .filter((c) => c.shootingId === s.id)
          .map((c) => ({ label: c.label, checked: c.checked, type: c.type })),
      }));

    const userInventory = mockInventoryItems
      .filter((i) => i.userId === userId)
      .map((i) => ({ label: i.label, type: i.type }));

    const dbContext = {
      user: { name: user?.name },
      shootings: userShootings,
      inventory: userInventory,
    };

    memory.push({ role: "user", content: message });

    const context = `
Voici les données utilisateur (JSON structuré) :

${JSON.stringify(dbContext, null, 2)}

Historique conversation :
${memory.map((m) => `${m.role}: ${m.content}`).join("\n")}
`;

    const formattedPrompt = await prompt.formatMessages({ context });
    const stream = await model.stream(formattedPrompt);
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let fullResponse = "";
        for await (const chunk of stream) {
          const token = typeof chunk.content === "string" ? chunk.content : "";
          if (!token) continue;
          fullResponse += token;
          controller.enqueue(encoder.encode(token));
        }
        memory.push({ role: "assistant", content: fullResponse });
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
