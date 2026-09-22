import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/service";
import { countRegisteredUsers } from "@/lib/profile/count-registered";

/**
 * Backs the landing page's live signup counter (LiveCounter polls this on an
 * interval). Public and unauthenticated by design — it returns only a
 * count, the same number already rendered server-side on first page load.
 */
// Was `force-dynamic`, which made every poll a fresh serverless invocation
// running a service-role COUNT(*) on profiles — driven entirely by anonymous
// landing traffic, unthrottled, to display a number that changed 10 times in
// 53 days. Measured at ~113ms of transatlantic query time per request (the
// functions run in iad1, the database in eu-central-1).
//
// 60s is still honestly "live" for a signup counter, and it collapses the
// database load between revalidations to zero.
export const revalidate = 60;

export async function GET() {
  if (!DEMO_MODE) {
    return NextResponse.json({ count: null });
  }

  try {
    const result = await countRegisteredUsers(createServiceClient());
    if (!result.ok) {
      console.error("countRegisteredUsers failed", result.error);
      return NextResponse.json({ count: null });
    }
    return NextResponse.json({ count: result.data });
  } catch (error) {
    console.error("countRegisteredUsers threw", error);
    return NextResponse.json({ count: null });
  }
}
