import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder");

function signPayload(payload: unknown) {
  const payloadString = JSON.stringify(payload);
  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: webhookSecret,
  });
  return { payloadString, header };
}

test.describe.serial("stripe webhook", () => {
  const email = `stripe-webhook-${Date.now()}@example.com`;
  const stripeCustomerId = `cus_test_${Date.now()}`;
  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  let userId: string;

  test.beforeAll(async () => {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: "TestPassword123",
      email_confirm: true,
    });
    if (error || !data.user) throw new Error(`Failed to create test user: ${error?.message}`);
    userId = data.user.id;

    await admin.from("profiles").upsert({
      id: userId,
      subscription_status: "trialing",
      trial_letters_used: 0,
      stripe_customer_id: stripeCustomerId,
    });
  });

  test.afterAll(async () => {
    if (userId) await admin.auth.admin.deleteUser(userId);
  });

  test("customer.subscription.updated sets subscription_status to active", async ({ request }) => {
    const event = {
      id: "evt_test_updated",
      object: "event",
      type: "customer.subscription.updated",
      data: {
        object: {
          id: "sub_test_123",
          object: "subscription",
          customer: stripeCustomerId,
          status: "active",
        },
      },
    };
    const { payloadString, header } = signPayload(event);

    const response = await request.post("/api/stripe/webhook", {
      data: payloadString,
      headers: { "content-type": "application/json", "stripe-signature": header },
    });
    expect(response.ok()).toBeTruthy();

    const { data: profile } = await admin
      .from("profiles")
      .select("subscription_status")
      .eq("id", userId)
      .single();
    expect(profile?.subscription_status).toBe("active");
  });

  test("customer.subscription.deleted sets subscription_status to canceled", async ({ request }) => {
    const event = {
      id: "evt_test_deleted",
      object: "event",
      type: "customer.subscription.deleted",
      data: {
        object: {
          id: "sub_test_123",
          object: "subscription",
          customer: stripeCustomerId,
          status: "canceled",
        },
      },
    };
    const { payloadString, header } = signPayload(event);

    const response = await request.post("/api/stripe/webhook", {
      data: payloadString,
      headers: { "content-type": "application/json", "stripe-signature": header },
    });
    expect(response.ok()).toBeTruthy();

    const { data: profile } = await admin
      .from("profiles")
      .select("subscription_status")
      .eq("id", userId)
      .single();
    expect(profile?.subscription_status).toBe("canceled");
  });

  test("invalid signature is rejected", async ({ request }) => {
    const response = await request.post("/api/stripe/webhook", {
      data: JSON.stringify({ id: "evt_bad", object: "event", type: "customer.subscription.updated" }),
      headers: { "content-type": "application/json", "stripe-signature": "t=1,v1=invalid" },
    });
    expect(response.status()).toBe(400);
  });
});
