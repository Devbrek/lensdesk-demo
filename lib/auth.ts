const DEMO_EMAIL = "lens@mail.com";
const DEMO_PASSWORD = "lens123";
const DEMO_TOKEN = "demo-token-lensdesk-2026";

export function verifyCredentials(email: string, password: string): boolean {
  return email === DEMO_EMAIL && password === DEMO_PASSWORD;
}

export function generateToken(): string {
  return DEMO_TOKEN;
}

export function verifyToken(token: string): { userId: string } | null {
  if (token === DEMO_TOKEN) {
    return { userId: "demo-user" };
  }
  return null;
}

export function extractTokenFromHeader(authHeader?: string): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
}
