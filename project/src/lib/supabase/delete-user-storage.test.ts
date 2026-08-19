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
        list: async () => ({ data: [{ name: "letter-1.jpg" }, { name: "letter-2.pdf" }], error: null }),
        remove: async (paths: string[]) => {
          removedPaths.push(...paths);
          return { data: null, error: null };
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
        list: async () => ({ data: [], error: null }),
        remove: async () => {
          throw new Error("should not be called when the user has no files");
        },
      }),
    },
  } as unknown as SupabaseClient;

  await deleteUserLetterFiles(emptyClient, "user-456");
  assert(true, "does nothing (no throw) when the user has no stored files");

  // Test error handling: list() returns an error
  const listErrorClient = {
    storage: {
      from: () => ({
        list: async () => ({ data: null, error: new Error("Network error") }),
        remove: async () => {
          throw new Error("should not be called");
        },
      }),
    },
  } as unknown as SupabaseClient;

  try {
    await deleteUserLetterFiles(listErrorClient, "user-789");
    assert(false, "throws when list() returns an error");
  } catch {
    assert(true, "throws when list() returns an error");
  }

  // Test error handling: remove() returns an error
  const removeErrorClient = {
    storage: {
      from: () => ({
        list: async () => ({ data: [{ name: "letter-1.jpg" }], error: null }),
        remove: async () => ({ data: null, error: new Error("Permission denied") }),
      }),
    },
  } as unknown as SupabaseClient;

  try {
    await deleteUserLetterFiles(removeErrorClient, "user-000");
    assert(false, "throws when remove() returns an error");
  } catch {
    assert(true, "throws when remove() returns an error");
  }
}

run();
