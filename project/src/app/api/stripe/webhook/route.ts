import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { createServiceClient } from "@/lib/supabase/service";
import { createStripeClient } from "@/lib/stripe";
import { trackServerEvent } from "@/lib/analytics/track-server-event";
import { env } from "@/lib/env";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;

    if (!userId) {
      console.error("checkout.session.completed had no client_reference_id", session.id);
      return NextResponse.json({ received: true });
    }

    const customerId =
      typeof session.customer === "string" ? session.customer : (session.customer?.id ?? null);

    const service = createServiceClient();
    const { error } = await service
      .from("profiles")
      .update({
        has_lifetime_access: true,
        ...(customerId ? { stripe_customer_id: customerId } : {}),
      })
      .eq("id", userId);

    if (error) {
      console.error("Failed to grant lifetime access from webhook", error);
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }

    await trackServerEvent(userId, "unlimited_purchased");
  }

  return NextResponse.json({ received: true });
}
