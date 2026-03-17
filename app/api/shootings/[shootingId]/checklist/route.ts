import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/shootings/[shootingId]/checklist → lister tous les items
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;

    const items = await prisma.checklistItem.findMany({
      where: { shootingId },
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/shootings/[shootingId]/checklist → créer un item
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;
    const body = await req.json();
    const { label } = body;

    if (!label) {
      return NextResponse.json(
        { error: "Le label est obligatoire" },
        { status: 400 },
      );
    }

    const newItem = await prisma.checklistItem.create({
      data: {
        label,
        checked: false,
        shooting: { connect: { id: shootingId } },
      },
    });

    return NextResponse.json({ message: "Checklist créée ✅", item: newItem });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
