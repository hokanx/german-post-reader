---
description: wire up posthog + sentry + vercel analytics in one shot
---

integrate product analytics, error monitoring, and web vitals into the app. one shot. so the user can see whether anyone's using their thing and whether it's breaking.

## what gets integrated (all free tier)

- **PostHog** — page views + event tracking. free up to 1M events/month, no card required.
- **Sentry** — error monitoring (client + server). free up to 5K events/month, no card required.
- **Vercel Analytics** — web vitals + traffic. free on Vercel hobby tier.
- **`/admin/metrics`** route — internal dashboard combining the three.
- **`docs/privacy.md`** + **`/privacy`** route — drafted disclosure of what's tracked.

terminal rule applies — YOU run every command via Bash. user types only short answers ("y", "n", or API keys when prompted).

## stage 1: stack check + plan

1. read `project/package.json` to confirm the stack. this command assumes next.js or a similar web framework. if it's a React Native / pure-mobile project, STOP and tell the user honestly that mobile analytics needs a different approach (point them at posthog-react-native + sentry-react-native).
2. read `CLAUDE.md` and `SPEC.md` to understand what the app does — you'll use this to pick which user actions to track (signup, primary CTA, key flows).
3. announce the plan, plainly:

   > i'm about to integrate:
   > - **posthog** (product analytics)
   > - **sentry** (error monitoring)
   > - **vercel analytics** (web vitals)
   > - an **/admin/metrics** dashboard route
   > - a **/privacy** disclosure page
   >
   > you'll spend ~3 minutes creating free accounts for posthog and sentry (no credit card). i'll walk you through each.
   > proceed? (y/n)

4. on "n", stop cleanly. on "y", continue.

## stage 2: install packages

5. `cd project && npm install posthog-js posthog-node @sentry/nextjs @vercel/analytics`. if the stack isn't next.js, swap in the right packages (`@sentry/browser` + `@sentry/node` for vite, etc.).
6. capture install output. on failure: check node version (`node --version`), retry once, then stop with an honest error.

## stage 3: PostHog setup

7. tell the user:

   > **PostHog** — open <https://posthog.com/signup> in a new browser tab.
   > sign up (free, no card). create a new project. copy the **project API key** (starts with `phc_`).
   > paste it here when you have it. type `skip` if you want to skip posthog entirely.

8. wait for the user's response. validate the key starts with `phc_` (case-sensitive); if not, ask once more. on `skip`, skip stages 3a-3d and continue.

