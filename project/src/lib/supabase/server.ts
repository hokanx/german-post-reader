import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

/**
 * RLS-scoped client for Server Components and Server Actions. Cookie writes
 * silently no-op when called from a Server Component (cookies are read-only
 * there) — session refresh in that case is handled by src/proxy.ts.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // called from a Server Component render — proxy.ts refreshes the session instead
          }
        },
      },
    },
  );
}
