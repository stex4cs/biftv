import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "biftv_admin";
const COOKIE_MAX_AGE = 60 * 60 * 12;

function secretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_API_TOKEN;
  if (!secret) {
    throw new Error("Missing ADMIN_SESSION_SECRET (or ADMIN_API_TOKEN fallback)");
  }
  return new TextEncoder().encode(secret);
}

export async function signAdminSession(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${COOKIE_MAX_AGE}s`)
    .setSubject("admin")
    .sign(secretKey());
}

export async function verifyAdminSession(
  token: string | undefined,
): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload.sub === "admin";
  } catch {
    return false;
  }
}

export const ADMIN_COOKIE_NAME = COOKIE_NAME;
export const ADMIN_COOKIE_MAX_AGE = COOKIE_MAX_AGE;
