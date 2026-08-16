"use server";

import { createClient } from "@/lib/supabase/server";
import { regenerateReplyDraft, translateLetterContent } from "@/lib/gemini/analyze-letter";
import type { AppLanguage, ReplyTone } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import type { Result } from "@/lib/result";

type Deadline = { date: string; description: string };
type KeyFact = { label: string; value: string; source_quote: string };

type ReplyDraftResult = {
  reply_draft: string;
  reply_draft_translation: string;
  answer_understood: boolean;
  answer_clarification: string;
};

export async function regenerateReply(
  letterId: string,
  tone: ReplyTone,
  uiLanguage: AppLanguage,
  answer?: string,
): Promise<Result<ReplyDraftResult>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: APP_COPY[uiLanguage].upload.pleaseLoginAgain } };
  }

  const { data: letter, error: fetchError } = await supabase
    .from("letters")
    .select("summary, deadlines, risk_flags")
    .eq("id", letterId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !letter) {
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: APP_COPY[uiLanguage].letters.couldntFindLetter,
        recovery: APP_COPY[uiLanguage].dashboard.errorRecovery,
      },
    };
  }

  const copy = APP_COPY[uiLanguage].letters;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, postal_address")
    .eq("id", user.id)
    .single();

  // The reply draft is regenerated fresh right now, in the account's current
  // language — it does not stay pinned to whatever language the letter's
  // original analysis (summary/deadlines/risk_flags, passed below only as
  // context text) happened to be written in.
  const result = await regenerateReplyDraft(
    {
      summary: letter.summary ?? "",
      deadlines: (letter.deadlines ?? []) as Deadline[],
      riskFlags: (letter.risk_flags ?? []) as string[],
    },
    tone,
    uiLanguage,
    answer,
    { fullName: profile?.full_name ?? null, postalAddress: profile?.postal_address ?? null },
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

/**
 * Translates a letter's stored content (summary, deadlines, risk flags,
 * key facts, reply translation) into targetLanguage and persists it,
 * including bumping letters.language — so once translated, the letter is
 * considered analyzed in that language going forward (dashboard/deadlines
 * previews pick it up on their next fetch too, since they read the same
 * row). source_quote and the German reply_draft itself are untouched.
 */
export async function translateLetter(letterId: string, targetLanguage: AppLanguage): Promise<Result<null>> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: APP_COPY[targetLanguage].upload.pleaseLoginAgain } };
  }

  const { data: letter, error: fetchError } = await supabase
    .from("letters")
    .select("summary, deadlines, risk_flags, key_facts, reply_draft_translation, language")
    .eq("id", letterId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !letter) {
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: APP_COPY[targetLanguage].letters.couldntFindLetter,
        recovery: APP_COPY[targetLanguage].dashboard.errorRecovery,
      },
    };
  }

  if (letter.language === targetLanguage) {
    return { ok: true, data: null };
  }

  const copy = APP_COPY[targetLanguage].letters;

  const result = await translateLetterContent(
    {
      summary: letter.summary ?? "",
      deadlines: (letter.deadlines ?? []) as Deadline[],
      riskFlags: (letter.risk_flags ?? []) as string[],
      keyFacts: (letter.key_facts ?? []) as KeyFact[],
      replyDraftTranslation: letter.reply_draft_translation ?? "",
    },
    targetLanguage,
  );

  if (!result.ok) {
    return { ok: false, error: { code: result.error.code, message: copy.translationFailedToast, recovery: copy.translationFailedRecovery } };
  }

  const { error: updateError } = await supabase
    .from("letters")
    .update({
      summary: result.data.summary,
      deadlines: result.data.deadlines,
      risk_flags: result.data.riskFlags,
      key_facts: result.data.keyFacts,
      reply_draft_translation: result.data.replyDraftTranslation,
      language: targetLanguage,
    })
    .eq("id", letterId)
    .eq("user_id", user.id);

  if (updateError) {
    return { ok: false, error: { code: "UNKNOWN", message: copy.translationFailedToast, recovery: copy.translationFailedRecovery } };
  }

  return { ok: true, data: null };
}
