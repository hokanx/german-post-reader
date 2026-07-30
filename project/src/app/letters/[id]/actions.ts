"use server";

import { createClient } from "@/lib/supabase/server";
import { regenerateReplyDraft } from "@/lib/gemini/analyze-letter";
import type { AppLanguage, ReplyTone } from "@/lib/letters/types";
import type { Result } from "@/lib/result";

type Deadline = { date: string; description: string };

export async function regenerateReply(
  letterId: string,
  tone: ReplyTone,
): Promise<Result<{ reply_draft: string; reply_draft_translation: string }>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: "Please log in again." } };
  }

  const { data: letter, error: fetchError } = await supabase
    .from("letters")
    .select("summary, deadlines, risk_flags, language")
    .eq("id", letterId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !letter) {
    return { ok: false, error: { code: "UNKNOWN", message: "Couldn't find that letter.", recovery: "Try again." } };
  }

  const result = await regenerateReplyDraft(
    {
      summary: letter.summary ?? "",
      deadlines: (letter.deadlines ?? []) as Deadline[],
      riskFlags: (letter.risk_flags ?? []) as string[],
    },
    tone,
    letter.language as AppLanguage,
  );

  if (!result.ok) {
    return result;
  }

  const { error: updateError } = await supabase
    .from("letters")
    .update({
      reply_draft: result.data.reply_draft,
      reply_draft_translation: result.data.reply_draft_translation,
    })
    .eq("id", letterId)
    .eq("user_id", user.id);

  if (updateError) {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: "Drafted, but couldn't save the new reply.", recovery: "Try again." },
    };
  }

  return { ok: true, data: result.data };
}
