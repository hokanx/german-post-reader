import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

process.loadEnvFile(path.resolve(__dirname, ".env.local"));

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // Every URL assertion waits on a route the dev server may still be
  // compiling for the first time. 5s (the Playwright default) is shorter than
  // a cold Turbopack compile of a route, which made the suite fail on a clean
  // .next for reasons that had nothing to do with the code under test.
  expect: { timeout: 30_000 },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    // Measured on a clean .next: 37s warm, ~5min on the very first build with
    // no filesystem cache at all. 60s could never pass a cold start.
    timeout: 360_000,
  },
});
