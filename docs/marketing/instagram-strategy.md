# Papkram — Instagram niche, competitor read & content strategy

**Date:** 2026-08-22
**Status:** strategy draft, ready to execute
**Owner:** founder (solo execution assumed)

---

## 0. What is verified here, and what isn't

Be careful with this doc's confidence levels — they differ by section.

| Claim type | Confidence | Basis |
|---|---|---|
| Market size / language demographics | High | Destatis + microcensus figures via search |
| Direct product competitors exist and what they promise | High | Their own live landing pages, indexed and quoted |
| Platform mechanics (format reach, cadence) | Medium-high | 2026 Instagram studies (Metricool et al.) |
| **Competitor Instagram accounts, follower counts, posting cadence** | **Low — NOT verified** | instagram.com is blocked by this environment's network proxy. Follower numbers below come from third-party write-ups, not from the profiles. |

**Because of that, §12 is a 40-minute manual audit protocol for you to run on your phone.** Do it before spending money on anything. Everything else in this doc holds regardless of what that audit finds; the audit only sharpens the target list.

---

## 1. The niche, honestly defined

Papkram is not in the "translation app" niche. Translation is a solved, zero-margin commodity (DeepL, Google Translate, and now every phone camera). Papkram is in a much smaller, much sharper niche:

> **Bureaucratic anxiety relief for people who cannot read the letter that just arrived.**

The emotional job is not "translate this." It is **"tell me whether I am in trouble, and by when."** The existing landing copy already nails this ("Google Translate gives you the words. Papkram gives you the meaning") — the Instagram strategy is that sentence, dramatized 3–5 times a week.

### Who is actually in it

Three distinct markets that happen to share a product. They do **not** share a feed, a language, a creator set, or a purchase psychology.

| Segment | Rough size | Pain level | Willingness to pay | Instagram competition |
|---|---|---|---|---|
| **Arabic-speaking** (Syrian, Iraqi, Lebanese, Palestinian, Egyptian, Moroccan) | ~1.7% of residents speak Arabic at home; Syrian nationals alone ~970k, ~1.28M with Syrian migration background | **Highest** — Jobcenter, Sozialamt, Ausländerbehörde, BAMF letters, where misreading a deadline has legal consequences | Medium at €3.99/mo, low at €29.99/yr upfront | **Thin and unpolished** — mostly news pages and general "life in Germany" accounts, not letter-specific |
| **Turkish-speaking** | ~2.6% speak Turkish at home; ~1.52M Turkish citizens, ~3M Turkish-origin | High, but often buffered by a bilingual family network (the "nephew who reads it") | Medium | **Crowded but adjacent** — big Turkish-Germany accounts exist (e.g. isteyim.official, reported ~171k), mostly jobs/citizenship/news, not letters |
| **English-speaking internationals** (tech workers, students, Blue Card, digital nomads) | Millions of non-Turkish/non-Arabic internationals | Medium — high confusion, low legal jeopardy, often HR support | **Highest** — used to paying for SaaS | **Most crowded** — Simple Germany (~42k reported), ExpatEase (~11k), Handbook Germany (~24k), Live in Germany, All About Berlin |

**The strategic asymmetry:** the segment with the most pain and the least competition (Arabic) is the one every English-first competitor ignores, because building trustworthy Arabic RTL output is real work — work Papkram has already done and shipped (RTL containers, per-locale marketing copy, translated carousels).

**That is the whole positioning wedge. Don't compete in English first.**

---

## 2. Competitor map

### Tier 1 — Direct product competitors (same promise, same mechanic)

The category got crowded in 2026. These all live at "photograph a German official letter → plain-language explanation + deadline + next step":

| Product | Promise / stance | What I can see | Weakness Papkram can attack |
|---|---|---|---|
| **BriefEasy** (briefeasy.app) | "Understand every letter from the Amt" — Jobcenter, Ausländerbehörde, Finanzamt, Krankenkasse, courts, landlords, insurers. Monthly/yearly premium, price shown in-app | Most complete direct competitor found | Price opacity ("shown in the app") reads as untrustworthy to a low-income, high-anxiety audience |
| **Amtli** (amtli.app) | "Understand any German letter **in plain English**" | English-anchored in its own headline | English-only framing = zero pull for Arabic/Turkish speakers |
| **Behörden-Klartext** (lovable.app subdomain) | "One photo, one clear explanation, one date in the calendar" — explicitly positions against translation apps | Sharp positioning, same argument as Papkram's | Hosted on a `*.lovable.app` subdomain — signals a weekend build, not a company you send your Jobcenter letter to |
| **expat.fyi** | Free "type the sender + subject" quick identification + free guides | Free tier as a content/SEO play | Doesn't read the actual letter — no deadline extraction, no reply |
| **xplainly.app** | Guide-style "German official letters explained" | Content/SEO play | Not a product loop |
| **mika Behördenbrief-Übersetzer** / **Texthelfer** | Free German→plain-German simplification | Aimed at German speakers, not immigrants | Wrong direction: simplifies German into German |
| **Berlin Senate's own Leichte-Sprache AI tool** | State-run plain-language rewriting for authorities | Free, official | Serves the sender, not the recipient. Not a threat; a talking point |

