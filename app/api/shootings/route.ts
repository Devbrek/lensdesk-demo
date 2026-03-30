import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// GET /api/shootings → lister tous les shootings
export async function GET() {
  try {
    const shootings = await prisma.shooting.findMany({
      include: { checklist: true, notes: true }, // on récupère aussi checklist et notes
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(shootings);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/shootings → créer un nouveau shooting
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, location, date, status } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Le titre est requis" },
        { status: 400 },
      );
    }

    const newShooting = await prisma.shooting.create({
      data: {
        title,
        description,
        location,
        date: date ? new Date(date) : undefined,
        status: status || "draft",
        user: { connect: { id: "83a83cf9-9ced-478b-9edb-b05042845329" } }, // <- ici
      },
      include: { checklist: true, notes: true },
    });

    return NextResponse.json(newShooting, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
