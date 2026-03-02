import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth";

const UpdatePostSchema = z.object({
  title: z.string().min(3).max(120).optional(),
  description: z.string().min(10).max(2000).optional(),
  tags: z.array(z.string().max(40)).max(10).optional(),
  contactLink: z.string().url().optional().or(z.literal("")).optional(),
  eventDate: z.string().datetime().optional().or(z.literal("")).optional(),
  location: z.string().max(100).optional(),
  helpType: z.enum(["request", "offer"]).optional(),
});

// ─── PATCH /api/posts/:id ──────────────────────────────────────────────────

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = UpdatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { contactLink, eventDate, ...rest } = parsed.data;

  const updated = await prisma.post.update({
    where: { id },
    data: {
      ...rest,
      ...(contactLink !== undefined
        ? { contactLink: contactLink || null }
        : {}),
      ...(eventDate !== undefined
        ? { eventDate: eventDate ? new Date(eventDate) : null }
        : {}),
    },
    include: { author: { select: { id: true, name: true, role: true } } },
  });

  return NextResponse.json(updated);
}

// ─── DELETE /api/posts/:id ─────────────────────────────────────────────────

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  if (existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
