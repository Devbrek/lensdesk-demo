import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/app/lib/prisma"; // ok, ça fonctionne maintenant

const userId = "b225a7f0-93fe-491a-a907-08b83e27178e";

// POST /api/shootings/[shootingId]/notes
export async function POST(
  req: NextRequest,
  { params }: { params: { shootingId: string } },
) {
  try {
    const { shootingId } = params;
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

    const note = await prisma.note.create({
      data: { content, shootingId },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
