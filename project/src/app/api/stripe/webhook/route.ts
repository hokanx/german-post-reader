import * as Sentry from "@sentry/nextjs";
import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { createStripeClient } from "@/lib/stripe";
import { trackServerEvent } from "@/lib/analytics/track-server-event";
import { env } from "@/lib/env";

/**
 * Stripe subscription statuses that mean "the user currently has paid
 * access" — trialing/past_due/unpaid are Stripe-side grace states we don't
 * use (no Stripe-side trial, no dunning flow yet), collapsed to whatever
 * reads most correctly for a binary access flag.
 */
function isActiveStatus(status: Stripe.Subscription.Status): boolean {
  return status === "active" || status === "trialing";
}

export async function POST(request: NextRequest) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook is not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const rawBody = await request.text();
  const stripe = createStripeClient();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted" ||
    event.type === "customer.subscription.created"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

    const hasActiveSubscription =
      event.type === "customer.subscription.deleted" ? false : isActiveStatus(subscription.status);

    const service = createServiceClient();
    const { data: updated, error } = await service
      .from("profiles")
      .update({ has_active_subscription: hasActiveSubscription })
      .eq("stripe_customer_id", customerId)
      .select("id")
      .maybeSingle();

    // maybeSingle, not single: .single() errors when no profile matches this
    // customer, which made the handler 500 and Stripe retry the same event for
    // days. A Stripe customer with no profile row (created in the dashboard, a
    // test clock, an abandoned checkout) is not our failure — acknowledge it
    // so the retry loop ends, and record it so it is not invisible.
    if (error) {
      console.error("Failed to update has_active_subscription from webhook", error);
      Sentry.captureException(error, { tags: { route: "stripe/webhook", eventType: event.type } });
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    if (!updated) {
      console.warn("Stripe webhook: no profile matches customer", customerId);
      Sentry.captureMessage("Stripe webhook: no profile for customer", {
        level: "warning",
        tags: { route: "stripe/webhook", eventType: event.type },
      });
      return NextResponse.json({ received: true, matched: false });
    }

    // `updated` is non-null past the guard above.
    if (hasActiveSubscription && event.type !== "customer.subscription.updated") {
      await trackServerEvent(updated.id, "subscription_started");
    } else if (!hasActiveSubscription) {
      await trackServerEvent(updated.id, "subscription_canceled");
    }
  }

  return NextResponse.json({ received: true });
}
