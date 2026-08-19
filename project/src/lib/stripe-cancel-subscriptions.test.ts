import type Stripe from "stripe";
import { cancelActiveSubscriptions } from "./stripe-cancel-subscriptions";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

async function run() {
  const canceledIds: string[] = [];
  const fakeStripe = {
    subscriptions: {
      list: async () => ({
        data: [{ id: "sub_1" }, { id: "sub_2" }],
      }),
      cancel: async (id: string) => {
        canceledIds.push(id);
      },
    },
  } as unknown as Stripe;

  await cancelActiveSubscriptions(fakeStripe, "cus_test");

  assert(canceledIds.length === 2, "cancels every active subscription returned by list()");
  assert(canceledIds.includes("sub_1") && canceledIds.includes("sub_2"), "cancels the correct subscription ids");

  const noSubsStripe = {
    subscriptions: {
      list: async () => ({ data: [] }),
      cancel: async () => {
        throw new Error("should not be called when there are no active subscriptions");
      },
    },
  } as unknown as Stripe;

  await cancelActiveSubscriptions(noSubsStripe, "cus_none");
  assert(true, "does nothing (no throw) when the customer has no active subscriptions");
}

run();
