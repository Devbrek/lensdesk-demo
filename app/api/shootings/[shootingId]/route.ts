import { type NextRequest, NextResponse } from "next/server";
import { mockShootings, mockChecklistItems, mockNotes, DEMO_USER_ID } from "@/lib/mock-data";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;

    const shooting = mockShootings.find(
      (s) => s.id === shootingId && s.userId === DEMO_USER_ID,
    );

    if (!shooting) {
      return NextResponse.json({ error: "Shooting non trouvé" }, { status: 404 });
    }

    return NextResponse.json({
      ...shooting,
      checklist: mockChecklistItems.filter((c) => c.shootingId === shootingId),
      notes: mockNotes.filter((n) => n.shootingId === shootingId),
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;
    const body = await req.json();
    const { title, description, location, date, status } = body;

    const shooting = mockShootings.find(
      (s) => s.id === shootingId && s.userId === DEMO_USER_ID,
    );

    if (!shooting) {
      return NextResponse.json({ error: "Shooting non trouvé" }, { status: 404 });
    }

    if (title !== undefined) shooting.title = title;
    if (description !== undefined) shooting.description = description;
    if (location !== undefined) shooting.location = location;
    if (date !== undefined) shooting.date = new Date(date);
    if (status !== undefined) shooting.status = status;

    return NextResponse.json({ message: "Shooting mis à jour" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;

    const idx = mockShootings.findIndex(
      (s) => s.id === shootingId && s.userId === DEMO_USER_ID,
    );

    if (idx === -1) {
      return NextResponse.json({ error: "Shooting non trouvé" }, { status: 404 });
    }

    mockShootings.splice(idx, 1);

    // cascade
    const ciIdx: number[] = [];
    mockChecklistItems.forEach((c, i) => { if (c.shootingId === shootingId) ciIdx.unshift(i); });
    ciIdx.forEach((i) => mockChecklistItems.splice(i, 1));

    const nIdx: number[] = [];
    mockNotes.forEach((n, i) => { if (n.shootingId === shootingId) nIdx.unshift(i); });
    nIdx.forEach((i) => mockNotes.splice(i, 1));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
