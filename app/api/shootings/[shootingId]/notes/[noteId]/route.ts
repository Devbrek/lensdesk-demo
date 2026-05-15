import { type NextRequest, NextResponse } from "next/server";
import { mockShootings, mockNotes, DEMO_USER_ID } from "@/lib/mock-data";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string; noteId: string }> },
) {
  try {
    const { shootingId, noteId } = await context.params;
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json({ error: "Content requis" }, { status: 400 });
    }

    const shooting = mockShootings.find(
      (s) => s.id === shootingId && s.userId === DEMO_USER_ID,
    );

    if (!shooting) {
      return NextResponse.json({ error: "Shooting non trouvé" }, { status: 404 });
    }

    const note = mockNotes.find(
      (n) => n.id === noteId && n.shootingId === shootingId,
    );

    if (!note) {
      return NextResponse.json({ error: "Note non trouvée" }, { status: 404 });
    }

    note.content = content;

    return NextResponse.json({ message: "Note mise à jour" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ shootingId: string; noteId: string }> },
) {
  try {
    const { shootingId, noteId } = await context.params;

    const idx = mockNotes.findIndex(
      (n) => n.id === noteId && n.shootingId === shootingId,
    );

    if (idx === -1) {
      return NextResponse.json({ error: "Note non trouvée" }, { status: 404 });
    }

    mockNotes.splice(idx, 1);

    return NextResponse.json({ message: "Note supprimée" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
