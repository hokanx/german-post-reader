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
        reply: "\u201CI am writing to confirm the payment of 187,42 € was transferred on\u2026\u201D",
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
        reply: "\u00ABأكتب لأؤكد أن مبلغ 187,42 € تم تحويله بتاريخ...\u00bb",
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
        reply: "\u201C187,42 € tutarındaki ödemenin yapıldığını onaylamak için yazıyorum\u2026\u201D",
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
      badge: "BUGÜN BAŞLA",
      heading: "Postanızın ne dediğini tahmin etmeyi bırakın.",
      button: "Ücretsiz denemeyi başlat",
    },
    footer: { privacy: "Gizlilik", terms: "Şartlar", contact: "İletişim" },
  },
};
