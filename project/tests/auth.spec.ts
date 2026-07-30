import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

test.describe("auth flow", () => {
  const email = `e2e-${Date.now()}@example.com`;
  const password = "TestPassword123";

  test.afterAll(async () => {
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data } = await admin.auth.admin.listUsers();
    const user = data.users.find((u) => u.email === email);
    if (user) {
      await admin.auth.admin.deleteUser(user.id);
    }
  });

  test("signup -> onboarding -> dashboard", async ({ page }) => {
    await page.goto("/signup");

    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Start free trial" }).click();

    await expect(page).toHaveURL(/\/onboarding$/);
    await expect(
      page.getByRole("heading", { name: "What language works for you?" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /English/ }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
