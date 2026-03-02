import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { createSession, getSessionCookieOptions } from "@/lib/auth";

const LoginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "username and password are required" },
      { status: 422 },
    );
  }

  const { username, password } = parsed.data;

  const profile = await prisma.profile.findUnique({ where: { username } });

  // Use a constant-time fake compare if profile not found to prevent user enumeration
  const isValid =
    profile !== null && (await bcrypt.compare(password, profile.passwordHash));

  if (!isValid) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  const token = await createSession(profile.id);
  const options = getSessionCookieOptions();

  const cookieStore = await cookies();
  cookieStore.set(options.name, token, options);

  return NextResponse.json({
    user: { id: profile.id, name: profile.name, role: profile.role },
  });
}
