import type { SupabaseClient } from "@supabase/supabase-js";
import { countRegisteredUsers } from "./count-registered";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

async function run() {
  const fakeClient = {
    from: () => ({
      select: async () => ({ count: 348, error: null }),
    }),
  } as unknown as SupabaseClient;

  const result = await countRegisteredUsers(fakeClient);
  assert(
    result.ok === true && result.data === 347,
    "subtracts the fixed seed/demo account from the raw count",
  );

  const emptyClient = {
    from: () => ({
      select: async () => ({ count: 0, error: null }),
    }),
  } as unknown as SupabaseClient;

  const emptyResult = await countRegisteredUsers(emptyClient);
  assert(
    emptyResult.ok === true && emptyResult.data === 0,
    "never returns negative when the raw count is 0 (floors at 0, not -1)",
  );

  const errorClient = {
    from: () => ({
      select: async () => ({ count: null, error: { message: "connection refused" } }),
    }),
  } as unknown as SupabaseClient;

  const errorResult = await countRegisteredUsers(errorClient);
  assert(
    errorResult.ok === false,
    "returns a failed Result on a Supabase query error, instead of silently coercing it to 0",
  );
}

run();
