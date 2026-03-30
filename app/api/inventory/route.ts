import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/inventory → récupérer tous les items d'un utilisateur
export async function GET(req: NextRequest) {
  try {
    const userId = "83a83cf9-9ced-478b-9edb-b05042845329"; // à remplacer par session/auth
    const items = await prisma.inventoryItem.findMany({
      where: { userId },
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/inventory → créer un nouvel item
export async function POST(req: NextRequest) {
  try {
    const userId = "83a83cf9-9ced-478b-9edb-b05042845329"; // à remplacer par session/auth
    const body = await req.json();
    const { label, type } = body;

    if (!label)
      return NextResponse.json({ error: "Label requis" }, { status: 400 });

    const newItem = await prisma.inventoryItem.create({
      data: { label, type, userId },
    });

    return NextResponse.json(newItem);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
