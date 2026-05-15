import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const LIMIT = 5;
const WINDOW = 60 * 60 * 1000;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim().length < 5) {
      return NextResponse.json({ error: "Message trop court" }, { status: 400 });
    }

    if (message.includes("http") || message.includes("www")) {
      return NextResponse.json({ error: "Les liens ne sont pas autorisés" }, { status: 400 });
    }

    const ip = (req.headers.get("x-forwarded-for") || "unknown").split(",")[0];
    const now = Date.now();
    const userData = rateLimitMap.get(ip);

    if (userData) {
      if (now - userData.timestamp < WINDOW) {
        if (userData.count >= LIMIT) {
          return NextResponse.json({ error: "Limite atteinte (5 suggestions par heure)" }, { status: 429 });
        }
        userData.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, timestamp: now });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
