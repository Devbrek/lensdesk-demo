import { type NextRequest, NextResponse } from "next/server";
import { mockUsers, DEMO_USER_ID } from "@/lib/mock-data";

export async function GET() {
  try {
    const user = mockUsers.find((u) => u.id === DEMO_USER_ID);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, password } = body;

    const user = mockUsers.find((u) => u.id === DEMO_USER_ID);

    if (!user) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 },
      );
    }

    if (email !== undefined) user.email = email;
    if (name !== undefined) user.name = name;
    if (password !== undefined) user.password = password;

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
