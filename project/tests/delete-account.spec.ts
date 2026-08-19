import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

test.describe("self-service account deletion", () => {
  const email = `e2e-delete-${Date.now()}@example.com`;
  const password = "TestPassword123";
  let userId: string;

  test.afterAll(async () => {
    // Only relevant if the deletion itself failed and left the user behind —
    // a successful run has already deleted this user, so this is a safety net.
    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data } = await admin.auth.admin.listUsers();
    const leftover = data.users.find((u) => u.email === email);
    if (leftover) {
      await admin.auth.admin.deleteUser(leftover.id);
    }
  });

  test("deletes the account, its storage files, and signs the user out", async ({ page }) => {
    await page.goto("/signup");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill(password);
    await page.getByRole("button", { name: "Start free trial" }).click();
    await expect(page).toHaveURL(/\/onboarding$/);
    await page.getByRole("button", { name: /English/ }).click();

    // Demo mode redirects post-onboarding to /welcome first, not straight to
    // /dashboard — follow that hop before asserting the dashboard is reached.
    await expect(page).toHaveURL(/\/welcome$/);
    await page.getByRole("link", { name: "Continue to dashboard" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    const admin = createClient(supabaseUrl, serviceRoleKey);
    const { data: listData } = await admin.auth.admin.listUsers();
    const user = listData.users.find((u) => u.email === email);
    if (!user) throw new Error("signed-up user not found via admin client");
    userId = user.id;

    // Seed a fake storage object directly (bypassing the real upload/Gemini
    // pipeline, which is slow and rate-limited) so storage cleanup has
    // something real to verify.
    await admin.storage.from("letters").upload(`${userId}/fake-letter.txt`, new Blob(["test content"]));

    await page.goto("/settings");
    await page.getByRole("button", { name: "Delete account" }).click();
    await page.getByLabel("Type DELETE to confirm").fill("DELETE");
    await page.getByRole("button", { name: "Delete my account" }).click();

    await expect(page).toHaveURL("/");
    await expect(page.getByText("Your account and all associated data have been deleted.")).toBeVisible();

    const { data: afterDelete } = await admin.auth.admin.listUsers();
    const stillExists = afterDelete.users.some((u) => u.email === email);
    expect(stillExists).toBe(false);

    const { data: remainingFiles } = await admin.storage.from("letters").list(userId);
    expect(remainingFiles?.length ?? 0).toBe(0);
  });
});
