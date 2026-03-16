import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "b225a7f0-93fe-491a-a907-08b83e27178e"; // ID de ton frère

// GET /api/shootings → lister tous les shootings
export async function GET(req: NextRequest) {
  try {
    const shootings = await prisma.shooting.findMany({
      where: { userId },
      include: { checklist: true, notes: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(shootings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/shootings → créer un nouveau shooting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, location, date, status } = body;

    if (!title || !status) {
      return NextResponse.json(
        { error: "title et status sont obligatoires" },
        { status: 400 },
      );
    }

    const shooting = await prisma.shooting.create({
      data: {
        title,
        description,
        location,
        date: date ? new Date(date) : undefined,
        status,
        userId,
      },
    });

    return NextResponse.json(shooting, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { shootingId: string; itemId: string } },
) {
  try {
    const { shootingId, itemId } = params;

    const deleted = await prisma.checklistItem.deleteMany({
      where: { id: itemId, shootingId },
    });

    if (deleted.count === 0)
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });

    return NextResponse.json({ message: "Item supprimé ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
