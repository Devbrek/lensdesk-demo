import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET → récupérer un item précis
export async function GET(
  _req: NextRequest,
  { params }: { params: { shootingId: string; itemId: string } },
) {
  try {
    const { itemId } = params;

    const item = await prisma.checklistItem.findUnique({
      where: { id: itemId },
    });

    if (!item)
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });

    return NextResponse.json(item);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH → mettre à jour un item
export async function PATCH(
  req: NextRequest,
  { params }: { params: { shootingId: string; itemId: string } },
) {
  try {
    const { itemId } = params;

    const body = await req.json();
    const { label, checked } = body;

    const data: any = {};
    if (label !== undefined) data.label = label;
    if (checked !== undefined) data.checked = checked;

    const updatedItem = await prisma.checklistItem.update({
      where: { id: itemId },
      data,
    });

    return NextResponse.json({
      message: "Checklist item mis à jour ✅",
      item: updatedItem,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur ou item non trouvé" },
      { status: 500 },
    );
  }
}

// DELETE → supprimer un item
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { shootingId: string; itemId: string } },
) {
  try {
    const { itemId } = params;

    const deleted = await prisma.checklistItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item supprimé ✅", item: deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur ou item non trouvé" },
      { status: 500 },
    );
  }
}
