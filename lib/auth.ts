import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

const COOKIE_NAME = "localhub_session";
const ALG = "HS256";

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

// ─── Sign & set cookie ───────────────────────────────────────────────────────

export async function createSession(profileId: string): Promise<string> {
  const token = await new SignJWT({ sub: profileId })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  return token;
}

export function getSessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  };
}

// ─── Read & verify ────────────────────────────────────────────────────────────
// Wrapped with React cache() so it runs at most once per server request,
// preventing duplicate DB queries when the layout + route both call it.

export const getCurrentProfile = cache(async function getCurrentProfile() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALG],
    });
    const profileId = payload.sub;
    if (!profileId) return null;

    return await prisma.profile.findUnique({
      where: { id: profileId },
      select: { id: true, name: true, role: true, username: true },
    });
  } catch {
    return null;
  }
});
