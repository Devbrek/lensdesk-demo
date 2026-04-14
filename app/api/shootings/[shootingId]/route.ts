import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ID unique de ton frère
const userId = "83a83cf9-9ced-478b-9edb-b05042845329";

// GET /api/shootings/[shootingId] → récupérer un shooting précis
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;

    const shooting = await prisma.shooting.findFirst({
      where: { id: shootingId, userId },
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

// PATCH /api/shootings/[shootingId] → mettre à jour un shooting
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;
    const body = await req.json();
    const { title, description, location, date, status } = body;

    const data: any = {};
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (location !== undefined) data.location = location;
    if (date !== undefined) data.date = new Date(date);
    if (status !== undefined) data.status = status;

    const updatedShooting = await prisma.shooting.updateMany({
      where: { id: shootingId, userId },
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

// DELETE /api/shootings/[shootingId] → supprimer un shooting
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ shootingId: string }> },
) {
  try {
    const { shootingId } = await context.params;

    const deleted = await prisma.shooting.deleteMany({
      where: {
        id: shootingId,
        userId, // 🔒 sécurité
      },
    });

    if (deleted.count === 0) {
      return NextResponse.json(
        { error: "Shooting non trouvé" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);

    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}
