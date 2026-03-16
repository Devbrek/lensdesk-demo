import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PATCH /api/user
export async function PATCH(req: NextRequest) {
  const userId = "b225a7f0-93fe-491a-a907-08b83e27178e"; // ton utilisateur unique

  try {
    const body = await req.json();
    const { email, name, password } = body;

    const data: any = {};
    if (email) data.email = email;
    if (name) data.name = name;
    if (password) data.password = password; // mot de passe en clair

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
