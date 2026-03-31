import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// 🔥 RATE LIMIT (simple mémoire)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

const LIMIT = 5;
const WINDOW = 60 * 60 * 1000; // 1 heure

export async function POST(req: Request) {
  try {
    const { type, page, message } = await req.json();

    // 🔒 VALIDATION
    if (!message || message.trim().length < 5) {
      return NextResponse.json(
        { error: "Message trop court" },
        { status: 400 },
      );
    }

    // 🔒 ANTI SPAM BASIQUE
    if (message.includes("http") || message.includes("www")) {
      return NextResponse.json(
        { error: "Les liens ne sont pas autorisés" },
        { status: 400 },
      );
    }

    // 🔥 RÉCUP IP
    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0];

    const now = Date.now();
    const userData = rateLimitMap.get(ip);

    if (userData) {
      if (now - userData.timestamp < WINDOW) {
        if (userData.count >= LIMIT) {
          return NextResponse.json(
            { error: "Limite atteinte (5 suggestions par heure)" },
            { status: 429 },
          );
        }
        userData.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    // 📩 ENVOI EMAIL
    const result = await resend.emails.send({
      from: "Abuzone <onboarding@resend.dev>",
      to: process.env.FEEDBACK_EMAIL!,
      subject: `Suggestion - ${type} (${page})`,
      text: `
Type: ${type}
Page: ${page}

Message:
${message}
      `,
    });

    console.log("RESEND RESULT:", result);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur envoi email" }, { status: 500 });
  }
}
