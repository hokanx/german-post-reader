import { Resend } from "resend";
import { env } from "@/lib/env";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { WELCOME_EMAIL_COPY } from "@/emails/copy";
import type { AppLanguage } from "@/lib/letters/types";

function plainTextBody(language: AppLanguage) {
  const copy = WELCOME_EMAIL_COPY[language];
  const lines = [
    copy.heading,
    "",
    copy.intro(FREE_LETTER_LIMIT),
    "",
    ...copy.features.map((f) => `${f.label}: ${f.text}`),
    "",
    copy.riskNote,
    copy.priceNote(formatEur(SUBSCRIPTION_PRICE_EUR)),
    "",
    `${copy.cta}: https://papkram.de/upload`,
    "",
    copy.footer,
  ];
  return lines.join("\n");
}

/**
 * Fire-and-forget: a missed welcome email is never worth blocking onboarding
 * over, so failures (including a missing RESEND_API_KEY in early dev) are
 * logged, not thrown.
 */
export async function sendWelcomeEmail(to: string, language: AppLanguage = "en") {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    console.warn("sendWelcomeEmail: RESEND_API_KEY/RESEND_FROM_EMAIL not configured, skipping");
    return;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: WELCOME_EMAIL_COPY[language].subject(FREE_LETTER_LIMIT),
      react: WelcomeEmail({ language }),
      text: plainTextBody(language),
    });
  } catch (error) {
    console.error("sendWelcomeEmail failed", error);
  }
}
