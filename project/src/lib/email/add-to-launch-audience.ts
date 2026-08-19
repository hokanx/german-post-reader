import { Resend } from "resend";
import { env } from "@/lib/env";

/**
 * Fire-and-forget: adds an email to the pre-launch Resend Audience so it
 * can be emailed once when Papkram fully launches. A missed add is never
 * worth blocking signup over — failures are logged, not thrown. Same
 * pattern as sendWelcomeEmail.
 */
export async function addToLaunchAudience(email: string): Promise<void> {
  if (!env.RESEND_API_KEY || !env.RESEND_LAUNCH_AUDIENCE_ID) {
    console.warn("addToLaunchAudience: RESEND_API_KEY/RESEND_LAUNCH_AUDIENCE_ID not configured, skipping");
    return;
  }

  try {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.contacts.create({ email, audienceId: env.RESEND_LAUNCH_AUDIENCE_ID });
  } catch (error) {
    console.error("addToLaunchAudience failed", error);
  }
}
