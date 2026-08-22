import type { MarketingLocale } from "./locale-context";

type MockupCopy = {
  chip: string;
  summary: string;
  deadlineLabel: string;
  deadline: string;
  replyLabel: string;
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
    trustBadges: [string, string, string];
    counterLabel: string;
    demoStatus: string;
  };
  howItWorks: {
    eyebrow: string;
    heading: string;
    steps: { title: string; description: string; mockup: StepMockup }[];
    demoCaption: string;
    shotAlts: [string, string, string];
  };
  privacy: {
    eyebrow: string;
    heading: string;
    cards: { heading: string; body: string }[];
    sureHeading: string;
    sureBody: string;
    priceChip: (freeLetterLimit: number) => string;
    priceLine: string;
  };
  faq: {
    eyebrow: string;
    heading: string;
    items: { question: string; answer: string }[];
  };
  passItOn: {
    eyebrow: string;
    heading: string;
    body: string;
    orSendItIn: string;
    whatsapp: string;
    messenger: string;
    telegram: string;
    moreApps: string;
    copyLink: string;
    linkCopiedToast: string;
    moreAppsFailed: string;
  };
  offer: {
    heading: string;
    trialBadge: (freeLetterLimit: number) => string;
    items: { name: string; description: string; comparisonCost: string }[];
    bonuses: { name: string; description: string; comparisonCost: string }[];
    totalComparisonLabel: string;
    totalComparisonValue: string;
    priceLabel: string;
    perYearLabel: string;
    monthlyNote: (price: string) => string;
    cta: string;
  };
  bonuses: {
    heading: string;
    items: { name: string; badge?: string; description: (price: string) => string }[];
  };
  cta: { badge: string; heading: string; button: string };
  footer: { privacy: string; terms: string; contact: string };
};

