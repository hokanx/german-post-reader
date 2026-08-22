import { NextResponse } from "next/server";
import { DEMO_MODE } from "@/lib/constants";
import { createServiceClient } from "@/lib/supabase/service";
import { countRegisteredUsers } from "@/lib/profile/count-registered";

/**
 * Backs the landing page's live signup counter (LiveCounter polls this on an
 * interval). Public and unauthenticated by design — it returns only a
 * count, the same number already rendered server-side on first page load.
 */
export const dynamic = "force-dynamic";

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
