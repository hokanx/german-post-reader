# Landing Offer Rewrite (Value Stack + Bonuses) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing page's plain pricing card with a persuasive value-stack (comparison-cost table + anchored total + real price) and add a new bonuses section (Founder's Circle, Bureaucracy Toolkit, Urgent Phrases Guide), in English, Arabic, and Turkish.

**Architecture:** Two new presentational client components (`ValueStack`, `Bonuses`) replacing one (`Pricing`), driven entirely by data added to the existing per-locale `MARKETING_COPY` object in `src/components/landing/copy.ts`. No new routes, no new server actions, no new database columns — this is a content/UI-only change to the marketing homepage.

**Tech Stack:** Next.js App Router, React Server/Client Components, Tailwind CSS (semantic tokens only), Framer Motion, Lucide icons.

## Global Constraints

- No named mechanism/protocol anywhere in copy (confirmed with user — DNA's "DECODE Protocol" branding was declined).
- No guarantee section, in this plan or implied elsewhere — it was cut from scope entirely, not deferred.
- Founder's Circle "first 100" scarcity is a **static** badge string only — no live counter, no enforcement logic.
- All copy ships in English, Arabic, and Turkish simultaneously; Arabic renders `dir="rtl"` via the existing `copy.dir` per-locale field — never introduce a separate RTL code path.
- Colors resolve through existing semantic Tailwind tokens only (`bg-card`, `text-foreground`, `border-border`, `bg-accent`, `text-accent-foreground`, `bg-primary`, `text-primary-foreground`) — no raw hex, no raw Tailwind color classes.
- Headings use the existing `font-heading` class (Bricolage Grotesque); body text is unstyled default (Inter).
- Motion: `useReducedMotion()` gates every animation, matching every existing landing component.
- EUR amounts use the German display convention already established by `formatEur()` in `src/lib/format-currency.ts` (comma decimal, symbol after with a space, e.g. `"5,99 €"`). Hand-written comparison-cost strings in copy data (e.g. `"97,00 €"`) follow the same convention manually since they are static marketing numbers, not derived from `SUBSCRIPTION_PRICE_EUR`.
- `FREE_LETTER_LIMIT` and `SUBSCRIPTION_PRICE_EUR` (`src/lib/constants.ts`) remain the single source of truth for those two numbers — never hardcode `4` or `5.99` in new code.

---

### Task 1: Value-stack copy + component

**Files:**
- Modify (full rewrite): `src/components/landing/copy.ts`
- Create: `src/components/landing/value-stack.tsx`
- Delete: `src/components/landing/pricing.tsx`
- Modify: `src/app/page.tsx:6` (import) and `src/app/page.tsx:18` (JSX)

**Interfaces:**
- Consumes: `FREE_LETTER_LIMIT`, `SUBSCRIPTION_PRICE_EUR` from `@/lib/constants`; `formatEur` from `@/lib/format-currency`; `useMarketingLocale` from `./locale-context`; `buttonVariants` from `@/components/ui/button` (all pre-existing, same imports `pricing.tsx` already used).
- Produces: `MARKETING_COPY[locale].offer` (new copy shape, consumed by `ValueStack`); exported `ValueStack` component, consumed by `page.tsx` and, in Task 2, unaffected by `Bonuses`.

- [ ] **Step 1: Overwrite `src/components/landing/copy.ts` with the following complete file**

This replaces the `pricing` type/data with `offer` (the value-stack table) across all three locales, and adds the (for now empty-of-consumers-until-Task-2) `bonuses` type — `hero`, `howItWorks`, `trust`, `cta`, `footer`, and all locale/RTL/dir handling are unchanged from the current file.

```ts
import type { MarketingLocale } from "./locale-context";

type MockupCopy = {
  chip: string;
  summary: string;
  deadline: string;
  reply: string;
  dir: "ltr" | "rtl";
};

type StepMockup = {
  /** Small representative snippet shown inside each How-it-works step card. */
  label: string;
  detail: string;
};

export type MarketingCopy = {
  dir: "ltr" | "rtl";
  nav: { logIn: string; startFreeTrial: string };
  hero: {
    stampBadge: (freeLetterLimit: number) => string;
    headlineLine1: string;
    headlineLine2: string;
    subhead: string;
    ctaPrimary: string;
    ctaNote: string;
    mockup: MockupCopy;
  };
  howItWorks: {
    heading: string;
    steps: { title: string; description: string; mockup: StepMockup }[];
  };
  trust: { heading: string; body: string };
  offer: {
    heading: string;
    trialBadge: (freeLetterLimit: number) => string;
    items: { name: string; description: string; comparisonCost: string }[];
    bonuses: { name: string; description: string; comparisonCost: string }[];
    totalComparisonLabel: string;
    totalComparisonValue: string;
    priceLabel: string;
    perYearLabel: string;
    cta: string;
  };
  bonuses: {
    heading: string;
    items: { name: string; badge?: string; description: string }[];
  };
  cta: { badge: string; heading: string; button: string };
  footer: { privacy: string; terms: string; contact: string };
};

export const MARKETING_COPY: Record<MarketingLocale, MarketingCopy> = {
  en: {
    dir: "ltr",
    nav: { logIn: "Log in", startFreeTrial: "Start free trial" },
    hero: {
      stampBadge: (n) => `${n} FREE LETTERS`,
      headlineLine1: "German post,",
      headlineLine2: "finally readable.",
      subhead:
        "Google Translate gives you the words. Papkram gives you the meaning — a plain-language summary, your deadlines, and a ready-to-send reply, in English, Arabic, or Turkish.",
      ctaPrimary: "Start free trial",
      ctaNote: "No credit card needed",
      mockup: {
        chip: "Analysis complete",
        summary: "Stadtwerke München is asking for an extra 187,42 € from your 2025 electricity bill.",
        deadline: "Pay by 28 Feb 2026",
        reply: "“I am writing to confirm the payment of 187,42 € was transferred on…”",
        dir: "ltr",
      },
    },
    howItWorks: {
      heading: "Three steps. That's it.",
      steps: [
        {
          title: "Upload",
          description: "Snap a photo or drop in a PDF of the letter you received.",
          mockup: { label: "letter.jpg", detail: "Uploading…" },
        },
        {
          title: "We read it",
          description: "We translate it, summarize it, and flag every deadline — in your language.",
          mockup: { label: "Analysis complete", detail: "1 deadline found" },
        },
        {
          title: "You reply",
          description: "Copy the ready-to-send reply draft, or write your own from the summary.",
          mockup: { label: "Your reply, in German", detail: "Copy reply" },
        },
      ],
    },
    trust: {
      heading: "We tell you when we're not sure",
      body: "German bureaucratic letters are dense — amounts and dates matter. If anything in a letter is ambiguous, we flag it plainly instead of guessing. Never a silent guess on a number that could cost you.",
    },
    offer: {
      heading: "Everything you get.",
      trialBadge: (n) => `${n} free letters, no card`,
      items: [
        {
          name: "Unlimited Letter Analysis",
          description:
            "Upload any German letter — photo or PDF — and get a plain-language summary, deadlines, and a ready-to-send reply. No limit after your free trial.",
          comparisonCost: "97,00 €",
        },
        {
          name: "Confident Reply Composer",
          description:
            "A formally correct German reply, ready to copy and send. You never write a word of German yourself.",
          comparisonCost: "Included",
        },
        {
          name: "Deadline Shield",
          description:
            "Every date buried in a letter — payment windows, response deadlines — flagged clearly so nothing slips past you.",
          comparisonCost: "Included",
        },
        {
          name: "Document Vault",
          description:
            "Every letter you've uploaded, every summary, every reply — stored and searchable in one place.",
          comparisonCost: "Included",
        },
      ],
      bonuses: [
        {
          name: "Founder's Circle",
          description: "Priority support + your price locked for life",
          comparisonCost: "197,00 €",
        },
        {
          name: "Bureaucracy Toolkit",
          description: "Step-by-step guides for what comes after the letter",
          comparisonCost: "47,00 €",
        },
        {
          name: "Urgent Phrases Guide",
          description: "30 essential phrases for calls and in-person visits",
          comparisonCost: "27,00 €",
        },
      ],
      totalComparisonLabel: "What you'd pay elsewhere",
      totalComparisonValue: "368,00 €",
      priceLabel: "Your price",
      perYearLabel: "/ year",
      cta: "Start free trial",
    },
    bonuses: {
      heading: "Bonuses included for free, right now.",
      items: [
        {
          name: "Founder's Circle",
          badge: "First 100 founding members",
          description:
            "As a founding member, you get direct access to our support team — not a chatbot, a real person. Your price stays 5,99 € a year for life, even if it rises for new members later. Every future update is added to your account automatically, free, forever.",
        },
        {
          name: "Bureaucracy Toolkit",
          description:
            "Understanding the letter is step one. This toolkit walks you through the next step — a bank transfer, a form, a direct debit — one plain-language guide at a time.",
        },
        {
          name: "Urgent Phrases Guide",
          description:
            "For the moments the app can't help — a phone call, an office visit — thirty essential German phrases with pronunciation, ready when you need them.",
        },
      ],
    },
    cta: {
      badge: "START TODAY",
      heading: "Stop guessing what your mail says.",
      button: "Start free trial",
    },
    footer: { privacy: "Privacy", terms: "Terms", contact: "Contact" },
  },
  ar: {
    dir: "rtl",
    nav: { logIn: "تسجيل الدخول", startFreeTrial: "ابدأ تجربتك المجانية" },
    hero: {
      stampBadge: (n) => `${n} خطابات مجانية`,
      headlineLine1: "بريدك الألماني،",
      headlineLine2: "أخيرًا مفهوم.",
      subhead:
        "ترجمة جوجل تمنحك الكلمات. أما Papkram فيمنحك المعنى — ملخص بلغة واضحة، مواعيدك النهائية، ورد جاهز للإرسال، بالإنجليزية أو العربية أو التركية.",
      ctaPrimary: "ابدأ تجربتك المجانية",
      ctaNote: "لا حاجة لبطاقة ائتمان",
      mockup: {
        chip: "تم التحليل",
        summary: "شركة كهرباء ميونخ تطلب مبلغاً إضافياً قدره 187,42 € من فاتورة الكهرباء لعام 2025.",
        deadline: "الدفع قبل 28 فبراير 2026",
        reply: "«أكتب لأؤكد أن مبلغ 187,42 € تم تحويله بتاريخ...»",
        dir: "rtl",
      },
    },
    howItWorks: {
      heading: "ثلاث خطوات. هذا كل شيء.",
      steps: [
        {
          title: "ارفع",
          description: "التقط صورة أو أضف ملف PDF للخطاب الذي استلمته.",
          mockup: { label: "خطاب.jpg", detail: "جارٍ الرفع…" },
        },
        {
          title: "نقرأه",
          description: "نترجمه، نلخصه، ونحدد كل موعد نهائي — بلغتك.",
          mockup: { label: "تم التحليل", detail: "تم العثور على موعد نهائي واحد" },
        },
        {
          title: "ترد",
          description: "انسخ مسودة الرد الجاهزة للإرسال، أو اكتب ردك الخاص من الملخص.",
          mockup: { label: "ردك، بالألمانية", detail: "نسخ الرد" },
        },
      ],
    },
    trust: {
      heading: "نخبرك عندما لا نكون متأكدين",
      body: "الخطابات الألمانية الرسمية معقدة — المبالغ والتواريخ مهمة. إذا كان أي شيء في الخطاب غامضًا، نشير إليه بوضوح بدلاً من التخمين. لا تخمين صامت لرقم قد يكلفك المال.",
    },
    offer: {
      heading: "كل ما تحصل عليه.",
      trialBadge: (n) => `${n} خطابات مجانية، بدون بطاقة`,
      items: [
        {
          name: "تحليل غير محدود للخطابات",
          description:
            "ارفع أي خطاب ألماني — صورة أو ملف PDF — واحصل على ملخص بلغة واضحة، والمواعيد النهائية، ورد جاهز للإرسال. بلا حدود بعد تجربتك المجانية.",
          comparisonCost: "97,00 €",
        },
        {
          name: "أداة الرد الواثق",
          description:
            "رد ألماني صحيح رسميًا، جاهز للنسخ والإرسال. لن تكتب كلمة واحدة بالألمانية بنفسك.",
          comparisonCost: "مُضمّن",
        },
        {
          name: "درع المواعيد النهائية",
          description:
            "كل تاريخ مخفي داخل الخطاب — مواعيد الدفع، والمهل الزمنية للرد — يُشار إليه بوضوح حتى لا يفوتك شيء.",
          comparisonCost: "مُضمّن",
        },
        {
          name: "خزنة المستندات",
          description:
            "كل خطاب رفعته، وكل ملخص، وكل رد — محفوظ وقابل للبحث في مكان واحد.",
          comparisonCost: "مُضمّن",
        },
      ],
      bonuses: [
        {
          name: "دائرة المؤسسين",
          description: "دعم ذو أولوية + سعرك ثابت مدى الحياة",
          comparisonCost: "197,00 €",
        },
        {
          name: "عدة التعامل مع البيروقراطية",
          description: "أدلة خطوة بخطوة لما يأتي بعد الخطاب",
          comparisonCost: "47,00 €",
        },
        {
          name: "دليل العبارات العاجلة",
          description: "30 عبارة أساسية للمكالمات والزيارات الشخصية",
          comparisonCost: "27,00 €",
        },
      ],
      totalComparisonLabel: "ما كنت ستدفعه في مكان آخر",
      totalComparisonValue: "368,00 €",
      priceLabel: "سعرك",
      perYearLabel: "/ سنويًا",
      cta: "ابدأ تجربتك المجانية",
    },
    bonuses: {
      heading: "مكافآت مُضمّنة مجانًا، الآن.",
      items: [
        {
          name: "دائرة المؤسسين",
          badge: "أول 100 عضو مؤسس",
          description:
            "بصفتك عضوًا مؤسسًا، تحصل على تواصل مباشر مع فريق الدعم لدينا — ليس روبوت محادثة، بل شخص حقيقي. يبقى سعرك 5,99 € سنويًا مدى الحياة، حتى لو ارتفع لاحقًا للأعضاء الجدد. كل تحديث مستقبلي يُضاف إلى حسابك تلقائيًا، مجانًا، إلى الأبد.",
        },
        {
          name: "عدة التعامل مع البيروقراطية",
          description:
            "فهم الخطاب هو الخطوة الأولى. هذه العدة ترشدك إلى الخطوة التالية — تحويل مصرفي، أو نموذج، أو خصم مباشر — دليل واحد بلغة واضحة في كل مرة.",
        },
        {
          name: "دليل العبارات العاجلة",
          description:
            "للحظات التي لا يستطيع فيها التطبيق مساعدتك — مكالمة هاتفية، زيارة مكتب — ثلاثون عبارة ألمانية أساسية مع طريقة النطق، جاهزة عند الحاجة.",
        },
      ],
    },
    cta: {
      badge: "ابدأ اليوم",
      heading: "توقف عن التخمين بشأن ما يقوله بريدك.",
      button: "ابدأ تجربتك المجانية",
    },
    footer: { privacy: "الخصوصية", terms: "الشروط", contact: "تواصل معنا" },
  },
  tr: {
    dir: "ltr",
    nav: { logIn: "Giriş yap", startFreeTrial: "Ücretsiz denemeyi başlat" },
    hero: {
      stampBadge: (n) => `${n} ÜCRETSİZ MEKTUP`,
      headlineLine1: "Alman postası,",
      headlineLine2: "artık anlaşılır.",
      subhead:
        "Google Translate size kelimeleri verir. Papkram ise size anlamı verir — sade bir özet, son tarihleriniz ve gönderime hazır bir yanıt, İngilizce, Arapça veya Türkçe olarak.",
      ctaPrimary: "Ücretsiz denemeyi başlat",
      ctaNote: "Kredi kartı gerekmez",
      mockup: {
        chip: "Analiz tamamlandı",
        summary: "Stadtwerke München, 2025 elektrik faturanız için 187,42 € ek ödeme talep ediyor.",
        deadline: "Son ödeme: 28 Şubat 2026",
        reply: "“187,42 € tutarındaki ödemenin yapıldığını onaylamak için yazıyorum…”",
        dir: "ltr",
      },
    },
    howItWorks: {
      heading: "Üç adım. Hepsi bu.",
      steps: [
        {
          title: "Yükle",
          description: "Aldığınız mektubun fotoğrafını çekin veya PDF'ini yükleyin.",
          mockup: { label: "mektup.jpg", detail: "Yükleniyor…" },
        },
        {
          title: "Biz okuyoruz",
          description: "Onu çeviririz, özetleriz ve her son tarihi işaretleriz — sizin dilinizde.",
          mockup: { label: "Analiz tamamlandı", detail: "1 son tarih bulundu" },
        },
        {
          title: "Siz yanıtlayın",
          description: "Gönderime hazır yanıt taslağını kopyalayın veya özetten kendi yanıtınızı yazın.",
          mockup: { label: "Yanıtınız, Almanca", detail: "Yanıtı kopyala" },
        },
      ],
    },
    trust: {
      heading: "Emin olmadığımızda size söyleriz",
      body: "Alman resmi mektupları yoğun içeriklidir — tutarlar ve tarihler önemlidir. Bir mektupta belirsiz bir şey varsa, tahmin etmek yerine açıkça belirtiriz. Size zarar verebilecek bir rakamda asla sessizce tahmin yürütmeyiz.",
    },
    offer: {
      heading: "Elde ettiğiniz her şey.",
      trialBadge: (n) => `${n} ücretsiz mektup, kart gerekmez`,
      items: [
        {
          name: "Sınırsız Mektup Analizi",
          description:
            "Herhangi bir Alman mektubunu — fotoğraf veya PDF olarak — yükleyin ve sade bir özet, son tarihler ve gönderime hazır bir yanıt alın. Ücretsiz denemenizden sonra sınır yok.",
          comparisonCost: "97,00 €",
        },
        {
          name: "Güvenli Yanıt Oluşturucu",
          description:
            "Resmi olarak doğru bir Almanca yanıt, kopyalayıp göndermeye hazır. Almanca tek kelime bile yazmanıza gerek yok.",
          comparisonCost: "Dahil",
        },
        {
          name: "Son Tarih Kalkanı",
          description:
            "Mektubun içine gizlenmiş her tarih — ödeme pencereleri, yanıt son tarihleri — açıkça işaretlenir, hiçbir şey gözünüzden kaçmaz.",
          comparisonCost: "Dahil",
        },
        {
          name: "Belge Kasası",
          description:
            "Yüklediğiniz her mektup, her özet, her yanıt — tek bir yerde saklanır ve aranabilir.",
          comparisonCost: "Dahil",
        },
      ],
      bonuses: [
        {
          name: "Kurucular Çemberi",
          description: "Öncelikli destek + fiyatınız ömür boyu sabit",
          comparisonCost: "197,00 €",
        },
        {
          name: "Bürokrasi Araç Seti",
          description: "Mektuptan sonrası için adım adım rehberler",
          comparisonCost: "47,00 €",
        },
        {
          name: "Acil Durum İfadeleri Rehberi",
          description: "Aramalar ve yüz yüze ziyaretler için 30 temel ifade",
          comparisonCost: "27,00 €",
        },
      ],
      totalComparisonLabel: "Başka yerde ödeyeceğiniz tutar",
      totalComparisonValue: "368,00 €",
      priceLabel: "Sizin fiyatınız",
      perYearLabel: "/ yıl",
      cta: "Ücretsiz denemeyi başlat",
    },
    bonuses: {
      heading: "Şu anda ücretsiz dahil olan bonuslar.",
      items: [
        {
          name: "Kurucular Çemberi",
          badge: "İlk 100 kurucu üye",
          description:
            "Kurucu üye olarak destek ekibimize doğrudan ulaşırsınız — bir chatbot değil, gerçek bir kişi. Fiyatınız, ileride yeni üyeler için artsa bile, ömür boyu yılda 5,99 € olarak kalır. Gelecekteki her güncelleme hesabınıza otomatik olarak, ücretsiz ve sonsuza dek eklenir.",
        },
        {
          name: "Bürokrasi Araç Seti",
          description:
            "Mektubu anlamak birinci adımdır. Bu araç seti sizi bir sonraki adımda yönlendirir — banka havalesi, bir form, otomatik ödeme talimatı — her seferinde tek bir sade rehberle.",
        },
        {
          name: "Acil Durum İfadeleri Rehberi",
          description:
            "Uygulamanın yardımcı olamadığı anlar için — bir telefon görüşmesi, bir daire ziyareti — telaffuzuyla birlikte otuz temel Almanca ifade, ihtiyacınız olduğunda hazır.",
        },
      ],
    },
    cta: {
      badge: "BUGÜN BAŞLA",
      heading: "Postanızın ne dediğini tahmin etmeyi bırakın.",
      button: "Ücretsiz denemeyi başlat",
    },
    footer: { privacy: "Gizlilik", terms: "Şartlar", contact: "İletişim" },
  },
};
```

- [ ] **Step 2: Verify the file compiles in isolation**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: errors ONLY in `src/components/landing/pricing.tsx` (still referencing the now-removed `copy.pricing`) and possibly `src/app/page.tsx` (still importing `Pricing`). No errors in `copy.ts` itself. This confirms the new type/data is internally consistent before touching consumers.

- [ ] **Step 3: Create `src/components/landing/value-stack.tsx`**

```tsx
"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { FREE_LETTER_LIMIT, SUBSCRIPTION_PRICE_EUR } from "@/lib/constants";
import { formatEur } from "@/lib/format-currency";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function ValueStack() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];
  const rows = [...copy.offer.items, ...copy.offer.bonuses];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        {copy.offer.heading}
      </h2>
      <div className="mx-auto mt-10 max-w-xl">
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={shouldReduceMotion ? undefined : { scale: 1.01 }}
          className="rounded-lg border-2 border-border bg-card p-8 shadow-[6px_6px_0_0_var(--border)]"
        >
          <span className="rounded-full border-2 border-border bg-accent px-4 py-1.5 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
            {copy.offer.trialBadge(FREE_LETTER_LIMIT)}
          </span>

          <ul className="mt-6 grid gap-4">
            {rows.map((row) => (
              <li
                key={row.name}
                className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0"
              >
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={1.5} aria-hidden="true" />
                  <div>
                    <p className="text-sm font-bold text-foreground">{row.name}</p>
                    <p className="text-sm text-foreground/70">{row.description}</p>
                  </div>
                </div>
                <span className="shrink-0 whitespace-nowrap text-sm text-foreground/60">{row.comparisonCost}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center justify-between border-t-2 border-border pt-4">
            <span className="text-sm font-bold text-foreground">{copy.offer.totalComparisonLabel}</span>
            <span className="text-sm font-bold text-foreground/60 line-through">
              {copy.offer.totalComparisonValue}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
            <span className="text-sm font-bold text-foreground">{copy.offer.priceLabel}</span>
            <span className="whitespace-nowrap text-4xl font-extrabold tracking-[-0.02em] text-foreground">
              {formatEur(SUBSCRIPTION_PRICE_EUR)}
              <span className="ml-1 text-sm font-normal text-foreground/60">{copy.offer.perYearLabel}</span>
            </span>
          </div>

          <Link
            href="/signup"
            className={buttonVariants({ className: "mt-8 h-12 w-full rounded-sm text-base font-bold" })}
          >
            {copy.offer.cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Delete `src/components/landing/pricing.tsx`**

- [ ] **Step 5: Update `src/app/page.tsx`**

Change the import on line 6 from:
```tsx
import { Pricing } from "@/components/landing/pricing";
```
to:
```tsx
import { ValueStack } from "@/components/landing/value-stack";
```

Change the JSX on line 18 from:
```tsx
        <Pricing />
```
to:
```tsx
        <ValueStack />
```

- [ ] **Step 6: Full verification**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds (exit code 0).

- [ ] **Step 7: Commit**

```bash
git add src/components/landing/copy.ts src/components/landing/value-stack.tsx src/app/page.tsx
git rm src/components/landing/pricing.tsx
git commit -m "feat: replace landing pricing card with value-stack offer table"
```

---

### Task 2: Bonuses section

**Files:**
- Create: `src/components/landing/bonuses.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `MARKETING_COPY[locale].bonuses` (added in Task 1's rewrite of `copy.ts`); `useMarketingLocale` from `./locale-context`.
- Produces: exported `Bonuses` component, consumed by `page.tsx`.

- [ ] **Step 1: Create `src/components/landing/bonuses.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMarketingLocale } from "./locale-context";
import { MARKETING_COPY } from "./copy";

export function Bonuses() {
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useMarketingLocale();
  const copy = MARKETING_COPY[locale];

  return (
    <section dir={copy.dir} className="mx-auto max-w-6xl px-6 py-20">
      <h2 className="text-center text-3xl font-extrabold tracking-[-0.02em] text-foreground md:text-4xl">
        {copy.bonuses.heading}
      </h2>
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="mt-10 grid gap-6 md:grid-cols-3"
      >
        {copy.bonuses.items.map((item) => (
          <motion.div
            key={item.name}
            variants={
              shouldReduceMotion
                ? undefined
                : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
            }
            className="rounded-md border-2 border-border bg-card p-6 shadow-[4px_4px_0_0_var(--border)]"
          >
            {item.badge && (
              <span className="mb-3 inline-block rounded-full border-2 border-border bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.06em] text-accent-foreground">
                {item.badge}
              </span>
            )}
            <h3 className="font-heading text-xl font-extrabold tracking-[-0.02em] text-foreground">
              {item.name}
            </h3>
            <p className="mt-2 text-sm text-foreground/70">{item.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Update `src/app/page.tsx`**

Add the import after the `ValueStack` import:
```tsx
import { ValueStack } from "@/components/landing/value-stack";
import { Bonuses } from "@/components/landing/bonuses";
```

Add `<Bonuses />` between `<ValueStack />` and `<CtaBand />`:
```tsx
        <ValueStack />
        <Bonuses />
        <CtaBand />
```

The full file should now read:

```tsx
import { LocaleProvider } from "@/components/landing/locale-context";
import { LandingNav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { TrustCallout } from "@/components/landing/trust-callout";
import { ValueStack } from "@/components/landing/value-stack";
import { Bonuses } from "@/components/landing/bonuses";
import { CtaBand } from "@/components/landing/cta-band";
import { LandingFooter } from "@/components/landing/footer";

export default function Home() {
  return (
    <LocaleProvider>
      <LandingNav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <TrustCallout />
        <ValueStack />
        <Bonuses />
        <CtaBand />
      </main>
      <LandingFooter />
    </LocaleProvider>
  );
}
```

- [ ] **Step 3: Verification**

Run: `npx tsc --noEmit -p tsconfig.json`
Expected: no errors.

Run: `npm run build`
Expected: build succeeds (exit code 0).

Run: `npm run lint`
Expected: no errors (warnings acceptable only if they pre-existed before this change — check `git stash` diff if unsure).

- [ ] **Step 4: Commit**

```bash
git add src/components/landing/bonuses.tsx src/app/page.tsx
git commit -m "feat: add bonuses section to landing page"
```

---

### Task 3: Visual verification (design-review gate)

**Files:** none (screenshots only, no code changes expected — this task exists to catch visual regressions before calling the feature done).

**Interfaces:** none — this task drives the already-built app via the chrome-devtools MCP.

- [ ] **Step 1: Start the dev server**

Run: `npm run dev` (background)
Expected: server up at `http://localhost:3000`.

- [ ] **Step 2: Screenshot the landing page in all three languages, two viewports**

Using the chrome-devtools MCP (`navigate_page`, `resize_page`, `take_screenshot`), capture and save to `artifacts/review/`:
- `home.png` — English, 1440px
- `home-mobile.png` — English, 375px
- `home-ar.png` — Arabic, 1440px (confirm the new `ValueStack` and `Bonuses` sections render `dir="rtl"` — check boundaries flow right-to-left, comparison-cost numbers stay LTR-readable since they're numerals)
- `home-tr.png` — Turkish, 1440px

(Switch language via the existing landing nav language selector before each non-English screenshot — no new locale-switching mechanism needed.)

- [ ] **Step 3: Compare against the golden bar**

Read `artifacts/golden.png` and the four new screenshots. Confirm:
- No raw hex/Tailwind-color-class leakage (only semantic tokens visible as intended colors)
- Hard-offset shadows and 2px borders present on both new sections' cards (matching `HowItWorks`/old `Pricing` cards)
- Comparison-cost column aligns cleanly at both viewport widths, no text overflow/wrapping breaking the layout
- Arabic version reads right-to-left throughout both new sections, including the strikethrough total and price rows
- Touch targets (the CTA button) remain >= 44px tall on mobile

If any issue is found, fix it in `value-stack.tsx`/`bonuses.tsx` and re-screenshot before proceeding — do not mark this task done on a screenshot that shows a problem.

- [ ] **Step 4: Run the `/design-review` gate**

Invoke the `design-review` skill/agent against the live `/` route per `CLAUDE.md`'s design-review gate (accessibility tree via `take_snapshot` + the screenshots from Step 2). Fix every CRITICAL finding before considering this plan complete.

- [ ] **Step 5: Stop the dev server**

Kill the background `npm run dev` process started in Step 1.
