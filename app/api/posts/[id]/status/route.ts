import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentProfile } from "@/lib/auth";

const PatchStatusSchema = z.object({
  status: z.enum(["open", "closed", "resolved"]),
});

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
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }
  if (existing.authorId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = PatchStatusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Validation failed",
        issues: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const post = await prisma.post.update({
    where: { id },
    data: { status: parsed.data.status },
    select: { id: true, status: true, updatedAt: true },
  });
  return NextResponse.json(post);
}
