import { type NextRequest, NextResponse } from "next/server";
import { mockShootings, mockChecklistItems, mockNotes, uuid, DEMO_USER_ID } from "@/lib/mock-data";

export async function GET() {
  try {
    const shootings = [...mockShootings]
      .filter((s) => s.userId === DEMO_USER_ID)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((s) => ({
        ...s,
        checklist: mockChecklistItems.filter((c) => c.shootingId === s.id),
        notes: mockNotes.filter((n) => n.shootingId === s.id),
      }));

    return NextResponse.json(shootings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, location, date, status } = body;

    if (!title) {
      return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });
    }

    const newShooting = {
      id: uuid(),
      title,
      description: description ?? null,
      location: location ?? null,
      date: date ? new Date(date) : null,
      status: status || "draft",
      createdAt: new Date(),
      userId: DEMO_USER_ID,
    };

    mockShootings.push(newShooting);

    return NextResponse.json(
      { ...newShooting, checklist: [], notes: [] },
      { status: 201 },
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
