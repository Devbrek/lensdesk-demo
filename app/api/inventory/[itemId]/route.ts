import { type NextRequest, NextResponse } from "next/server";
import { mockInventoryItems, DEMO_USER_ID } from "@/lib/mock-data";

export async function GET() {
  try {
    const items = [...mockInventoryItems]
      .filter((i) => i.userId === DEMO_USER_ID)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json(items);
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
    const { label, type } = body;

    const data: { label?: string; type?: string } = {};
    if (label !== undefined) data.label = label;
    if (type !== undefined) data.type = type;

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Aucun champ à mettre à jour" }, { status: 400 });
    }

    const item = mockInventoryItems.find((i) => i.id === itemId);

    if (!item) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    if (data.label !== undefined) item.label = data.label;
    if (data.type !== undefined) item.type = data.type;

    return NextResponse.json({ message: "Item mis à jour", item });
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

    const idx = mockInventoryItems.findIndex((i) => i.id === itemId);

    if (idx === -1) {
      return NextResponse.json({ error: "Item non trouvé" }, { status: 404 });
    }

    const [deleted] = mockInventoryItems.splice(idx, 1);

    return NextResponse.json({ message: "Item supprimé", item: deleted });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur ou item non trouvé" }, { status: 500 });
  }
}