export const MARKETING_COPY: Record<MarketingLocale, MarketingCopy> = {
  en: {
    dir: "ltr",
    nav: { logIn: "Log in", startFreeTrial: "Start free trial" },
    hero: {
      stampBadge: (n) => `${n} letters free`,
      headlineLine1: "Know what it says.",
      headlineLine2: "Know what to do.",
      subhead:
        "Google Translate gives you the words. Papkram gives you the meaning — a plain-language summary, your deadlines, and a ready-to-send reply, in English, Arabic, or Turkish.",
      ctaPrimary: "Start free trial",
      ctaNote: "No credit card needed",
      mockup: {
        chip: "Analysis complete",
        summary: "Stadtwerke München is asking for an extra 187,42 € from your 2025 electricity bill.",
        deadlineLabel: "Deadline",
        deadline: "Pay by 28 Feb 2026",
        replyLabel: "Reply draft",
        reply: "“I am writing to confirm the payment of 187,42 € was transferred on…”",
        dir: "ltr",
      },
      trustBadges: [
        "Encrypted — only you can open your letters",
        "Never used to train AI models",
        "Stored on servers in Germany",
      ],
      counterLabel: "people signed up for early access",
      demoStatus:
        "Papkram is still in demo. We open it to everyone once enough people have signed up — every sign-up brings the launch closer.",
    },
    howItWorks: {
      eyebrow: "How it works",
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
      demoCaption: "Real screens from the app",
      shotAlts: [
        "Papkram upload screen",
        "Papkram plain-language summary with the amount and its source line",
        "Ready-to-send German reply draft",
      ],
    },
    privacy: {
      eyebrow: "Privacy",
      heading: "Your post is the most private mail you own.",
      cards: [
        {
          heading: "Encrypted storage",
          body: "Your letters are encrypted at rest. Only your account can open them.",
        },
        {
          heading: "Never trains AI",
          body: "Uploads are processed to make your summary and your reply, and nothing else. No model is trained on your mail.",
        },
        {
          heading: "German servers",
          body: "Your documents are stored on servers inside Germany, under EU data protection law.",
        },
      ],
      sureHeading: "We tell you when we're not sure",
      sureBody:
        "German bureaucratic letters are dense — amounts and dates matter. If anything in a letter is ambiguous, we flag it plainly instead of guessing. Never a silent guess on a number that could cost you.",
      priceChip: (n) => `${n} letters free`,
      priceLine: "No card to start. A paid plan takes over once your free letters are used — cancel any time.",
    },
    faq: {
      eyebrow: "Questions",
      heading: "The four things people ask.",
      items: [
        {
          question: "What letter types can it read?",
          answer:
            "Anything that arrives in a German envelope — Finanzamt, Jobcenter, Rundfunkbeitrag, health insurance, your landlord, utilities, insurers, courts. A photo or a PDF, both work.",
        },
        {
          question: "How accurate is it?",
          answer:
            "Amounts and dates are taken straight from the letter and shown next to the line they came from, so you can check them yourself. Where a letter is genuinely ambiguous, Papkram says so instead of guessing.",
        },
        {
          question: "Can I send the reply it drafts?",
          answer:
            "Yes. The draft is formally correct German, ready to copy into an email, a letter, or an authority's web form. You never write a word of German yourself.",
        },
        {
          question: "What happens to my letter after analysis?",
          answer:
            "It stays in your account, encrypted, on servers in Germany. It is never used to train an AI model, and you can delete it any time from your settings.",
        },
      ],
    },
    passItOn: {
      eyebrow: "Pass it on",
      heading: "Someone you know has an unopened letter.",
      body: "Send Papkram to the person who forwards you their post to translate. One message saves them a week of worrying.",
      orSendItIn: "Or send it in",
      whatsapp: "WhatsApp",
      messenger: "Messenger",
      telegram: "Telegram",
      moreApps: "More apps",
      copyLink: "Copy link",
      linkCopiedToast: "Link copied.",
      moreAppsFailed: "Couldn't open the share sheet — try one of the apps above instead.",
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
            "Every letter you've uploaded, every summary, every reply — stored in one place, ready whenever you need them.",
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
      monthlyNote: (price) => `or ${price}/month, cancel any time`,
      cta: "Start free trial",
    },
    bonuses: {
      heading: "Bonuses included for free, right now.",
      items: [
        {
          name: "Founder's Circle",
          badge: "First 100 founding members",
          description: (price) =>
            `As a founding member, you get direct access to our support team — not a chatbot, a real person. Your price stays ${price} a year for life, even if it rises for new members later. Every future update is added to your account automatically, free, forever.`,
        },
        {
          name: "Bureaucracy Toolkit",
          description: () =>
            "Understanding the letter is step one. This toolkit walks you through the next step — a bank transfer, a form, a direct debit — one plain-language guide at a time.",
        },
        {
          name: "Urgent Phrases Guide",
          description: () =>
            "For the moments the app can't help — a phone call, an office visit — thirty essential German phrases with pronunciation, ready when you need them.",
        },
      ],
    },
    cta: {
      badge: "Start today",
      heading: "Stop guessing what your mail says.",
      button: "Start free trial",
    },
    footer: { privacy: "Privacy", terms: "Terms", contact: "Contact" },
  },
  ar: {
    dir: "rtl",
    nav: { logIn: "تسجيل الدخول", startFreeTrial: "ابدأ تجربتك المجانية" },
    hero: {
      stampBadge: (n) => `${n.toLocaleString("ar-EG")} خطابات مجانية`,
      headlineLine1: "اعرف ما يقوله.",
      headlineLine2: "واعرف ما عليك فعله.",
      subhead:
        "ترجمة جوجل تمنحك الكلمات. أما Papkram فيمنحك المعنى — ملخص بلغة واضحة، مواعيدك النهائية، ورد جاهز للإرسال، بالإنجليزية أو العربية أو التركية.",
      ctaPrimary: "ابدأ تجربتك المجانية",
      ctaNote: "لا حاجة لبطاقة ائتمان",
      mockup: {
        chip: "تم التحليل",
        summary: "شركة كهرباء ميونخ تطلب مبلغاً إضافياً قدره 187,42 € من فاتورة الكهرباء لعام 2025.",
        deadlineLabel: "الموعد النهائي",
        deadline: "الدفع قبل 28 فبراير 2026",
        replyLabel: "مسودة الرد",
        reply: "«أكتب لأؤكد أن مبلغ 187,42 € تم تحويله بتاريخ...»",
        dir: "rtl",
      },
      trustBadges: [
        "مشفّرة — لا يمكن لأحد غيرك فتح خطاباتك",
        "لا تُستخدم أبدًا لتدريب نماذج الذكاء الاصطناعي",
        "مخزّنة على سيرفرات في ألمانيا",
      ],
      counterLabel: "شخصًا سجلوا للوصول المبكر",
      demoStatus:
        "لا يزال Papkram في مرحلة العرض التجريبي. سنفتحه للجميع عندما يسجل عدد كافٍ من الأشخاص — كل تسجيل يقرّب موعد الإطلاق.",
    },
    howItWorks: {
      eyebrow: "كيف يعمل",
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
      demoCaption: "شاشات حقيقية من التطبيق",
      shotAlts: [
        "شاشة رفع الخطاب في Papkram",
        "ملخص بلغة واضحة مع المبلغ ومصدره",
        "مسودة رد بالألمانية جاهزة للإرسال",
      ],
    },
    privacy: {
      eyebrow: "الخصوصية",
      heading: "بريدك هو أكثر ما تملكه خصوصية.",
      cards: [
        {
          heading: "تخزين مشفّر",
          body: "خطاباتك مشفّرة أثناء التخزين. حسابك وحده يمكنه فتحها.",
        },
        {
          heading: "لا تدريب للذكاء الاصطناعي",
          body: "تُعالَج الملفات المرفوعة لإنشاء ملخصك وردك فقط، لا شيء غير ذلك. لا يُدرَّب أي نموذج على بريدك.",
        },
        {
          heading: "سيرفرات في ألمانيا",
          body: "تُخزَّن مستنداتك على سيرفرات داخل ألمانيا، بموجب قانون حماية البيانات الأوروبي.",
        },
      ],
      sureHeading: "نخبرك عندما لا نكون متأكدين",
      sureBody:
        "الخطابات الألمانية الرسمية معقدة — المبالغ والتواريخ مهمة. إذا كان أي شيء في الخطاب غامضًا، نشير إليه بوضوح بدلاً من التخمين. لا تخمين صامت لرقم قد يكلفك المال.",
      priceChip: (n) => `${n.toLocaleString("ar-EG")} خطابات مجانية`,
      priceLine: "لا بطاقة للبدء. تبدأ الخطة المدفوعة بعد انتهاء خطاباتك المجانية — ألغِ في أي وقت.",
    },
    faq: {
      eyebrow: "أسئلة",
      heading: "الأسئلة الأربعة الأكثر تكرارًا.",
      items: [
        {
          question: "ما أنواع الخطابات التي يمكنه قراءتها؟",
          answer:
            "كل ما يأتي في مظروف ألماني — مكتب الضرائب، الـ Jobcenter، رسوم البث، التأمين الصحي، المالك، شركات الخدمات، شركات التأمين، المحاكم. صورة أو ملف PDF، كلاهما يعمل.",
        },
        {
          question: "ما مدى دقته؟",
          answer:
            "تُؤخذ المبالغ والتواريخ مباشرة من الخطاب وتُعرض بجانب السطر الذي وردت فيه، لتتحقق منها بنفسك. وإذا كان شيء ما غامضًا فعلاً، يقول Papkram ذلك بدلاً من التخمين.",
        },
        {
          question: "هل يمكنني إرسال الرد الذي يصيغه؟",
          answer:
            "نعم. المسودة بألمانية رسمية صحيحة، جاهزة للنسخ في بريد إلكتروني أو خطاب أو نموذج إلكتروني لجهة رسمية. لن تكتب كلمة واحدة بالألمانية بنفسك.",
        },
        {
          question: "ماذا يحدث لخطابي بعد التحليل؟",
          answer:
            "يبقى في حسابك، مشفّرًا، على سيرفرات في ألمانيا. لا يُستخدم أبدًا لتدريب أي نموذج ذكاء اصطناعي، ويمكنك حذفه في أي وقت من الإعدادات.",
        },
      ],
    },
    passItOn: {
      eyebrow: "انشر الخبر",
      heading: "شخص تعرفه لديه خطاب لم يفتحه.",
      body: "أرسل Papkram للشخص الذي يحوّل لك بريده لتترجمه. رسالة واحدة تعفيه من أسبوع من القلق.",
      orSendItIn: "أو أرسله عبر",
      whatsapp: "واتساب",
      messenger: "ماسنجر",
      telegram: "تليجرام",
      moreApps: "تطبيقات أخرى",
      copyLink: "انسخ الرابط",
      linkCopiedToast: "تم النسخ",
      moreAppsFailed: "تعذر فتح قائمة المشاركة — جرّب أحد التطبيقات أعلاه بدلاً من ذلك.",
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
            "كل خطاب رفعته، وكل ملخص، وكل رد — محفوظ في مكان واحد، جاهز متى احتجت إليه.",
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
      monthlyNote: (price) => `أو ${price} شهريًا، ألغِ في أي وقت`,
      cta: "ابدأ تجربتك المجانية",
    },
    bonuses: {
      heading: "مكافآت مُضمّنة مجانًا، الآن.",
      items: [
        {
          name: "دائرة المؤسسين",
          badge: "أول 100 عضو مؤسس",
          description: (price) =>
            `بصفتك عضوًا مؤسسًا، تحصل على تواصل مباشر مع فريق الدعم لدينا — ليس روبوت محادثة، بل شخص حقيقي. يبقى سعرك ${price} سنويًا مدى الحياة، حتى لو ارتفع لاحقًا للأعضاء الجدد. كل تحديث مستقبلي يُضاف إلى حسابك تلقائيًا، مجانًا، إلى الأبد.`,
        },
        {
          name: "عدة التعامل مع البيروقراطية",
          description: () =>
            "فهم الخطاب هو الخطوة الأولى. هذه العدة ترشدك إلى الخطوة التالية — تحويل مصرفي، أو نموذج، أو خصم مباشر — دليل واحد بلغة واضحة في كل مرة.",
        },
        {
          name: "دليل العبارات العاجلة",
          description: () =>
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
      stampBadge: (n) => `${n} mektup ücretsiz`,
      headlineLine1: "Ne dediğini bilin.",
      headlineLine2: "Ne yapacağınızı bilin.",
      subhead:
        "Google Translate size kelimeleri verir. Papkram ise size anlamı verir — sade bir özet, son tarihleriniz ve gönderime hazır bir yanıt, İngilizce, Arapça veya Türkçe olarak.",
      ctaPrimary: "Ücretsiz denemeyi başlat",
      ctaNote: "Kredi kartı gerekmez",
      mockup: {
        chip: "Analiz tamamlandı",
        summary: "Stadtwerke München, 2025 elektrik faturanız için 187,42 € ek ödeme talep ediyor.",
        deadlineLabel: "Son tarih",
        deadline: "Son ödeme: 28 Şubat 2026",
        replyLabel: "Yanıt taslağı",
        reply: "“187,42 € tutarındaki ödemenin yapıldığını onaylamak için yazıyorum…”",
        dir: "ltr",
      },
      trustBadges: [
        "Şifreli — mektuplarınızı yalnızca siz açabilirsiniz",
        "Yapay zeka modellerini eğitmek için asla kullanılmaz",
        "Almanya'daki sunucularda saklanır",
      ],
      counterLabel: "kişi erken erişim için kaydoldu",
      demoStatus:
        "Papkram henüz demo aşamasında. Yeterli sayıda kişi kaydolduğunda herkesin kullanımına açıyoruz — her yeni kayıt lansmanı yakınlaştırıyor.",
    },
    howItWorks: {
      eyebrow: "Nasıl çalışır",
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
      demoCaption: "Uygulamadan gerçek ekranlar",
      shotAlts: [
        "Papkram mektup yükleme ekranı",
        "Tutarı ve kaynağını gösteren sade dilde özet",
        "Gönderime hazır Almanca yanıt taslağı",
      ],
    },
    privacy: {
      eyebrow: "Gizlilik",
      heading: "Postanız, sahip olduğunuz en özel şeydir.",
      cards: [
        {
          heading: "Şifreli saklama",
          body: "Mektuplarınız saklanırken şifrelenir. Yalnızca sizin hesabınız açabilir.",
        },
        {
          heading: "Yapay zekayı eğitmez",
          body: "Yüklemeler yalnızca özetinizi ve yanıtınızı oluşturmak için işlenir, başka hiçbir şey için. Postanızla hiçbir model eğitilmez.",
        },
        {
          heading: "Alman sunucuları",
          body: "Belgeleriniz, AB veri koruma hukuku kapsamında Almanya içindeki sunucularda saklanır.",
        },
      ],
      sureHeading: "Emin olmadığımızda size söyleriz",
      sureBody:
        "Alman resmi mektupları yoğun içeriklidir — tutarlar ve tarihler önemlidir. Bir mektupta belirsiz bir şey varsa, tahmin etmek yerine açıkça belirtiriz. Size zarar verebilecek bir rakamda asla sessizce tahmin yürütmeyiz.",
      priceChip: (n) => `${n} mektup ücretsiz`,
      priceLine: "Başlamak için kart gerekmez. Ücretsiz mektuplarınız bitince ücretli plan devralır — istediğiniz zaman iptal edin.",
    },
    faq: {
      eyebrow: "Sorular",
      heading: "İnsanların sorduğu dört şey.",
      items: [
        {
          question: "Hangi mektup türlerini okuyabiliyor?",
          answer:
            "Alman zarfıyla gelen her şey — Finanzamt, Jobcenter, Rundfunkbeitrag, sağlık sigortası, ev sahibiniz, faturalar, sigortacılar, mahkemeler. Fotoğraf da PDF de olur.",
        },
        {
          question: "Ne kadar doğru?",
          answer:
            "Tutarlar ve tarihler doğrudan mektuptan alınır ve geldikleri satırın yanında gösterilir, böylece kendiniz kontrol edebilirsiniz. Bir mektup gerçekten belirsizse, Papkram tahmin etmek yerine bunu söyler.",
        },
        {
          question: "Hazırladığı yanıtı gönderebilir miyim?",
          answer:
            "Evet. Taslak, resmi olarak doğru Almancadır; bir e-postaya, mektuba veya kurumun web formuna kopyalamaya hazırdır. Almanca tek kelime yazmanıza gerek yok.",
        },
        {
          question: "Analizden sonra mektubuma ne oluyor?",
          answer:
            "Hesabınızda, şifreli olarak, Almanya'daki sunucularda kalır. Hiçbir yapay zeka modelini eğitmek için kullanılmaz ve ayarlarınızdan istediğiniz zaman silebilirsiniz.",
        },
      ],
    },
    passItOn: {
      eyebrow: "Paylaş",
      heading: "Tanıdığınız birinin açılmamış bir mektubu var.",
      body: "Postasını size çevirmeniz için gönderen kişiye Papkram'ı iletin. Tek bir mesaj, bir haftalık endişeyi ortadan kaldırır.",
      orSendItIn: "Ya da şununla gönder",
      whatsapp: "WhatsApp",
      messenger: "Messenger",
      telegram: "Telegram",
      moreApps: "Diğer uygulamalar",
      copyLink: "Bağlantıyı kopyala",
      linkCopiedToast: "Kopyalandı",
      moreAppsFailed: "Paylaşım menüsü açılamadı — bunun yerine yukarıdaki uygulamalardan birini deneyin.",
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
            "Yüklediğiniz her mektup, her özet, her yanıt — tek bir yerde saklanır, ihtiyacınız olduğunda hazır.",
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
      monthlyNote: (price) => `veya ayda ${price}, istediğiniz zaman iptal edin`,
      cta: "Ücretsiz denemeyi başlat",
    },
    bonuses: {
      heading: "Şu anda ücretsiz dahil olan bonuslar.",
      items: [
        {
          name: "Kurucular Çemberi",
          badge: "İlk 100 kurucu üye",
          description: (price) =>
            `Kurucu üye olarak destek ekibimize doğrudan ulaşırsınız — bir chatbot değil, gerçek bir kişi. Fiyatınız, ileride yeni üyeler için artsa bile, ömür boyu yılda ${price} olarak kalır. Gelecekteki her güncelleme hesabınıza otomatik olarak, ücretsiz ve sonsuza dek eklenir.`,
        },
        {
          name: "Bürokrasi Araç Seti",
          description: () =>
            "Mektubu anlamak birinci adımdır. Bu araç seti sizi bir sonraki adımda yönlendirir — banka havalesi, bir form, otomatik ödeme talimatı — her seferinde tek bir sade rehberle.",
        },
        {
          name: "Acil Durum İfadeleri Rehberi",
          description: () =>
            "Uygulamanın yardımcı olamadığı anlar için — bir telefon görüşmesi, bir daire ziyareti — telaffuzuyla birlikte otuz temel Almanca ifade, ihtiyacınız olduğunda hazır.",
        },
      ],
    },
    cta: {
      badge: "Bugün başla",
      heading: "Postanızın ne dediğini tahmin etmeyi bırakın.",
      button: "Ücretsiz denemeyi başlat",
    },
    footer: { privacy: "Gizlilik", terms: "Şartlar", contact: "İletişim" },
  },
};
