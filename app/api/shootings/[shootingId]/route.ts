import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "b225a7f0-93fe-491a-a907-08b83e27178e";

// POST /api/shootings/[shootingId]/checklist
export async function POST(
  req: NextRequest,
  { params }: { params: { shootingId: string } },
) {
  try {
    const { shootingId } = params;
    const body = await req.json();
    const { label } = body;

    if (!label)
      return NextResponse.json({ error: "Label requis" }, { status: 400 });

    // Vérifier que le shooting appartient bien à l'utilisateur
    const shooting = await prisma.shooting.findFirst({
      where: { id: shootingId, userId },
    });
    if (!shooting)
      return NextResponse.json(
        { error: "Shooting non trouvé" },
        { status: 404 },
      );

    const item = await prisma.checklistItem.create({
      data: { label, shootingId },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
