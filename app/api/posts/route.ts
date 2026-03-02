import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth";

// ─── Validation ────────────────────────────────────────────────────────────

const CreatePostSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(2000),
  type: z.enum(["job", "event", "help", "project", "article"]),
  tags: z.array(z.string().max(40)).max(10).default([]),
  contactLink: z.string().url().optional().or(z.literal("")),
  eventDate: z.string().datetime().optional(),
  location: z.string().max(100).optional(),
  helpType: z.enum(["request", "offer"]).optional(),
});

// ─── GET /api/posts?type=job&status=open&tag=react ──────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const type = searchParams.get("type") ?? undefined;
  const status = searchParams.get("status") ?? undefined;
  const tag = searchParams.get("tag") ?? undefined;

  type WhereClause = {
    type?: "job" | "event" | "help" | "project" | "article";
    status?: "open" | "closed" | "resolved";
    tags?: { has: string };
  };
  const where: WhereClause = {};
  if (type) where.type = type as WhereClause["type"];
  if (status) where.status = status as WhereClause["status"];
  if (tag) where.tags = { has: tag };

  const posts = await prisma.post.findMany({
    where,
    include: { author: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return NextResponse.json(posts);
}

// ─── POST /api/posts ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Auth guard — profile is derived from the session cookie, not from the client
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = CreatePostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const { contactLink, eventDate, ...postData } = parsed.data;

  const post = await prisma.post.create({
    data: {
      ...postData,
      contactLink: contactLink || null,
      eventDate: eventDate ? new Date(eventDate) : null,
      authorId: profile.id,
    },
    include: { author: { select: { id: true, name: true, role: true } } },
  });

  return NextResponse.json(post, { status: 201 });
}
