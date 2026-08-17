-- The `letters` table has only ever had SELECT and INSERT RLS policies
-- (see 0001_init.sql) — no UPDATE policy was ever created. Under RLS, an
-- UPDATE with no permissive policy silently matches zero rows instead of
-- erroring, so every write that goes through the user-scoped client
-- (not the service role) — regenerateReply's reply_draft save, and
-- translateLetter's translation + language bump — has been silently
-- no-op-ing: Gemini runs, the UI shows the new content from the action's
-- return value, but nothing persists, so a reload reverts it and
-- translateLetter re-fires (and re-bills) on every visit. Mirrors the
-- existing "profiles: update own row" policy shape exactly.
create policy "letters: update own rows"
  on public.letters for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
