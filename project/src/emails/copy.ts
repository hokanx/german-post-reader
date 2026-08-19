import type { AppLanguage } from "@/lib/letters/types";

type WelcomeEmailCopy = {
  dir: "ltr" | "rtl";
  subject: (freeLetterLimit: number) => string;
  preview: (freeLetterLimit: number) => string;
  pill: string;
  heading: string;
  intro: (freeLetterLimit: number) => string;
  features: { label: string; text: string }[];
  riskNote: string;
  priceNote: (price: string) => string;
  pillDemo: string;
  headingDemo: string;
  demoNote: string;
  cta: string;
  footer: string;
};

export const WELCOME_EMAIL_COPY: Record<AppLanguage, WelcomeEmailCopy> = {
  en: {
    dir: "ltr",
    subject: (limit) => `Welcome — your first ${limit} letters are free`,
    preview: (limit) => `Your first ${limit} letters are free — no card required`,
    pill: "Account ready",
    heading: "Your account is ready",
    intro: (limit) =>
      `You have ${limit} free letter analyses to start with, no card required.`,
    features: [
      { label: "Summary", text: "A plain-language summary of what the letter actually says." },
      { label: "Deadlines", text: "Any dates or deadlines flagged clearly, so nothing slips by." },
      { label: "Reply draft", text: "A ready-to-send reply in German, with a translation so you know exactly what it says." },
    ],
    riskNote:
      "If a letter mentions an amount or date we're not fully sure about, we'll say so plainly rather than guess.",
    priceNote: (price) => `After your free letters, unlocking unlimited letters is ${price} per year.`,
    pillDemo: "Demo ready",
    headingDemo: "Your free demo is ready",
    demoNote: "We're not selling yet — once Papkram fully launches, we'll email you.",
    cta: "Upload your first letter",
    footer: "Papkram — plain-language summaries, deadlines, and reply drafts for German mail.",
  },
  ar: {
    dir: "rtl",
    subject: (limit) => `أهلًا بك — أول ${limit} خطابات مجانًا`,
    preview: (limit) => `أول ${limit} خطابات لك مجانية — دون الحاجة لبطاقة`,
    pill: "الحساب جاهز",
    heading: "حسابك جاهز الآن",
    intro: (limit) => `لديك ${limit} تحليلات خطابات مجانية للبدء، دون الحاجة إلى بطاقة.`,
    features: [
      { label: "الملخص", text: "ملخص بلغة واضحة لما يقوله الخطاب فعليًا." },
      { label: "المواعيد النهائية", text: "أي تواريخ أو مواعيد نهائية موضحة بجلاء حتى لا تفوتك." },
      { label: "مسودة الرد", text: "رد جاهز للإرسال بالألمانية، مع ترجمة حتى تعرف بالضبط ما تقوله." },
    ],
    riskNote: "إذا ذكر الخطاب مبلغًا أو تاريخًا لسنا متأكدين منه تمامًا، سنوضح ذلك بصراحة بدلاً من التخمين.",
    priceNote: (price) => `بعد خطاباتك المجانية، فتح خطابات غير محدودة يكلف ${price} سنويًا.`,
    pillDemo: "التجربة جاهزة",
    headingDemo: "تجربتك المجانية جاهزة الآن",
    demoNote: "لسنا نبيع بعد — بمجرد إطلاق Papkram رسميًا، سنراسلك بالبريد الإلكتروني.",
    cta: "ارفع خطابك الأول",
    footer: "Papkram — ملخصات بلغة واضحة، مواعيد نهائية، ومسودات ردود للبريد الألماني.",
  },
  tr: {
    dir: "ltr",
    subject: (limit) => `Hoş geldiniz — ilk ${limit} mektup ücretsiz`,
    preview: (limit) => `İlk ${limit} mektubunuz ücretsiz — kart gerekmez`,
    pill: "Hesap hazır",
    heading: "Hesabınız hazır",
    intro: (limit) => `Başlamak için ${limit} ücretsiz mektup analiziniz var, kart gerekmez.`,
    features: [
      { label: "Özet", text: "Mektubun gerçekte ne dediğinin sade bir özeti." },
      { label: "Son tarihler", text: "Herhangi bir tarih veya son tarih açıkça belirtilir, hiçbiri kaçmaz." },
      { label: "Yanıt taslağı", text: "Almanca, gönderime hazır bir yanıt — ne dediğini tam olarak bilmeniz için çevirisiyle birlikte." },
    ],
    riskNote: "Bir mektupta emin olmadığımız bir tutar veya tarih varsa, tahmin etmek yerine bunu açıkça belirtiriz.",
    priceNote: (price) => `Ücretsiz mektuplarınızdan sonra sınırsız mektubun kilidini açmak yılda ${price}.`,
    pillDemo: "Demo hazır",
    headingDemo: "Ücretsiz demonuz hazır",
    demoNote: "Henüz satış yapmıyoruz — Papkram tam olarak yayına girdiğinde size e-posta göndereceğiz.",
    cta: "İlk mektubunuzu yükleyin",
    footer: "Papkram — Almanca postalar için sade özetler, son tarihler ve yanıt taslakları.",
  },
};
