import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Removes every object under `letters/{userId}/` in Supabase Storage. Not
 * covered by the `profiles`/`letters` table cascade delete — storage objects
 * live outside Postgres, so this has to be done explicitly before (or
 * alongside) deleting the account's rows.
 */
export async function deleteUserLetterFiles(service: SupabaseClient, userId: string): Promise<void> {
  const { data: files } = await service.storage.from("letters").list(userId);
  if (!files || files.length === 0) return;

  const paths = files.map((file) => `${userId}/${file.name}`);
  await service.storage.from("letters").remove(paths);
}
