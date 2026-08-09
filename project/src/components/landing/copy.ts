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
  pricing: {
    heading: string;
    badge: (freeLetterLimit: number) => string;
    priceSuffix: (freeLetterLimit: number) => string;
    features: string[];
    cta: string;
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
    pricing: {
      heading: "One plan. Everything included.",
      badge: (n) => `${n} free letters, no card`,
      priceSuffix: (n) => `/ year, after your ${n} free letters`,
      features: [
        "Unlimited letter analyses",
        "Cancel any time",
        "Summaries, deadlines, and reply drafts",
        "English, Arabic, and Turkish",
        "Full letter history",
      ],
      cta: "Start free trial",
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
    pricing: {
      heading: "خطة واحدة. كل شيء متضمن.",
      badge: (n) => `${n} خطابات مجانية، بدون بطاقة`,
      priceSuffix: (n) => `/ سنويًا، بعد خطاباتك الـ ${n} المجانية`,
      features: [
        "تحليل غير محدود للخطابات",
        "إلغاء في أي وقت",
        "ملخصات، مواعيد نهائية، ومسودات ردود",
        "الإنجليزية والعربية والتركية",
        "سجل كامل للخطابات",
      ],
      cta: "ابدأ تجربتك المجانية",
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
    pricing: {
      heading: "Tek plan. Her şey dahil.",
      badge: (n) => `${n} ücretsiz mektup, kart gerekmez`,
      priceSuffix: (n) => `/ yıl, ${n} ücretsiz mektubunuzdan sonra`,
      features: [
        "Sınırsız mektup analizi",
        "İstediğiniz zaman iptal edin",
        "Özetler, son tarihler ve yanıt taslakları",
        "İngilizce, Arapça ve Türkçe",
        "Tam mektup geçmişi",
      ],
      cta: "Ücretsiz denemeyi başlat",
    },
    cta: {
      badge: "BUGÜN BAŞLA",
      heading: "Postanızın ne dediğini tahmin etmeyi bırakın.",
      button: "Ücretsiz denemeyi başlat",
    },
    footer: { privacy: "Gizlilik", terms: "Şartlar", contact: "İletişim" },
  },
};
