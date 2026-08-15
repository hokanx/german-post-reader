"use server";

import { createClient } from "@/lib/supabase/server";
import { regenerateReplyDraft } from "@/lib/gemini/analyze-letter";
import type { AppLanguage, ReplyTone } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import type { Result } from "@/lib/result";

type Deadline = { date: string; description: string };

type ReplyDraftResult = {
  reply_draft: string;
  reply_draft_translation: string;
  answer_understood: boolean;
  answer_clarification: string;
};

export async function regenerateReply(
  letterId: string,
  tone: ReplyTone,
  answer?: string,
): Promise<Result<ReplyDraftResult>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Not known yet which letter (and so which language) is involved.
  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: APP_COPY.en.upload.pleaseLoginAgain } };
  }

  const { data: letter, error: fetchError } = await supabase
    .from("letters")
    .select("summary, deadlines, risk_flags, language")
    .eq("id", letterId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !letter) {
    return {
      ok: false,
      error: { code: "UNKNOWN", message: APP_COPY.en.letters.couldntFindLetter, recovery: APP_COPY.en.dashboard.errorRecovery },
    };
  }

  const language = letter.language as AppLanguage;
  const copy = APP_COPY[language].letters;

  const result = await regenerateReplyDraft(
    {
      summary: letter.summary ?? "",
      deadlines: (letter.deadlines ?? []) as Deadline[],
      riskFlags: (letter.risk_flags ?? []) as string[],
    },
    tone,
    language,
    answer,
  );

  if (!result.ok) {
    return result;
  }

  // Junk/gibberish/off-topic answers never get persisted — the letter keeps
  // whatever reply_draft it already had (pipeline-authored or a prior
  // successful wizard run) rather than being overwritten with a draft built
  // from an answer Gemini itself flagged as not making sense.
  if (!result.data.answer_understood) {
    return { ok: true, data: result.data };
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
      error: { code: "UNKNOWN", message: copy.draftedButNotSaved, recovery: copy.errorRecovery },
    };
  }

  return { ok: true, data: result.data };
}
