"use server";

import { createClient } from "@/lib/supabase/server";
import { regenerateReplyDraft, translateLetterContent, type TranslatableLetterContent } from "@/lib/gemini/analyze-letter";
import type { AppLanguage, ReplyTone } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import type { Result } from "@/lib/result";

type Deadline = { date: string; description: string };
type Payment = { description: string; amount: string; source_quote: string };
type Appointment = { description: string; date: string; source_quote: string };
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

type CachedTranslation = {
  summary: string;
  deadlines: Deadline[];
  risk_flags: string[];
  payments: Payment[];
  appointments: Appointment[];
  key_facts: KeyFact[];
  reply_draft_translation: string;
};

function applyTranslation(content: CachedTranslation): TranslatableLetterContent {
  return {
    summary: content.summary,
    deadlines: content.deadlines,
    riskFlags: content.risk_flags,
    payments: content.payments,
    appointments: content.appointments,
    keyFacts: content.key_facts,
    replyDraftTranslation: content.reply_draft_translation,
  };
}

/**
 * Translates a letter's stored content (summary, deadlines, risk flags,
 * key facts, reply translation) into targetLanguage and persists it,
 * including bumping letters.language — so once translated, the letter is
 * considered analyzed in that language going forward (dashboard/deadlines
 * previews pick it up on their next fetch too, since they read the same
 * row). source_quote and the German reply_draft itself are untouched.
 *
 * Every (letter, language) translation is cached in letter_translations —
 * the upload pipeline seeds the row for the original analysis language for
 * free, and every fresh translation here adds its own row. So switching
 * en -> tr -> en hits Gemini once, not twice: the switch back to a
 * previously-seen language is a cache read, not a re-translation (which
 * would also have been translating an already-translated text).
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
    .select("summary, deadlines, risk_flags, payments, appointments, key_facts, reply_draft_translation, language")
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

  const { data: cached } = await supabase
    .from("letter_translations")
    .select("summary, deadlines, risk_flags, payments, appointments, key_facts, reply_draft_translation")
    .eq("letter_id", letterId)
    .eq("language", targetLanguage)
    .maybeSingle();

  let translated: TranslatableLetterContent;

  if (cached) {
    translated = applyTranslation(cached as CachedTranslation);
  } else {
    const result = await translateLetterContent(
      {
        summary: letter.summary ?? "",
        deadlines: (letter.deadlines ?? []) as Deadline[],
        riskFlags: (letter.risk_flags ?? []) as string[],
        payments: (letter.payments ?? []) as Payment[],
        appointments: (letter.appointments ?? []) as Appointment[],
        keyFacts: (letter.key_facts ?? []) as KeyFact[],
        replyDraftTranslation: letter.reply_draft_translation ?? "",
      },
      targetLanguage,
    );

    if (!result.ok) {
      return { ok: false, error: { code: result.error.code, message: copy.translationFailedToast, recovery: copy.translationFailedRecovery } };
    }
    translated = result.data;

    // Best-effort: a failed cache write shouldn't fail the translation the
    // user is actually waiting on, just cost a Gemini call again next time.
    await supabase.from("letter_translations").upsert(
      {
        letter_id: letterId,
        language: targetLanguage,
        summary: translated.summary,
        deadlines: translated.deadlines,
        risk_flags: translated.riskFlags,
        payments: translated.payments,
        appointments: translated.appointments,
        key_facts: translated.keyFacts,
        reply_draft_translation: translated.replyDraftTranslation,
      },
      { onConflict: "letter_id,language" },
    );
  }

  // Staleness guard: if the account's language changed again while this
  // translation was in flight (rapid re-toggling), a newer translateLetter
  // call for the new language may already be running or have finished.
  // Applying this stale result on top would flip letters.language back and
  // undo it. The cache write above still stands — it's correct regardless
  // of which language is "current" — only this materialized-row write is
  // skipped.
  const { data: currentProfile } = await supabase.from("profiles").select("language").eq("id", user.id).single();
  if (currentProfile && currentProfile.language !== targetLanguage) {
    return { ok: true, data: null };
  }

  const { error: updateError } = await supabase
    .from("letters")
    .update({
      summary: translated.summary,
      deadlines: translated.deadlines,
      risk_flags: translated.riskFlags,
      payments: translated.payments,
      appointments: translated.appointments,
      key_facts: translated.keyFacts,
      reply_draft_translation: translated.replyDraftTranslation,
      language: targetLanguage,
    })
    .eq("id", letterId)
    .eq("user_id", user.id);

  if (updateError) {
    return { ok: false, error: { code: "UNKNOWN", message: copy.translationFailedToast, recovery: copy.translationFailedRecovery } };
  }

  return { ok: true, data: null };
}
