import { type NextRequest, NextResponse } from "next/server";
import { mockShootings, mockNotes, uuid, DEMO_USER_ID } from "@/lib/mock-data";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;
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

    const note = { id: uuid(), content, shootingId };
    mockNotes.push(note);

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
