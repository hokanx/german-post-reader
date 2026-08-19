import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";
import { DEMO_MODE } from "@/lib/constants";

/**
 * Follows the post-onboarding redirect to wherever it actually lands, so
 * specs don't hardcode the DEMO_MODE=true `/welcome` hop. When DEMO_MODE is
 * true, onboarding redirects to `/welcome` first and this clicks through its
 * "Continue to dashboard" link; when false, onboarding redirects straight to
 * `/dashboard` and there's nothing to click through.
 *
 * Call this right after selecting a language on the onboarding screen.
 */
export async function completeOnboarding(page: Page) {
  if (DEMO_MODE) {
    await expect(page).toHaveURL(/\/welcome$/);
    await page.getByRole("link", { name: "Continue to dashboard" }).click();
  }

  await expect(page).toHaveURL(/\/dashboard$/);
}
