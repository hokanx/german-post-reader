import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Removes every object under `letters/{userId}/` in Supabase Storage. Not
 * covered by the `profiles`/`letters` table cascade delete — storage objects
 * live outside Postgres, so this has to be done explicitly before (or
 * alongside) deleting the account's rows.
 */
export async function deleteUserLetterFiles(service: SupabaseClient, userId: string): Promise<void> {
  const { data: files, error: listError } = await service.storage.from("letters").list(userId);
  if (listError) throw listError;
  if (!files || files.length === 0) return;

  const paths = files.map((file) => `${userId}/${file.name}`);
  const { error: removeError } = await service.storage.from("letters").remove(paths);
  if (removeError) throw removeError;
}
