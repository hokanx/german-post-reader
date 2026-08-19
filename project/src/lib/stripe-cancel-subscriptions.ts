import type Stripe from "stripe";

/**
 * Cancels every currently-active subscription for a Stripe customer,
 * immediately (not at period end) — used when deleting an account, where
 * there's no "let it run out" grace period to honor.
 */
export async function cancelActiveSubscriptions(stripe: Stripe, customerId: string): Promise<void> {
  const subscriptions = await stripe.subscriptions.list({ customer: customerId, status: "active" });
  await Promise.all(subscriptions.data.map((subscription) => stripe.subscriptions.cancel(subscription.id)));
}
