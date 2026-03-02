import { getCurrentProfile } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const profile = await getCurrentProfile();
  if (!profile) return NextResponse.json(null);
  return NextResponse.json(profile);
}
