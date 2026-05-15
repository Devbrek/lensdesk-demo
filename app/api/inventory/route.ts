import { type NextRequest, NextResponse } from "next/server";
import { mockInventoryItems, uuid, DEMO_USER_ID } from "@/lib/mock-data";

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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { label, type } = body;

    if (!label) {
      return NextResponse.json({ error: "Label requis" }, { status: 400 });
    }

    const newItem = {
      id: uuid(),
      label,
      type: type ?? null,
      createdAt: new Date(),
      userId: DEMO_USER_ID,
    };

    mockInventoryItems.push(newItem);

    return NextResponse.json({ message: "Item ajouté à l'inventaire", item: newItem });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
