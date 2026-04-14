import { NextResponse } from "next/server";
import { ChatMistralAI } from "@langchain/mistralai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { prisma } from "@/lib/prisma";

const model = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY!,
  model: "mistral-large-latest",
  temperature: 0.7,
  maxTokens: 300,
  streaming: true,
});

type MemoryMessage = {
  role: "user" | "assistant";
  content: string;
};

// ⚠️ mémoire temporaire (OK pour dev, pas prod)
const memory: MemoryMessage[] = [];

const bannedWords = [
  "tuer",
  "meurtre",
  "assassiner",
  "bombe",
  "arme",
  "guerre",
  "drogue",
  "cocaïne",
  "héroïne",
  "cannabis",
  "overdose",
  "hack",
  "piratage",
  "virus",
  "malware",
  "phishing",
  "sexe",
  "porno",
  "nudité",
  "masturbation",
  "bdsm",
  "suicide",
  "automutilation",
  "me pendre",
  "racisme",
  "nazi",
  "hitler",
  "génocide",
];

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function isBlocked(message: string) {
  const clean = normalize(message);
  return bannedWords.some((w) => clean.includes(normalize(w)));
}

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
Tu es un assistant IA pour un photographe.
Tu es convivial, agréable et répond normalement.N'utilise pas d'émojis, reste pro.

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
- réponses courtes (max 5 phrases)
- style simple et concret
- si hors photographie → refuse et recentre
    `,
  ],
  ["user", "{context}"],
]);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("BODY RECEIVED:", body);

    const { message, userId } = body;

    if (!message?.trim()) {
      return Response.json({ error: "Message manquant" }, { status: 400 });
    }

    if (!userId) {
      return Response.json({ error: "UserId manquant" }, { status: 400 });
    }

    console.log("USER:", userId);
    console.log("MESSAGE:", message);

    // 👉 ensuite ton code Mistral / Langchain

    // =========================
    // 🔥 DB CONTEXT (PRISMA)
    // =========================
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        shootings: {
          orderBy: { date: "asc" },
          take: 5,
          include: {
            checklist: true,
          },
        },
        inventory: true,
      },
    });

    const dbContext = {
      user: {
        name: user?.name,
      },

      shootings: user?.shootings?.map((s) => ({
        title: s.title,
        date: s.date,
        location: s.location,
        status: s.status,
        checklistCount: s.checklist.length,
        checklist: s.checklist.map((c) => ({
          label: c.label,
          checked: c.checked,
          type: c.type,
        })),
      })),

      inventory: user?.inventory?.map((i) => ({
        label: i.label,
        type: i.type,
      })),
    };

    // =========================
    // MEMORY (simple dev)
    // =========================
    memory.push({ role: "user", content: message });

    const context = `
Voici les données utilisateur (JSON structuré) :

${JSON.stringify(dbContext, null, 2)}

Historique conversation :
${memory.map((m) => `${m.role}: ${m.content}`).join("\n")}
`;

    const formattedPrompt = await prompt.formatMessages({
      context,
    });

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
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