**Reads out of this table:**

1. Nobody found is leading with **Arabic or Turkish**. Every single one anchors on "plain English."
2. Nobody found is offering the **reply draft in German + a translation of that reply** — the "here is what you're about to send, and here's what it says" loop. That is Papkram's second, harder-to-copy differentiator.
3. The category is at the "many identical wrappers" stage. **Distribution and trust, not features, decide this.** Which is exactly why Instagram matters.

### Tier 2 — Content competitors (compete for the same attention, not the same wallet)

These are not enemies. **They are your distribution.** They have the audience and no product; you have the product and no audience.

- **English:** Simple Germany (Jen & Yvonne, reported ~42k) — the polished benchmark for bureaucracy explainers; ExpatEase (~11k); Live Work Germany; All About Berlin; Live in Germany.
- **Multilingual/institutional:** Handbook Germany (reported ~24k, 9 languages, community-funded) — the closest thing to an incumbent in your exact multilingual lane, but institutional, slow, and not a product.
- **Turkish:** isteyim.official (~171k, jobs); Kilim Gazetesi and similar Almanya-news pages; individual "Almanya'da yaşam" creators covering citizenship/Ausländerbehörde in Reels.
- **Arabic:** germanyarabic.de, arab-deutschland.com and their social arms — news-and-guides pages, heavy Facebook/Telegram tilt.

### Tier 3 — The real competitor (what people do today)

Ranked by actual usage, and each one is a content angle:

1. **A bilingual relative or friend** — free, trusted, slow, embarrassing, and sometimes wrong.
2. **Photo → Google Translate / ChatGPT** — gives words, not consequence; hallucinates the deadline.
3. **Facebook groups / WhatsApp / Telegram** — posting your letter publicly to strangers. Free, fast, and a privacy disaster.
4. **Caritas / Diakonie / Migrationsberatung** — free, correct, and booked out three weeks.
5. **Doing nothing until it becomes a Mahnung.**

**#3 and #5 are your best content territory.** "Don't post your letter in a Facebook group — here's what's on it that you just showed 40,000 strangers" is a hook that works in all three languages and sells the product without mentioning it.

---

## 3. Positioning

### Statement

> **Papkram is the calm second opinion for German post.**
> For people in Germany whose German isn't strong enough for official mail, Papkram reads the letter, tells you plainly what it wants, what happens if you ignore it, and by when — and writes the German reply for you, with a translation so you know what you're sending.
> Unlike translation apps, it gives you meaning and a deadline, not words. Unlike the group chat, nobody else sees your letter.

### The three-line message hierarchy (use in this order, always)

1. **"Is this urgent?"** → deadline extraction. The #1 anxiety, the #1 hook.
2. **"What do they actually want?"** → plain summary, payments, appointments.
3. **"What do I write back?"** → German reply + translation. The moat.

### Brand voice on Instagram — the deliberate tension

The visual identity is **playful/bold** (saturated, chunky, sticker accents, hard-offset shadows). The brand voice is **calm and clinical, reassuring**. On Instagram these must run at the same time and it's an advantage:

> **Loud design. Quiet words.**

