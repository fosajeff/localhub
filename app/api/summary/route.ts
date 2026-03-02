import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/summary
// Returns count of posts per type created in the last 7 days.

export async function GET() {
  const since = new Date();
  since.setDate(since.getDate() - 7);

  const rows = await prisma.post.groupBy({
    by: ["type"],
    where: { createdAt: { gte: since } },
    _count: { _all: true },
  });

  // Build a typed map
  const counts: Record<string, number> = {
    job: 0,
    event: 0,
    help: 0,
    project: 0,
    article: 0,
  };

  for (const row of rows) {
    counts[row.type] = row._count._all;
  }

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return NextResponse.json({ total, counts, since: since.toISOString() });
}