9. ask:
   > posthog host — type **us** (https://us.i.posthog.com) or **eu** (https://eu.i.posthog.com)?

10. add both vars to `.env.local` and `.env.example` at the kit root:
    ```
    NEXT_PUBLIC_POSTHOG_KEY=phc_...
    NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
    ```

11. auto-push both to vercel via Bash (same pattern as `/ship-it` env auto-push):
    ```
    printf '%s' "<KEY VALUE>" | vercel env add NEXT_PUBLIC_POSTHOG_KEY preview
    printf '%s' "<HOST VALUE>" | vercel env add NEXT_PUBLIC_POSTHOG_HOST preview
    ```

12. wire posthog into the app. for next.js app router:
    - create `project/src/components/PostHogProvider.tsx` that does `posthog.init(key, { api_host })` on mount and wraps children.
    - import it in `project/src/app/layout.tsx`, wrap the body content.
    - add a `usePathname` + `useEffect` to capture `$pageview` on route changes.

13. add event tracking on critical actions. read SPEC.md `key_user_flows` and `mvp_scope_in` — identify the 2-4 most important user actions (signup, primary CTA, key feature use). for each, add a `posthog.capture('<event_name>')` call at the right code site. show the user the diff before committing.

## stage 4: Sentry setup

14. tell the user:

   > **Sentry** — open <https://sentry.io/signup> in a new browser tab.
   > sign up (free, no card on the Developer plan). create a project, pick "Next.js" (or your framework). copy the **DSN** (it looks like `https://<key>@<id>.ingest.sentry.io/<project>`).
   > paste it here. type `skip` to skip sentry.

15. wait for the DSN. validate the format (must contain `sentry.io` and start with `https://`). on `skip`, skip stages 4a-4d.

16. add `NEXT_PUBLIC_SENTRY_DSN=<dsn>` to `.env.local` and `.env.example`. push to vercel via `printf | vercel env add`.

17. wire sentry manually (do NOT use the interactive CLI wizard — it requires user input we can't automate):
    - create `project/sentry.client.config.ts` initializing `Sentry.init({ dsn: process.env.NEXT_PUBLIC_SENTRY_DSN, tracesSampleRate: 0.1 })`.
    - create `project/sentry.server.config.ts` and `project/sentry.edge.config.ts` with the same init (plus `tracesSampleRate: 0.1`).
    - wrap `project/next.config.js` (or .mjs / .ts) with `withSentryConfig(nextConfig, { silent: true })`. don't enable source-map upload — that needs an auth token we're skipping for the zero-config path.

18. add a `global-error.tsx` if the framework supports it (next.js does) so client errors are captured.

## stage 5: Vercel Analytics

19. import `Analytics` from `@vercel/analytics/react`. add `<Analytics />` to the root layout's body, after any provider components.
20. no keys needed. it auto-detects when deployed to Vercel and silently no-ops locally. tell the user: "vercel analytics will start populating after the next deploy."

## stage 6: /admin/metrics dashboard

21. create `project/src/app/admin/metrics/page.tsx` (route-appropriate path for the stack). the page is a simple internal dashboard:
    - **PostHog**: link to `https://<host>/project/<id>/events` (parse the project id from the key if possible — otherwise just link to the project home).
    - **Sentry**: link to the sentry project URL.
    - **Vercel Analytics**: link to `https://vercel.com/<team>/<project>/analytics`.
    - if posthog and sentry both have read-only tokens that the user provided, fetch top-line counts via their APIs. if not, just show the links. don't ask for additional tokens just for this dashboard — link-out is fine for v1.

22. **protect the route.** check if auth is set up in the project (look for a middleware / session helper). if yes: gate `/admin/metrics` so only the project owner can view (check the user's email matches an `ADMIN_EMAIL` env var — ask the user for their email and add to .env.local + vercel). if no auth yet: gate with `if (process.env.NODE_ENV !== 'development') notFound()` and leave a `TODO: add real auth gate` comment.

## stage 7: privacy disclosure

23. draft `docs/privacy.md` listing what each service tracks:
    - **PostHog**: page views, custom events (signup, primary CTA, etc — list the actual events you wired), browser metadata, IP address (anonymized after 24h).
    - **Sentry**: error details, stack traces, browser info, IP.
    - **Vercel Analytics**: page views, web vitals, country.
    - **Cookies**: list any cookies set by these tools.
24. create `project/src/app/privacy/page.tsx` that renders the disclosure (you can read `docs/privacy.md` at build time or duplicate the content).
25. tell the user, plainly:

   > drafted a privacy policy at `docs/privacy.md` and routed it at `/privacy`.
   > **this is a starting point, NOT a lawyer-reviewed policy.** if you're going to launch to real users (especially in the EU), have a lawyer review or use a service like Termly. for solo founder use to start, it covers what you're tracking.

## stage 8: verify it actually works

26. start the dev server via Bash (you run it, not the user).
27. open the dev URL in chrome-devtools-mcp. click around 2-3 pages.
28. tell the user:
    - "open posthog: <https://app.posthog.com/events> — you should see at least one `$pageview` event within 60 seconds. tell me when you see it."
    - wait for the user to confirm. on confirmation, ship.
    - if they don't see it after 2 minutes: check `.env.local` has the key correctly, restart the dev server, retry.

29. trigger a test sentry error by wiring a hidden route `project/src/app/__test-error/route.ts` that throws. visit it via chrome-devtools-mcp. then tell the user:
    - "open sentry: <https://sentry.io/issues/> — you should see a fresh error within 60 seconds. tell me when you see it."
    - on confirmation, REMOVE the `__test-error` route — that was scaffolding only.

30. vercel analytics doesn't work locally; just tell the user it will populate after the next `/ship-it`.

## stage 9: commit + summary

31. commit with: `feat: add analytics + monitoring (posthog, sentry, vercel)`. show the diff first via `git diff --stat`.
32. final output:

   > **tracking is live:**
   > - posthog: <project dashboard URL>
   > - sentry: <project dashboard URL>
   > - vercel analytics: available after next deploy
   >
   > **what you wired:**
   > - <N> page-view tracking
   > - <N> custom events: <list event names>
   > - <N> error capture sites
   >
   > **dashboard:** <app URL>/admin/metrics (gated)
   > **privacy disclosure:** <app URL>/privacy
   >
   > run /ship-it to redeploy and start collecting real data.

## error handling

- **package install fails** → check node version with `node --version`. if < 18, tell the user honestly; retry once with `npm install` only.
- **`vercel env add` fails** → report honestly. tell the user they can add it via the vercel dashboard, give the exact URL.
- **layout file structure is non-standard** → describe what you'd add and ASK where the right insertion point is. do NOT guess.
- **user pastes a malformed key/DSN** → ask once more with a clearer example. on a second invalid input, skip that integration and continue with the others.
- **GDPR-strict project** (if SPEC.md mentions EU users explicitly or strict privacy) → after step 22 STOP and flag: "your spec mentions EU/GDPR. this default setup is not GDPR-compliant out of the box — you'll need an opt-in cookie banner and anonymous IPs. want me to add a CookieConsent banner now? (y/n)"
