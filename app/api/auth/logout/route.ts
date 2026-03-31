import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "logout successful",
    });

    response.cookies.set({
      name: "token",
      value: "",
      httpOnly: true,
      path: "/",
      maxAge: 0, // 👈 supprime immédiatement le cookie
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    console.error("logout failed", error);

    return NextResponse.json(
      { error: "internal server error" },
      { status: 500 },
    );
  }
}
