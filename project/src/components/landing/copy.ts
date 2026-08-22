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
    trustBadges: [string, string, string];
  };
  howItWorks: {
    heading: string;
    steps: { title: string; description: string; mockup: StepMockup }[];
  };
  realLetter: {
    eyebrow: string;
    heading: string;
    body: string;
    letterLabel: string;
    letterSender: string;
    letterRecipient: string;
    letterSubject: string;
    letterGreeting: string;
    letterBody1: string;
    letterBody2: string;
    letterBody3: string;
    letterClosing: string;
    letterSignature: string;
    analysisChip: string;
    analysisHeading: string;
    analysisBody: string;
    deadlineLabel: string;
    deadlineBody: string;
    deadlineNote: string;
    rightLabel: string;
    rightBody: string;
    replyDraftedHeading: string;
    replyDraftedBody: string;
    dragHint: string;
  };
  privacy: {
    eyebrow: string;
    heading: string;
    cards: { heading: string; body: string }[];
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
    instagramStory: string;
    whatsappStory: string;
    imageShareNote: string;
    orSendItIn: string;
    whatsapp: string;
    messenger: string;
    telegram: string;
    moreApps: string;
    copyLink: string;
    linkCopiedToast: string;
    shareCardHeadline: string;
    posterPreparingToast: string;
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
  demoPitch: {
    counter: (registeredCount: number) => string;
    heading: string;
    body: (freeLetterLimit: number) => string;
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
      headlineLine1: "Know what it says.",
      headlineLine2: "Know what to do.",
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
      trustBadges: [
        "Encrypted — only you can open your letters",
        "Never used to train AI models",
        "Stored on servers in Germany",
      ],
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
    realLetter: {
      eyebrow: "A REAL LETTER",
      heading: "Drag to read your post in plain English.",
      body: "A Bürgergeld decision from the Jobcenter: six paragraphs of SGB II on the left, what it actually means for you on the right.",
      letterLabel: "THE LETTER YOU RECEIVED",
      letterSender: "JOBCENTER MÜNCHEN",
      letterRecipient: "Frau A. Osei · Lindwurmstr. 42 · 80337 München",
      letterSubject: "Bescheid über die Bewilligung von Bürgergeld",
      letterGreeting: "Sehr geehrte Frau Osei,",
      letterBody1:
        "auf Ihren Antrag vom 14.01.2026 hin wird Ihnen für die Zeit vom 01.02.2026 bis 31.07.2026 Bürgergeld nach dem Zweiten Buch Sozialgesetzbuch (SGB II) in Höhe von monatlich 563,00 € bewilligt. Die Leistung setzt sich zusammen aus dem Regelbedarf sowie den anerkannten Aufwendungen für Unterkunft und Heizung.",
      letterBody2:
        "Sie sind verpflichtet, uns jede Änderung Ihrer persönlichen und wirtschaftlichen Verhältnisse unverzüglich mitzuteilen. Bitte reichen Sie die beigefügte Anlage EK bis zum 28.02.2026 vollständig ausgefüllt nach. Andernfalls kann die Leistung nach § 66 SGB I ganz oder teilweise entzogen werden.",
      letterBody3:
        "Gegen diesen Bescheid können Sie innerhalb eines Monats nach Bekanntgabe schriftlich oder zur Niederschrift Widerspruch einlegen.",
      letterClosing: "Mit freundlichen Grüßen",
      letterSignature: "i. A. Weber",
      analysisChip: "ANALYSIS COMPLETE",
      analysisHeading: "Your Bürgergeld was approved.",
      analysisBody:
        "Jobcenter München approved the application you sent on 14 January. From 1 February to 31 July 2026 you receive 563,00 € a month — the standard rate plus your accepted rent and heating costs.",
      deadlineLabel: "ONE DEADLINE",
      deadlineBody: "Return the attached Anlage EK form by 28 February 2026.",
      deadlineNote: "If it arrives late, the office can reduce or stop the payments.",
      rightLabel: "YOUR RIGHT",
      rightBody: "You can appeal this decision within one month of receiving it.",
      replyDraftedHeading: "Reply drafted in German",
      replyDraftedBody: "Copy and send — you don't write a word of German.",
      dragHint: "Drag the handle across the letter",
    },
    privacy: {
      eyebrow: "PRIVACY",
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
        {
          heading: "We tell you when we're not sure",
          body: "German bureaucratic letters are dense — amounts and dates matter. If anything in a letter is ambiguous, we flag it plainly instead of guessing. Never a silent guess on a number that could cost you.",
        },
      ],
    },
    faq: {
      eyebrow: "QUESTIONS",
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
      eyebrow: "PASS IT ON",
      heading: "Someone you know has an unopened letter.",
      body: "Send Papkram to the person who forwards you their post to translate. One message saves them a week of worrying.",
      instagramStory: "Instagram Story",
      whatsappStory: "WhatsApp Story",
      imageShareNote:
        "Shares this card as an image, so Instagram Story and WhatsApp Status appear in your phone's share sheet. On desktop it downloads the card instead.",
      orSendItIn: "OR SEND IT IN",
      whatsapp: "WhatsApp",
      messenger: "Messenger",
      telegram: "Telegram",
      moreApps: "More apps",
      copyLink: "Copy link",
      linkCopiedToast: "Link copied.",
      shareCardHeadline: "Stop guessing what your German post says.",
      posterPreparingToast: "Preparing your card…",
      moreAppsFailed: "Couldn't open the share sheet — try one of the apps above instead.",
    },
    demoPitch: {
      counter: (registeredCount) => `${registeredCount} people signed up for early access`,
      heading: "Free demo, no card needed.",
      body: (freeLetterLimit) =>
        `Try ${freeLetterLimit} real letters. We're not selling yet — sign up and we'll email you the moment Papkram fully launches.`,
      cta: "Start free demo",
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
      headlineLine1: "اعرف ماذا يقول.",
      headlineLine2: "اعرف ماذا تفعل.",
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
      trustBadges: [
        "مشفّرة — أنت فقط من يمكنه فتح خطاباتك",
        "لا تُستخدم أبدًا لتدريب نماذج الذكاء الاصطناعي",
        "محفوظة على خوادم في ألمانيا",
      ],
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
    realLetter: {
      eyebrow: "خطاب حقيقي",
      heading: "اسحب لتقرأ بريدك بلغة عربية واضحة.",
      body: "قرار بورغرغيلد (Bürgergeld) من مركز التوظيف: فقرات معقدة من قانون SGB II الألماني، مقابل ما تعنيه فعليًا لك بلغة واضحة.",
      letterLabel: "الخطاب الذي استلمته",
      letterSender: "JOBCENTER MÜNCHEN",
      letterRecipient: "Frau A. Osei · Lindwurmstr. 42 · 80337 München",
      letterSubject: "Bescheid über die Bewilligung von Bürgergeld",
      letterGreeting: "Sehr geehrte Frau Osei,",
      letterBody1:
        "auf Ihren Antrag vom 14.01.2026 hin wird Ihnen für die Zeit vom 01.02.2026 bis 31.07.2026 Bürgergeld nach dem Zweiten Buch Sozialgesetzbuch (SGB II) in Höhe von monatlich 563,00 € bewilligt. Die Leistung setzt sich zusammen aus dem Regelbedarf sowie den anerkannten Aufwendungen für Unterkunft und Heizung.",
      letterBody2:
        "Sie sind verpflichtet, uns jede Änderung Ihrer persönlichen und wirtschaftlichen Verhältnisse unverzüglich mitzuteilen. Bitte reichen Sie die beigefügte Anlage EK bis zum 28.02.2026 vollständig ausgefüllt nach. Andernfalls kann die Leistung nach § 66 SGB I ganz oder teilweise entzogen werden.",
      letterBody3:
        "Gegen diesen Bescheid können Sie innerhalb eines Monats nach Bekanntgabe schriftlich oder zur Niederschrift Widerspruch einlegen.",
      letterClosing: "Mit freundlichen Grüßen",
      letterSignature: "i. A. Weber",
      analysisChip: "تم التحليل",
      analysisHeading: "تمت الموافقة على طلب البورغرغيلد الخاص بك.",
      analysisBody:
        "وافق مركز التوظيف في ميونخ على الطلب الذي أرسلته في 14 يناير. من 1 فبراير إلى 31 يوليو 2026 ستحصل على 563,00 € شهريًا — المعدل الأساسي بالإضافة إلى تكاليف الإيجار والتدفئة المعتمدة.",
      deadlineLabel: "موعد نهائي واحد",
      deadlineBody: "أعد نموذج Anlage EK المرفق بحلول 28 فبراير 2026.",
      deadlineNote: "إذا وصل متأخرًا، يمكن للمكتب تخفيض المدفوعات أو إيقافها.",
      rightLabel: "حقك",
      rightBody: "يمكنك الطعن في هذا القرار خلال شهر واحد من استلامه.",
      replyDraftedHeading: "تمت صياغة الرد بالألمانية",
      replyDraftedBody: "انسخه وأرسله — لن تكتب كلمة واحدة بالألمانية.",
      dragHint: "اسحب المقبض عبر الخطاب",
    },
    privacy: {
      eyebrow: "الخصوصية",
      heading: "بريدك هو أكثر مراسلاتك خصوصية.",
      cards: [
        {
          heading: "تخزين مشفّر",
          body: "خطاباتك مشفّرة أثناء التخزين. حسابك فقط هو من يمكنه فتحها.",
        },
        {
          heading: "لا تُدرّب الذكاء الاصطناعي أبدًا",
          body: "تتم معالجة الملفات المرفوعة فقط لإنشاء ملخصك وردك — ولا شيء غير ذلك. لا يتم تدريب أي نموذج على بريدك.",
        },
        {
          heading: "خوادم ألمانية",
          body: "تُحفظ مستنداتك على خوادم داخل ألمانيا، بموجب قانون حماية البيانات الأوروبي.",
        },
        {
          heading: "نخبرك عندما لا نكون متأكدين",
          body: "الخطابات الألمانية الرسمية معقدة — المبالغ والتواريخ مهمة. إذا كان أي شيء في الخطاب غامضًا، نشير إليه بوضوح بدلاً من التخمين. لا تخمين صامت لرقم قد يكلفك المال.",
        },
      ],
    },
    faq: {
      eyebrow: "أسئلة",
      heading: "الأسئلة الأربعة الأكثر شيوعًا.",
      items: [
        {
          question: "ما أنواع الخطابات التي يمكنه قراءتها؟",
          answer:
            "أي شيء يصل في مظروف ألماني — مكتب الضرائب، مركز التوظيف، رسوم البث، التأمين الصحي، صاحب العقار، شركات المرافق، شركات التأمين، المحاكم. صورة أو ملف PDF، كلاهما يعمل.",
        },
        {
          question: "ما مدى دقته؟",
          answer:
            "تُؤخذ المبالغ والتواريخ مباشرة من الخطاب وتُعرض بجانب السطر الذي وردت فيه، حتى تتمكن من التحقق منها بنفسك. وحين يكون الخطاب غامضًا فعليًا، يخبرك Papkram بذلك بدلاً من التخمين.",
        },
        {
          question: "هل يمكنني إرسال الرد الذي يصيغه؟",
          answer:
            "نعم. المسودة مكتوبة بألمانية صحيحة رسميًا، جاهزة للنسخ في بريد إلكتروني أو خطاب أو نموذج إلكتروني لجهة رسمية. لن تكتب كلمة واحدة بالألمانية بنفسك.",
        },
        {
          question: "ماذا يحدث لخطابي بعد التحليل؟",
          answer:
            "يبقى في حسابك، مشفّرًا، على خوادم في ألمانيا. لا يُستخدم أبدًا لتدريب أي نموذج ذكاء اصطناعي، ويمكنك حذفه في أي وقت من إعداداتك.",
        },
      ],
    },
    passItOn: {
      eyebrow: "شارك التطبيق",
      heading: "هل تعرف شخصًا لديه خطاب لم يفتحه بعد؟",
      body: "أرسل Papkram إلى الشخص الذي يرسل لك بريده لترجمته. رسالة واحدة توفر عليه أسبوعًا من القلق.",
      instagramStory: "ستوري إنستغرام",
      whatsappStory: "ستوري واتساب",
      imageShareNote:
        "يشارك هذه البطاقة كصورة، لذا يظهر ستوري إنستغرام وحالة واتساب في قائمة المشاركة على هاتفك. على الحاسوب، يتم تنزيل البطاقة بدلاً من ذلك.",
      orSendItIn: "أو أرسله عبر",
      whatsapp: "واتساب",
      messenger: "ماسنجر",
      telegram: "تيليجرام",
      moreApps: "تطبيقات أخرى",
      copyLink: "نسخ الرابط",
      linkCopiedToast: "تم نسخ الرابط.",
      shareCardHeadline: "توقف عن التخمين بشأن ما يقوله بريدك الألماني.",
      posterPreparingToast: "جارٍ تجهيز البطاقة…",
      moreAppsFailed: "تعذر فتح قائمة المشاركة — جرّب أحد التطبيقات أعلاه بدلاً من ذلك.",
    },
    demoPitch: {
      counter: (registeredCount) => `${registeredCount} شخصًا سجلوا للوصول المبكر`,
      heading: "تجربة مجانية، بدون بطاقة.",
      body: (freeLetterLimit) =>
        `جرّب ${freeLetterLimit} خطابات حقيقية. لسنا نبيع بعد — سجّل وسنراسلك بالبريد الإلكتروني بمجرد إطلاق Papkram رسميًا.`,
      cta: "ابدأ التجربة المجانية",
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
      stampBadge: (n) => `${n} ÜCRETSİZ MEKTUP`,
      headlineLine1: "Ne dediğini bilin.",
      headlineLine2: "Ne yapacağınızı bilin.",
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
      trustBadges: [
        "Şifrelenir — mektuplarınızı yalnızca siz açabilirsiniz",
        "Yapay zeka modellerini eğitmek için asla kullanılmaz",
        "Almanya'daki sunucularda saklanır",
      ],
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
    realLetter: {
      eyebrow: "GERÇEK BİR MEKTUP",
      heading: "Mektubunuzu sade Türkçe okumak için sürükleyin.",
      body: "Jobcenter'dan bir Bürgergeld kararı: karmaşık SGB II Almancası, karşısında sizin için gerçekte ne anlama geldiği.",
      letterLabel: "ALDIĞINIZ MEKTUP",
      letterSender: "JOBCENTER MÜNCHEN",
      letterRecipient: "Frau A. Osei · Lindwurmstr. 42 · 80337 München",
      letterSubject: "Bescheid über die Bewilligung von Bürgergeld",
      letterGreeting: "Sehr geehrte Frau Osei,",
      letterBody1:
        "auf Ihren Antrag vom 14.01.2026 hin wird Ihnen für die Zeit vom 01.02.2026 bis 31.07.2026 Bürgergeld nach dem Zweiten Buch Sozialgesetzbuch (SGB II) in Höhe von monatlich 563,00 € bewilligt. Die Leistung setzt sich zusammen aus dem Regelbedarf sowie den anerkannten Aufwendungen für Unterkunft und Heizung.",
      letterBody2:
        "Sie sind verpflichtet, uns jede Änderung Ihrer persönlichen und wirtschaftlichen Verhältnisse unverzüglich mitzuteilen. Bitte reichen Sie die beigefügte Anlage EK bis zum 28.02.2026 vollständig ausgefüllt nach. Andernfalls kann die Leistung nach § 66 SGB I ganz oder teilweise entzogen werden.",
      letterBody3:
        "Gegen diesen Bescheid können Sie innerhalb eines Monats nach Bekanntgabe schriftlich oder zur Niederschrift Widerspruch einlegen.",
      letterClosing: "Mit freundlichen Grüßen",
      letterSignature: "i. A. Weber",
      analysisChip: "Analiz tamamlandı",
      analysisHeading: "Bürgergeld başvurunuz onaylandı.",
      analysisBody:
        "Jobcenter München, 14 Ocak'ta gönderdiğiniz başvuruyu onayladı. 1 Şubat'tan 31 Temmuz 2026'ya kadar ayda 563,00 € alacaksınız — standart tutar artı kabul edilen kira ve ısıtma giderleri.",
      deadlineLabel: "TEK SON TARİH",
      deadlineBody: "Ekli Anlage EK formunu 28 Şubat 2026'ya kadar geri gönderin.",
      deadlineNote: "Geç gelirse, kurum ödemeleri azaltabilir veya durdurabilir.",
      rightLabel: "HAKKINIZ",
      rightBody: "Bu kararı aldığınız tarihten itibaren bir ay içinde itiraz edebilirsiniz.",
      replyDraftedHeading: "Yanıt Almanca olarak hazırlandı",
      replyDraftedBody: "Kopyalayıp gönderin — tek kelime Almanca yazmanıza gerek yok.",
      dragHint: "Tutamacı mektubun üzerinde sürükleyin",
    },
    privacy: {
      eyebrow: "GİZLİLİK",
      heading: "Postanız sahip olduğunuz en özel mektuptur.",
      cards: [
        {
          heading: "Şifreli depolama",
          body: "Mektuplarınız beklemede şifrelenir. Yalnızca hesabınız onları açabilir.",
        },
        {
          heading: "Yapay zekayı asla eğitmez",
          body: "Yüklemeler yalnızca özetinizi ve yanıtınızı oluşturmak için işlenir, başka hiçbir şey için değil. Hiçbir model postanız üzerinde eğitilmez.",
        },
        {
          heading: "Alman sunucular",
          body: "Belgeleriniz, AB veri koruma kanunu kapsamında Almanya içindeki sunucularda saklanır.",
        },
        {
          heading: "Emin olmadığımızda size söyleriz",
          body: "Alman resmi mektupları yoğun içeriklidir — tutarlar ve tarihler önemlidir. Bir mektupta belirsiz bir şey varsa, tahmin etmek yerine açıkça belirtiriz. Size zarar verebilecek bir rakamda asla sessizce tahmin yürütmeyiz.",
        },
      ],
    },
    faq: {
      eyebrow: "SORULAR",
      heading: "En çok sorulan dört şey.",
      items: [
        {
          question: "Hangi mektup türlerini okuyabilir?",
          answer:
            "Alman zarfıyla gelen her şey — Finanzamt, Jobcenter, Rundfunkbeitrag, sağlık sigortası, ev sahibiniz, hizmet şirketleri, sigortacılar, mahkemeler. Fotoğraf ya da PDF, ikisi de çalışır.",
        },
        {
          question: "Ne kadar doğru?",
          answer:
            "Tutarlar ve tarihler doğrudan mektuptan alınır ve geldikleri satırın yanında gösterilir, böylece kendiniz kontrol edebilirsiniz. Bir mektup gerçekten belirsizse, Papkram tahmin etmek yerine bunu söyler.",
        },
        {
          question: "Hazırladığı yanıtı gönderebilir miyim?",
          answer:
            "Evet. Taslak, resmi olarak doğru Almanca olup bir e-postaya, mektuba veya bir kurumun web formuna kopyalamaya hazırdır. Almanca tek kelime bile yazmanıza gerek yoktur.",
        },
        {
          question: "Analizden sonra mektubuma ne olur?",
          answer:
            "Hesabınızda, şifreli olarak, Almanya'daki sunucularda kalır. Hiçbir yapay zeka modelini eğitmek için kullanılmaz ve istediğiniz zaman ayarlarınızdan silebilirsiniz.",
        },
      ],
    },
    passItOn: {
      eyebrow: "PAYLAŞIN",
      heading: "Tanıdığınız birinin açılmamış bir mektubu mu var?",
      body: "Papkram'ı, postasını çevirmeniz için size ileten kişiye gönderin. Tek bir mesaj, onlara bir haftalık endişeyi önler.",
      instagramStory: "Instagram Hikayesi",
      whatsappStory: "WhatsApp Hikayesi",
      imageShareNote:
        "Bu kartı görsel olarak paylaşır, böylece Instagram Hikayesi ve WhatsApp Durumu telefonunuzun paylaşım menüsünde görünür. Masaüstünde bunun yerine kart indirilir.",
      orSendItIn: "YA DA ŞURADAN GÖNDERİN",
      whatsapp: "WhatsApp",
      messenger: "Messenger",
      telegram: "Telegram",
      moreApps: "Diğer uygulamalar",
      copyLink: "Bağlantıyı kopyala",
      linkCopiedToast: "Bağlantı kopyalandı.",
      shareCardHeadline: "Alman postanızın ne dediğini tahmin etmeyi bırakın.",
      posterPreparingToast: "Kartınız hazırlanıyor…",
      moreAppsFailed: "Paylaşım menüsü açılamadı — bunun yerine yukarıdaki uygulamalardan birini deneyin.",
    },
    demoPitch: {
      counter: (registeredCount) => `${registeredCount} kişi erken erişim için kaydoldu`,
      heading: "Ücretsiz demo, kart gerekmez.",
      body: (freeLetterLimit) =>
        `${freeLetterLimit} gerçek mektubu deneyin. Henüz satış yapmıyoruz — kaydolun, Papkram tam olarak yayına girer girmez size e-posta gönderelim.`,
      cta: "Ücretsiz demoyu başlat",
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
      badge: "BUGÜN BAŞLA",
      heading: "Postanızın ne dediğini tahmin etmeyi bırakın.",
      button: "Ücretsiz denemeyi başlat",
    },
    footer: { privacy: "Gizlilik", terms: "Şartlar", contact: "İletişim" },
  },
};
