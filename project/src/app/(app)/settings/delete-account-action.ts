"use server";

import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createStripeClient } from "@/lib/stripe";
import { cancelActiveSubscriptions } from "@/lib/stripe-cancel-subscriptions";
import { deleteUserLetterFiles } from "@/lib/supabase/delete-user-storage";
import { trackServerEvent } from "@/lib/analytics/track-server-event";
import type { AppLanguage } from "@/lib/letters/types";
import { APP_COPY } from "@/lib/i18n/copy";
import type { Result } from "@/lib/result";

export async function deleteAccount(language: AppLanguage = "en"): Promise<Result<null>> {
  const copy = APP_COPY[language].settings;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: { code: "UNAUTHENTICATED", message: copy.deleteAccountUnauthenticated } };
  }

  const service = createServiceClient();

  try {
    await deleteUserLetterFiles(service, user.id);
  } catch (error) {
    console.error("deleteAccount: storage cleanup failed", error);
  }

  const { data: profile } = await service
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (profile?.stripe_customer_id) {
    try {
      const stripe = createStripeClient();
      await cancelActiveSubscriptions(stripe, profile.stripe_customer_id);
    } catch (error) {
      console.error("deleteAccount: stripe cancellation failed", error);
    }
  }

  try {
    await trackServerEvent(user.id, "account_deleted");
  } catch (error) {
    console.error("deleteAccount: analytics tracking failed", error);
  }

  const { error: deleteError } = await service.auth.admin.deleteUser(user.id);

  if (deleteError) {
    console.error("deleteAccount: auth.admin.deleteUser failed", deleteError);
    return {
      ok: false,
      error: {
        code: "UNKNOWN",
        message: copy.deleteAccountFailed,
        recovery: copy.deleteAccountFailedRecovery,
      },
    };
  }

  return { ok: true, data: null };
}
