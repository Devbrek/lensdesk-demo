import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "b225a7f0-93fe-491a-a907-08b83e27178e";

// PATCH /api/shootings/[shootingId]/checklist/[itemId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { shootingId: string; itemId: string } },
) {
  try {
    const { shootingId, itemId } = params;
    const body = await req.json();
    const { checked } = body;

    if (checked === undefined)
      return NextResponse.json({ error: "checked requis" }, { status: 400 });

    // Vérifier que le shooting appartient bien à l'utilisateur
    const shooting = await prisma.shooting.findFirst({
      where: { id: shootingId, userId },
    });
    if (!shooting)
      return NextResponse.json(
        { error: "Shooting non trouvé" },
        { status: 404 },
      );

    const updatedItem = await prisma.checklistItem.updateMany({
      where: { id: itemId, shootingId },
      data: { checked },
    });

    if (updatedItem.count === 0)
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });

    return NextResponse.json({ message: "Checklist mise à jour ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
