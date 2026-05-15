import { type NextRequest, NextResponse } from "next/server";
import { mockChecklistItems, mockInventoryItems, uuid } from "@/lib/mock-data";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;
    const url = new URL(req.url);
    const type = url.searchParams.get("type") || undefined;

    const items = mockChecklistItems
      .filter((c) => c.shootingId === shootingId && (!type || c.type === type))
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((c) => ({
        ...c,
        inventoryItem: c.inventoryItemId
          ? (mockInventoryItems.find((i) => i.id === c.inventoryItemId) ?? null)
          : null,
      }));

    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

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
        { error: "Le label ou l'inventoryItemId est obligatoire" },
        { status: 400 },
      );
    }

    let finalPriority = Number(priority);
    if (!Number.isFinite(finalPriority) || finalPriority < 1 || finalPriority > 5) {
      finalPriority = 3;
    }

    let finalLabel = label;
    let finalType = type || "action";
    let finalInventoryItemId: string | null = null;

    if (inventoryItemId) {
      const inv = mockInventoryItems.find((i) => i.id === inventoryItemId);
      if (!inv) {
        return NextResponse.json(
          { error: "Item d'inventaire introuvable" },
          { status: 404 },
        );
      }
      finalLabel = inv.label;
      finalType = "materiel";
      finalInventoryItemId = inventoryItemId;
    }

    const newItem = {
      id: uuid(),
      label: finalLabel,
      checked: false,
      type: finalType,
      priority: finalPriority,
      createdAt: new Date(),
      shootingId,
      inventoryItemId: finalInventoryItemId,
    };

    mockChecklistItems.push(newItem);

    return NextResponse.json({ message: "Checklist item créé", item: newItem });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
