import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ID unique de ton frère
const userId = "b225a7f0-93fe-491a-a907-08b83e27178e";

// GET /api/user → récupérer les infos de l’utilisateur
export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user)
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );

    return NextResponse.json(user);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// PATCH /api/user → mettre à jour email, name ou password
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    const data: any = {};
    if (email !== undefined) data.email = email;
    if (name !== undefined) data.name = name;
    if (password !== undefined) data.password = password; // mot de passe en clair pour l’outil perso

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
      select: { id: true, email: true, name: true, createdAt: true }, // on ne renvoie pas le mot de passe
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
