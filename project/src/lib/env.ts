import { z } from "zod";

function emptyToUndefined(value: string | undefined) {
  return value === "" ? undefined : value;
}

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  GEMINI_API_KEY: z.string().min(1).optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  RESEND_LAUNCH_AUDIENCE_ID: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
  STRIPE_PRICE_ID: z.string().min(1).optional(),
  STRIPE_PRICE_ID_MONTHLY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional(),
  SENTRY_DSN: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: emptyToUndefined(process.env.NEXT_PUBLIC_SUPABASE_URL),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: emptyToUndefined(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  SUPABASE_SERVICE_ROLE_KEY: emptyToUndefined(process.env.SUPABASE_SERVICE_ROLE_KEY),
  GEMINI_API_KEY: emptyToUndefined(process.env.GEMINI_API_KEY),
  RESEND_API_KEY: emptyToUndefined(process.env.RESEND_API_KEY),
  RESEND_FROM_EMAIL: emptyToUndefined(process.env.RESEND_FROM_EMAIL),
  RESEND_LAUNCH_AUDIENCE_ID: emptyToUndefined(process.env.RESEND_LAUNCH_AUDIENCE_ID),
  STRIPE_SECRET_KEY: emptyToUndefined(process.env.STRIPE_SECRET_KEY),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: emptyToUndefined(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
  STRIPE_WEBHOOK_SECRET: emptyToUndefined(process.env.STRIPE_WEBHOOK_SECRET),
  STRIPE_PRICE_ID: emptyToUndefined(process.env.STRIPE_PRICE_ID),
  STRIPE_PRICE_ID_MONTHLY: emptyToUndefined(process.env.STRIPE_PRICE_ID_MONTHLY),
  NEXT_PUBLIC_POSTHOG_KEY: emptyToUndefined(process.env.NEXT_PUBLIC_POSTHOG_KEY),
  NEXT_PUBLIC_POSTHOG_HOST: emptyToUndefined(process.env.NEXT_PUBLIC_POSTHOG_HOST),
  SENTRY_DSN: emptyToUndefined(process.env.SENTRY_DSN),
  NEXT_PUBLIC_SENTRY_DSN: emptyToUndefined(process.env.NEXT_PUBLIC_SENTRY_DSN),
});
