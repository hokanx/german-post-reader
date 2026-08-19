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
      select: async () => ({ count: 348 }),
    }),
  } as unknown as SupabaseClient;

  const result = await countRegisteredUsers(fakeClient);
  assert(result === 347, "subtracts the fixed seed/demo account from the raw count");

  const emptyClient = {
    from: () => ({
      select: async () => ({ count: 0 }),
    }),
  } as unknown as SupabaseClient;

  const emptyResult = await countRegisteredUsers(emptyClient);
  assert(emptyResult === 0, "never returns negative when the raw count is 0 (floors at 0, not -1)");

  const nullClient = {
    from: () => ({
      select: async () => ({ count: null }),
    }),
  } as unknown as SupabaseClient;

  const nullResult = await countRegisteredUsers(nullClient);
  assert(nullResult === 0, "treats a null count (query failure) as 0, not a crash");
}

run();
