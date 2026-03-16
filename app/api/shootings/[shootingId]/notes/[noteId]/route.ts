import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "b225a7f0-93fe-491a-a907-08b83e27178e";

// PATCH /api/shootings/[shootingId]/notes/[noteId]
export async function PATCH(
  req: NextRequest,
  { params }: { params: { shootingId: string; noteId: string } },
) {
  try {
    const { shootingId, noteId } = params;
    const body = await req.json();
    const { content } = body;

    if (!content)
      return NextResponse.json({ error: "Content requis" }, { status: 400 });

    // Vérifier que le shooting appartient à l'utilisateur
    const shooting = await prisma.shooting.findFirst({
      where: { id: shootingId, userId },
    });
    if (!shooting)
      return NextResponse.json(
        { error: "Shooting non trouvé" },
        { status: 404 },
      );

    const updatedNote = await prisma.note.updateMany({
      where: { id: noteId, shootingId },
      data: { content },
    });

    if (updatedNote.count === 0)
      return NextResponse.json({ error: "Note non trouvée" }, { status: 404 });

    return NextResponse.json({ message: "Note mise à jour ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { shootingId: string; noteId: string } },
) {
  try {
    const { shootingId, noteId } = params;

    const deleted = await prisma.note.deleteMany({
      where: { id: noteId, shootingId },
    });

    if (deleted.count === 0)
      return NextResponse.json({ error: "Note non trouvée" }, { status: 404 });

    return NextResponse.json({ message: "Note supprimée ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
