import * as Sentry from "@sentry/nextjs";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { createStripeClient } from "@/lib/stripe";
import { env } from "@/lib/env";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !user.email) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const plan = body?.plan === "monthly" ? "monthly" : "yearly";
  const priceId = plan === "monthly" ? env.STRIPE_PRICE_ID_MONTHLY : env.STRIPE_PRICE_ID;

  if (!priceId) {
    return NextResponse.json({ error: "Billing is not configured yet" }, { status: 503 });
  }

  const service = createServiceClient();
  const { data: profile } = await service
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const stripe = createStripeClient();
  let customerId = profile?.stripe_customer_id ?? null;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    const { error: linkError } = await service
      .from("profiles")
      .update({ stripe_customer_id: customerId })
      .eq("id", user.id);

    // This write is what lets the webhook find the user again — it matches on
    // stripe_customer_id. If it fails silently, checkout still opens, the card
    // is charged, and then every webhook delivery 500s because no profile
    // matches, so has_active_subscription never flips: the user has paid and
    // has no access, while the dashboard shows a success toast. Refuse to
    // start checkout we cannot complete.
    if (linkError) {
      console.error("checkout: failed to link stripe_customer_id", linkError);
      Sentry.captureException(linkError, { tags: { route: "stripe/checkout" } });
      return NextResponse.json({ error: "Could not start checkout" }, { status: 500 });
    }
  }

  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${origin}/dashboard?subscribed=true`,
    cancel_url: `${origin}/dashboard`,
  });

  if (!session.url) {
    return NextResponse.json({ error: "Could not create checkout session" }, { status: 500 });
  }

  return NextResponse.json({ url: session.url });
}
