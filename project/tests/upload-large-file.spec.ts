import path from "node:path";
import { test, expect } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

test.describe("large file upload", () => {
  const email = `large-file-${Date.now()}@example.com`;
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
      language: "en",
      has_active_subscription: false,
      trial_letters_used: 0,
    });
  });

  test.afterAll(async () => {
    if (userId) await admin.auth.admin.deleteUser(userId);
  });

  test("a real-phone-photo-sized upload (~1.5MB) never crashes the page", async ({ page }) => {
    // Gemini now generates both reply_draft (German) and reply_draft_translation,
    // roughly doubling reply-generation output — real calls can run close to 30s,
    // so the default Playwright test timeout doesn't leave enough margin.
    test.setTimeout(90_000);

    await page.goto("/login");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("TestPassword123");
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    const responses: number[] = [];
    page.on("response", (res) => {
      if (res.url().endsWith("/upload")) responses.push(res.status());
    });

    await page.goto("/upload");
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(path.resolve(__dirname, "fixtures/big-photo.jpg"));
    await page.getByRole("button", { name: "Analyze letter" }).click();

    // Before the fix: Next.js's default 1MB Server Actions body limit
    // rejected this request with an uncaught 413, crashing to the global
    // error boundary. It must now always resolve to one of two acceptable
    // outcomes — a successful results page, or a graceful, specific
    // ErrorState (Gemini itself can still fail transiently, e.g. free-tier
    // rate limits, which is a separate, already-handled concern from the
    // body-size regression this test guards against). The one outcome that
    // must never happen again is the global crash page or a raw 413.
    await Promise.race([
      page.waitForURL(/\/letters\/[0-9a-f-]+$/, { timeout: 80_000 }),
      page.getByText("Analysis failed").waitFor({ timeout: 80_000 }),
    ]);
    await expect(page.getByText("Something broke on our end")).not.toBeVisible();
    expect(responses.every((status) => status !== 413)).toBe(true);
  });
});
