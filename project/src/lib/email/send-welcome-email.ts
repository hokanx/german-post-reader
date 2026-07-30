import { Resend } from "resend";
import { env } from "@/lib/env";
import { FREE_LETTER_LIMIT } from "@/lib/constants";
import { WelcomeEmail } from "@/emails/WelcomeEmail";

/**
 * Fire-and-forget: a missed welcome email is never worth blocking onboarding
 * over, so failures (including a missing RESEND_API_KEY in early dev) are
 * logged, not thrown.
 */
export async function sendWelcomeEmail(to: string) {
  if (!env.RESEND_API_KEY || !env.RESEND_FROM_EMAIL) {
    console.warn("sendWelcomeEmail: RESEND_API_KEY/RESEND_FROM_EMAIL not configured, skipping");
    return;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject: `Welcome — your first ${FREE_LETTER_LIMIT} letters are free`,
      react: WelcomeEmail(),
    });
  } catch (error) {
    console.error("sendWelcomeEmail failed", error);
  }
}
