import { type NextRequest, NextResponse } from "next/server";
import { mockChecklistItems, mockInventoryItems } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await context.params;

    const item = mockChecklistItems.find((c) => c.id === itemId);

    if (!item) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      ...item,
      inventoryItem: item.inventoryItemId
        ? (mockInventoryItems.find((i) => i.id === item.inventoryItemId) ?? null)
        : null,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await context.params;
    const body = await req.json();
    const { label, checked, priority } = body;

    const item = mockChecklistItems.find((c) => c.id === itemId);

    if (!item) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    if (label !== undefined) item.label = label;
    if (checked !== undefined) item.checked = checked;
    if (priority !== undefined) item.priority = priority;

    return NextResponse.json({ message: "Checklist item mis à jour", item });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur ou item non trouvé" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ itemId: string }> },
) {
  try {
    const { itemId } = await context.params;

    const idx = mockChecklistItems.findIndex((c) => c.id === itemId);

    if (idx === -1) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    const [deleted] = mockChecklistItems.splice(idx, 1);

    return NextResponse.json({ message: "Item supprimé", item: deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur ou item non trouvé" }, { status: 500 });
  }
}
