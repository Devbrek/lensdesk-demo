import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const userId = "b225a7f0-93fe-491a-a907-08b83e27178e"; // ID de ton frère

// GET /api/shootings/[id] → récupérer un shooting précis
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const shooting = await prisma.shooting.findFirst({
      where: { id, userId },
      include: { checklist: true, notes: true },
    });

    if (!shooting)
      return NextResponse.json(
        { error: "Shooting non trouvé" },
        { status: 404 },
      );

    return NextResponse.json(shooting);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/shootings/[id] → mettre à jour un shooting
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description, location, date, status } = body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location;
    if (date !== undefined) data.date = new Date(date);
    if (status !== undefined) data.status = status;

    const updatedShooting = await prisma.shooting.updateMany({
      where: { id, userId },
      data,
    });

    if (updatedShooting.count === 0)
      return NextResponse.json(
        { error: "Shooting non trouvé" },
        { status: 404 },
      );

    return NextResponse.json({ message: "Shooting mis à jour ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// DELETE /api/shootings/[id] → supprimer un shooting
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = params;

    const deleted = await prisma.shooting.deleteMany({
      where: { id, userId },
    });

    if (deleted.count === 0)
      return NextResponse.json(
        { error: "Shooting non trouvé" },
        { status: 404 },
      );

    return NextResponse.json({ message: "Shooting supprimé ✅" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
