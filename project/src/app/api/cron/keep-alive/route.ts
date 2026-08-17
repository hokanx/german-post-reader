import { NextResponse, type NextRequest } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * Supabase's free tier pauses a project after a week with no activity.
 * Vercel Cron hits this daily (see vercel.json) with a trivial read so the
 * database never goes idle long enough to pause — delays the jump to
 * Supabase Pro until traffic actually needs it.
 */
export async function GET(request: NextRequest) {
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const service = createServiceClient();
  const { error } = await service.from("profiles").select("id").limit(1);

  if (error) {
    console.error("Keep-alive ping failed", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() });
}
