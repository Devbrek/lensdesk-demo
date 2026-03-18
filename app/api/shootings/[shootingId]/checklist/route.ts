import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET → lister tous les items d'une checklist, optionnellement filtrés par type
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;

    // On peut ajouter un query param ?type=materiel ou ?type=action
    const url = new URL(_req.url);
    const type = url.searchParams.get("type") || undefined;

    const items = await prisma.checklistItem.findMany({
      where: { shootingId, type }, // filtrage par type si précisé
      include: { inventoryItem: true },
      orderBy: { createdAt: "asc" }, // optionnel, pour l'ordre d'affichage
    });

    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST → créer un item (soit ad hoc, soit depuis l’inventaire, avec type)
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;
    const body = await req.json();
    const { label, inventoryItemId, priority, type } = body;

    if (!label && !inventoryItemId) {
      return NextResponse.json(
        { error: "Le label ou l’inventoryItemId est obligatoire" },
        { status: 400 },
      );
    }

    // Préparer les données pour Prisma
    const data: any = {
      shooting: { connect: { id: shootingId } },
      checked: false,
      type: type || "action", // par défaut "action"
    };

    // Si c’est un item ad hoc, on ajoute le label
    if (label) data.label = label;

    // Si c’est un item venant de l’inventaire, on relie l’id
    if (inventoryItemId) {
      const inventoryItem = await prisma.inventoryItem.findUnique({
        where: { id: inventoryItemId },
      });
      if (priority !== undefined) data.priority = priority;
      if (!inventoryItem) {
        return NextResponse.json(
          { error: "Item d’inventaire introuvable" },
          { status: 404 },
        );
      }
      data.inventoryItem = { connect: { id: inventoryItemId } };
      data.label = inventoryItem.label; // pour affichage direct
      data.type = "materiel"; // override type si c'est depuis l'inventaire
    }

    const newItem = await prisma.checklistItem.create({ data });

    return NextResponse.json({
      message: "Checklist item créé ✅",
      item: newItem,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
