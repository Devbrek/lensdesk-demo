import { type NextRequest, NextResponse } from "next/server";
import { mockUsers } from "@/lib/mock-data";
import { generateToken } from "@/lib/auth";
import z from "zod";

const LoginSchema = z.object({
  email: z.string().trim().email("invalid email address"),
  password: z.string().min(1, "password required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = LoginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "validation failed", details: validation.error },
        { status: 400 },
      );
    }

    const { email, password } = validation.data;

    const user = mockUsers.find((u) => u.email === email);

    if (!user) {
      return NextResponse.json(
        { error: "invalid email or password" },
        { status: 401 },
      );
    }

    if (password !== user.password) {
      return NextResponse.json(
        { error: "invalid email or password" },
        { status: 401 },
      );
    }

    const token = generateToken();

    const response = NextResponse.json({
      message: "login successful",
      user: { id: user.id, email: user.email },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("login failed", error);
    return NextResponse.json(
      { error: "internal server error", details: String(error) },
      { status: 500 },
    );
  }
}
