import type { SupabaseClient } from "@supabase/supabase-js";
import { deleteUserLetterFiles } from "./delete-user-storage";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

async function run() {
  const removedPaths: string[] = [];
  const fakeClient = {
    storage: {
      from: () => ({
        list: async () => ({ data: [{ name: "letter-1.jpg" }, { name: "letter-2.pdf" }] }),
        remove: async (paths: string[]) => {
          removedPaths.push(...paths);
        },
      }),
    },
  } as unknown as SupabaseClient;

  await deleteUserLetterFiles(fakeClient, "user-123");

  assert(removedPaths.length === 2, "removes every file returned by list()");
  assert(
    removedPaths.includes("user-123/letter-1.jpg") && removedPaths.includes("user-123/letter-2.pdf"),
    "builds the correct {userId}/{filename} paths",
  );

  const emptyClient = {
    storage: {
      from: () => ({
        list: async () => ({ data: [] }),
        remove: async () => {
          throw new Error("should not be called when the user has no files");
        },
      }),
    },
  } as unknown as SupabaseClient;

  await deleteUserLetterFiles(emptyClient, "user-456");
  assert(true, "does nothing (no throw) when the user has no stored files");
}

run();