The design earns the scroll-stop; the copy earns the trust. Never let the copy get loud — this audience is being shouted at by everyone (immigration lawyers' ads, "Achtung!" news pages, scaremongering citizenship accounts). **Papkram is the account that lowers the reader's heart rate.** That is the differentiated feeling in this niche, and no competitor found is occupying it.

Concretely:
- ✅ "This letter isn't a fine. It's a request for a document. You have until 14 March."
- ❌ "⚠️ DON'T IGNORE THIS LETTER OR YOU'LL BE DEPORTED 😱"

### Things Papkram must never say (legal, not stylistic)

Germany's **Rechtsdienstleistungsgesetz (RDG)** makes case-specific legal assessment a licensed activity, and the *Smartlaw* ruling (LG Köln) specifically punished marketing claims like "cheaper and faster than a lawyer" / "lawyer-quality legal documents." General information published without reference to a concrete individual case sits outside the RDG — which is where all Instagram content must stay.

**Banned phrasings, all languages:**
- "legal advice", "Rechtsberatung", "استشارة قانونية", "hukuki danışmanlık"
- "cheaper than a lawyer" / "instead of a lawyer" / "Anwalt sparen"
- "we'll fight the Bescheid for you", "we'll object for you"
- Any promise about outcome ("you won't be fined", "your permit will be approved")
- Any guarantee (already cut from the offer for the same reason — keep it cut)

**Safe framing that keeps the punch:** "understand", "in plain language", "your deadline", "a draft you can edit and send", "know what it says before you decide what to do." And when a comment asks a real case question — and they will, daily — the only correct reply is the pinned-comment template in §9.4.

---

## 4. Account architecture — the decision

**Recommendation: two accounts now, three later.**

| Phase | Accounts | Why |
|---|---|---|
| **Now (weeks 1–8)** | `@papkram` (English) + `@papkram.ar` (Arabic, RTL captions) | Instagram's distribution is language-modelled — a trilingual feed gets shown to nobody properly. Arabic is the wedge (highest pain, thinnest competition, and already a shipped product capability). English is the second account because it's where the brand/press/partner story lives and where the shipped EN carousel already exists. |
| **After one format proves out (week ~8)** | add `@papkram.tr` | Turkish market is big but the incumbent accounts are stronger; enter with a format that already works rather than experimenting there. |

Don't run three from day one as a solo founder. Three half-fed accounts lose to one well-fed one, every time.

**Handles:** check availability for `papkram`, `papkram.ar`, `papkram.tr`, `papkram.app`, `getpapkram` in one sitting and register all of them defensively — free, five minutes. Also register the same names on TikTok even if you don't post there yet (see §9.5).

**Naming risk to check now:** `papierkram.de` is an established German invoicing/accounting SaaS. "Papkram" is close enough that a trademark search (DPMA register, classes 9 and 42) before you print anything or buy ads is prudent. This is a €0 check and a potentially expensive miss.

---

## 5. Content system

### 5.1 Four pillars (fixed ratio — don't drift)

| Pillar | Share | Purpose | Example |
|---|---|---|---|
| **1. Decode a letter** | 40% | The core loop, the reason to follow | "This Stadtwerke letter says you owe €187.42 by 28 Feb. Here's the one line that says it." |
| **2. Deadline literacy** | 25% | Teach the system, not the app | "Frist, Widerspruch, Mahnung, Bescheid — the four words that decide whether a letter is urgent." |
| **3. Quiet reassurance** | 20% | Own the emotional territory nobody else occupies | "Getting a letter from the Ausländerbehörde does not mean something is wrong. Here's what a routine one looks like." |
| **4. Product / proof** | 15% | Convert | Screen-recorded upload → analysis in 20 seconds. Founder on camera. |

**Never post:** scare content, deportation-news commentary, political immigration takes, "5 tips" listicles with no letter in them. All of it draws the wrong audience and burns the calm-voice position you're building.

### 5.2 Three repeatable formats (this is the actual engine)

Consistency of *format* beats consistency of *topic*. Pick these three and run them until they stop working.

**A. "Brief der Woche" / Letter of the Week — carousel, 1×/week, the flagship**
Six slides, always the same skeleton:
1. The letter photo, sender visible, everything else blurred + a red `Frist?` sticker (the existing card1 design already does exactly this — reuse it)
2. "What this actually is" — one sentence
3. "What they want from you" — max three bullets
4. "Your deadline" — one giant date
5. "What happens if you ignore it" — the consequence, stated calmly
6. CTA: "Papkram reads yours in 20 seconds. 4 free letters. Link in bio."

⚠️ **Use synthetic letters only.** Generate them from the app's own seed letters (`project/scripts/translate-seed-letters.ts` and the demo seeds). Never a real user's letter, even with permission, even blurred — the single fastest way to destroy trust in a privacy-sensitive product is to be seen publishing someone's Jobcenter mail.

**B. "One German word" — Reel, 2×/week, 12–20 seconds**
One bureaucratic word per Reel: *Frist, Widerspruch, Bescheid, Mahnung, Nachzahlung, Aufforderung, Säumniszuschlag, Anhörung, Betriebskostenabrechnung, Kündigungsfrist, Rückforderung, Bewilligung.*
Structure: word on screen (0–2s) → "if you see this, you have X days" (2–7s) → the sentence it hides inside, in real letter German (7–14s) → "that's it" (14–17s).
Cheap to make, infinitely repeatable, extremely saveable, and it teaches the exact vocabulary that makes people trust the product. **This is the format most likely to break out.**

**C. "The table" — Reel, 1×/week, no face needed**
Static overhead shot of a kitchen table. A hand drops an unopened letter. Text overlay: the internal monologue. Then the phone comes in, the app scans it, the anxiety resolves. 15 seconds. It's the product demo disguised as a feeling.

### 5.3 Cadence (solo-founder realistic)

Per account, per week: **2 Reels + 1 carousel + 3–4 Story frames.** That is it.

This lands inside the 2026 consensus mix (Reels carry reach at roughly 30% reach rate — about double carousels/statics; carousels carry engagement and collect the most saves) without requiring a content team. Reels for reach, carousels for saves and follows, Stories for the people already convinced.

Batch it: **one 3-hour session on Sunday produces the week** — record 4 word-Reels back to back, render one carousel, write the captions.

### 5.4 Caption template (all languages, don't improvise)

```
[Hook line — the anxiety, stated flatly. Max 8 words.]

[3–5 short lines. One idea per line. No paragraphs.]

[The calm reframe — what this actually means.]

Papkram reads your German post in plain [English/Arabic/Turkish] —
summary, deadline, and a reply you can send. 4 letters free.
→ papkram.de (link in bio)

#hashtags
```

### 5.5 Hashtags (5–8 per post, not 30)

- **EN:** #lifeingermany #expatsingermany #germanbureaucracy #movingtogermany #anmeldung #jobcenter #auslaenderbehoerde #germanylife
- **AR:** #الحياة_في_ألمانيا #ألمانيا #اللاجئين_في_ألمانيا #الجوبسنتر #ترجمة #المانيا_بالعربي #اقامة_المانيا
- **TR:** #almanya #almanyadayasam #gurbetçi #almanyahayat #jobcenter #oturumizni #almanyada

Rotate; never paste an identical block twice in a row.

---

## 6. Hook bank (steal these directly)

The hook is 80% of the outcome. All of these lead with the anxiety and resolve it calmly.

**English**
1. "You don't have to open it right now. But you do have to know the date on it."
2. "Three German words that mean 'this is urgent'."
3. "A letter from the Ausländerbehörde usually isn't bad news. Here's how to tell."
4. "The most expensive thing you can do with German post is nothing."
5. "Stop posting your letters in Facebook groups. Here's what you're showing strangers."
6. "Google Translate translated it. You still don't know what to do. Here's why."
7. "This letter looks terrifying. It's asking for one document."
8. "If your letter has this word, you have 14 days."
9. "What a Mahnung actually costs you."
10. "Your nephew shouldn't have to read your mail."

**Arabic**
1. «ثلاث كلمات ألمانية معناها: هذه الرسالة عاجلة.»
2. «رسالة من الجوب سنتر لا تعني دائمًا مشكلة. إليك كيف تعرف.»
3. «أخطر شيء تفعله برسالة ألمانية هو أن تتجاهلها.»
4. «لا تنشر رسالتك في مجموعات فيسبوك — هذا ما يراه الغرباء فيها.»
5. «ترجمتها بجوجل، وما زلت لا تعرف ماذا تفعل. هذا هو السبب.»
6. «إذا رأيت كلمة Frist، عندك مهلة محددة. اعرف كم.»
7. «الرسالة تبدو مخيفة، لكنها تطلب ورقة واحدة فقط.»
8. «ما هي الـ Mahnung، وكم تكلفك فعليًا؟»

**Turkish**
1. "Bu üç Almanca kelimeyi görürsen: mektup acil."
2. "Jobcenter'dan mektup gelmesi kötü haber demek değil. Nasıl anlarsın?"
3. "Alman postasıyla yapabileceğin en pahalı şey: hiçbir şey yapmamak."
4. "Mektubunu Facebook grubuna atma. Yabancılara ne gösterdiğini bir gör."
5. "Google Translate çevirdi ama hâlâ ne yapacağını bilmiyorsun. İşte nedeni."
6. "Mektubunda 'Frist' yazıyorsa, sayılı günün var."
7. "Mahnung tam olarak ne kadara mal olur?"
8. "Yeğenin senin mektuplarını okumak zorunda kalmasın."

---

## 7. First 30 days — the calendar

Assume `@papkram` (EN) and `@papkram.ar` (AR) running the same skeleton, captions written natively (**not machine-translated — the audience will smell it instantly, and a translation product with bad translations is fatal**).

**Week 0 — build (no posting)**
- Register handles (IG + TikTok, all three languages).
- Bio, profile pic (the orange envelope sticker mark from the carousel), link.
- Render the Arabic and Turkish carousels — the HTML sources exist (`project/Carousel-Arabic/papkram-carousel-ar.html`, `Carousel-Turkish/papkram-carousel-tr.html`) but **only the English one has been exported to PNG.** That's the single highest-leverage asset task on this list.
- Record 8 word-Reels in one sitting.
- Set the pinned comment template (§9.4).

**Week 1 — establish the format**
| Day | Post |
|---|---|
| Mon | Carousel: the existing 8-card "You got a letter from the Jobcenter" deck. It's already on-brand and it's the perfect first post. |
| Tue | Reel: word #1 — **Frist** |
| Thu | Reel: "The table" (the 15-second feeling piece) |
| Fri | Carousel: Brief der Woche #1 — a Stadtwerke Nachzahlung |
| Daily | 1 Story: a single German word + its meaning, with a poll sticker |

**Week 2 — teach**
Mon carousel: "Bescheid vs Mahnung vs Anhörung" · Tue Reel: word **Widerspruch** · Thu Reel: "Stop posting your letters in Facebook groups" (highest share-potential piece in the whole plan) · Fri carousel: Brief der Woche #2 — Ausländerbehörde document request.

**Week 3 — proof**
Mon: 20-second screen recording, upload → analysis, no voiceover, on-screen text only · Tue Reel: word **Nachzahlung** · Thu Reel: founder on camera, 30 seconds, why you built it (this is the trust post — do it once, pin it) · Fri carousel: Brief der Woche #3 — Krankenkasse.

**Week 4 — convert + learn**
Mon carousel: "What Papkram does that Google Translate can't" (side-by-side, the letter's actual German vs. the plain summary + deadline) · Tue Reel: word **Säumniszuschlag** · Thu Reel: remake of whichever of the first 7 Reels performed best, changed hook only · Fri: Story series → link sticker → "4 letters free."

**End of week 4, decide with data:** if word-Reels outperform Brief der Woche 2:1 on reach, shift to 3 Reels + 1 carousel. If the Arabic account outpaces English on engagement rate (likely), move Turkish forward and deprioritize English.

---

## 8. Profile setup

**Bio — English (@papkram)**
```
Papkram · German post, finally readable
Photo of your letter → what it wants, your deadline,
and a German reply you can send.
Not legal advice. 4 letters free ↓
```

**Bio — Arabic (@papkram.ar)**
```
بابكرام · بريدك الألماني، أخيرًا مفهوم
صوّر الرسالة → ملخّص واضح، موعدك النهائي،
وردّ جاهز بالألمانية مع ترجمته.
لسنا استشارة قانونية · ٤ رسائل مجانًا ↓
```

**Bio — Turkish (@papkram.tr)**
```
Papkram · Alman postası, artık anlaşılır
Mektubun fotoğrafı → ne istiyor, son tarihin,
ve gönderebileceğin Almanca yanıt.
Hukuki danışmanlık değildir · 4 mektup ücretsiz ↓
```

Note the deliberate "not legal advice" line in all three — it's an RDG safety rail *and* it reads as honest, which in this niche is a conversion asset, not a disclaimer.

**Link:** `papkram.de/?src=ig` — the landing page already reads `src` and attaches it to the PostHog pageview, so this gives you an Instagram → signup funnel with zero new engineering. Use `?src=ig_bio`, `?src=ig_story`, `?src=ig_reel` to separate them.

**Highlights (5, in brand colors):** `Words` (the German word Reels) · `Letters` (Brief der Woche) · `How it works` · `Privacy` · `Free trial`.

---

## 9. Growth loops

**9.1 The shipped one — use it.** The app already has poster sharing to Instagram/TikTok Story and WhatsApp. Two small changes make it a real loop: (a) put `@papkram` on the poster image itself so a re-shared Story is traceable, (b) prefill the share caption with the handle. Every user who shares becomes a distribution node in a community that shares heavily in exactly this format.

**9.2 Creator collaborations — the fastest path to the first 5,000.** Don't buy shoutouts. Offer: free lifetime access + a co-branded "Brief der Woche" they post as a Collab (both feeds, both audiences). Target order: mid-size Arabic and Turkish Germany accounts (10k–80k, where a Collab is a favor, not an invoice) → Handbook Germany-style multilingual info accounts (mission-aligned, non-commercial) → Simple Germany-tier English accounts last (they're the most professionalized, i.e. the most expensive and the slowest).

**9.3 Comment-to-DM.** On the highest-reach Reel, pin: "Comment BRIEF and I'll send you the free link." Keyword DM automation is a well-established 2026 growth mechanic and DM volume itself is a ranking signal. **Keep the DM reply to one sentence and a link — never let a DM turn into case-specific advice (§3).**

**9.4 The pinned comment template** (post it yourself as the first comment on every letter post, in that account's language):

> ℹ️ Papkram explains what a letter says — it isn't legal advice and we can't advise on your individual case. For that, Migrationsberatung, Caritas/Diakonie, or a lawyer. Questions about how the app works: DM anytime.

This is your RDG shield, your comment-section moderation policy, and — because it points people to free help — a trust signal. It does all three at once.

**9.5 TikTok.** Post the identical Reels to TikTok. 23M+ German MAU, cheaper reach than Instagram right now, and the Arabic and Turkish diaspora communities are heavily active there. Zero extra production cost since the vertical video already exists. Don't build a TikTok strategy — just don't throw the asset away.

---

## 10. Measurement

Weekly, five numbers only:

1. **Reach per format** (Reel vs carousel) — decides next week's mix
2. **Saves + shares per post** — the true signal in an information niche; a save means "I'll need this"
3. **Profile visits → link taps** (bio conversion rate; target >8%)
4. **PostHog signups with `src=ig*`** — the only number that actually matters
5. **Follower growth per account** — the vanity one, checked last

Kill any format that hasn't produced a top-3 post within three weeks of trying it.

---

## 11. Risks

| Risk | Severity | Mitigation |
|---|---|---|
| **RDG exposure** from comments/DMs drifting into case advice | High | §9.4 pinned comment on every post; no outcome promises; "not legal advice" in every bio |
| **Privacy optics** — a product that ingests Jobcenter mail is asking for enormous trust | High | Synthetic letters only in content; make "your letters aren't used to train AI" a recurring post, not fine print |
| **Machine-translated captions** in AR/TR | High | Native writers or nothing. A translation product with clumsy translations kills itself. |
| **Trademark collision** with papierkram.de | Medium | DPMA search before any paid spend or print |
| **Comment sections attracting anti-immigration pile-ons** | Medium | Keyword filters on the obvious terms from day one; restrict comments on political-adjacent posts; never post immigration-politics content (§5.1) |
| **Category commoditizing** (BriefEasy/Amtli/others outspending) | Medium | Compete on languages + reply drafts + calm voice, not features. Distribution is the moat here. |

---

## 12. Do this before anything else — the 40-minute manual competitor audit

I could not reach instagram.com from this environment, so **verify these on your phone and write the answers back into this file** (§2 Tier 1/2 tables):

1. Search Instagram for: `briefeasy`, `amtli`, `behördenklartext`, `expat.fyi`, `papkram` (confirm the handle is free). For each found account record: followers, last post date, posting frequency, best-performing post format, whether they post in any language other than English.
2. Search the hashtags `#jobcenter`, `#auslaenderbehoerde`, `#الحياة_في_ألمانيا`, `#almanyadayasam`. Screenshot the top 9 of each. **Note what format the top posts are** — that's your format answer, free.
3. Open `@simplegermany`, `@handbookgermany`, `@expat_ease`, `@isteyim.official`. Record follower count and their best-performing recent post. These are your collab targets and your quality bar.
4. Find 10 accounts (Arabic and Turkish, 10k–80k followers, Germany-based) posting practical immigration/bureaucracy content. **That list is your week-2 outreach list.** Write it into a new §13.

If the audit shows a direct competitor already running an Arabic account with traction, tell me and the wedge gets re-cut — that's the one finding that would change this plan.

---

## Summary — the five decisions

1. **Niche:** bureaucratic anxiety relief, not translation. Lead with the deadline, always.
2. **Wedge:** Arabic first, English second, Turkish third. Every direct competitor is English-only — that's the gap and it's already built into the product.
3. **Voice:** loud design, quiet words. Be the account that lowers the reader's heart rate.
4. **Engine:** "One German word" Reels ×2/week + "Brief der Woche" carousel ×1/week. Batched Sunday. Nothing else until something breaks out.
5. **Guardrail:** never legal advice, never a real user's letter, never a machine-translated caption.
