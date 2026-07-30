import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

/**
 * Service-role client — bypasses RLS. Server-only, never imported into a
 * client component. Used only where RLS must be intentionally bypassed:
 * creating the profiles row right after signup (no insert policy exists on
 * profiles by design) and the upload pipeline's trial-limit enforcement.
 */
export function createServiceClient() {
  return createSupabaseClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
