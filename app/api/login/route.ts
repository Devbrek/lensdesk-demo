import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe nécessaires" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Email ou mot de passe incorrect" },
        { status: 401 },
      );
    }
    const token  = "ekzkezojrzhrzhrjkzhjzkrhrjkz"



    const response =  NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name },
    });

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 jours,
      path: '/'
    })


    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
