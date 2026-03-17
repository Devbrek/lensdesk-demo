import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/inventory → récupérer tous les items d'un utilisateur
export async function GET(_req: NextRequest) {
  try {
    const userId = "83a83cf9-9ced-478b-9edb-b05042845329"; // à remplacer par l'user actuel
    const items = await prisma.inventoryItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
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
    const userId = "83a83cf9-9ced-478b-9edb-b05042845329"; // à remplacer par l'user actuel
    const body = await req.json();
    const { label, type } = body;

    if (!label) {
      return NextResponse.json(
        { error: "Le champ label est requis" },
        { status: 400 },
      );
    }

    const newItem = await prisma.inventoryItem.create({
      data: { label, type, userId },
    });

    return NextResponse.json({
      message: "Item ajouté à l'inventaire ✅",
      item: newItem,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/inventory/[itemId] → modifier un item
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await context.params;

    const body = await req.json();
    const { label, type } = body;

    // Vérifier qu'il y a au moins un champ à mettre à jour
    const data: any = {};
    if (label !== undefined) data.label = label;
    if (type !== undefined) data.type = type;

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "Aucun champ à mettre à jour" },
        { status: 400 },
      );
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id: itemId },
      data,
    });

    return NextResponse.json({
      message: "Item mis à jour ✅",
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

// DELETE /api/inventory/[itemId] → supprimer un item
export async function DELETE(
  req: NextRequest,
  { params }: { params: { itemId: string } },
) {
  try {
    const { itemId } = await params;

    console.log("DELETE itemId reçu :", itemId);

    const deleted = await prisma.inventoryItem.delete({
      where: { id: itemId },
    });

    return NextResponse.json({ message: "Item supprimé ✅", item: deleted });
  } catch (err) {
    console.error("Erreur DELETE inventoryItem :", err);
    return NextResponse.json(
      { error: "Erreur serveur ou item non trouvé" },
      { status: 500 },
    );
  }
}
