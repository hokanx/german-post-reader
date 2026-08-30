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
  de: {
    dir: "ltr",
    subject: (limit) => `Willkommen — Ihre ersten ${limit} Briefe sind kostenlos`,
    preview: (limit) => `Ihre ersten ${limit} Briefe sind kostenlos — keine Karte nötig`,
    pill: "Konto bereit",
    heading: "Ihr Konto ist bereit",
    intro: (limit) =>
      `Sie haben ${limit} kostenlose Brief-Analysen zum Start, keine Karte nötig.`,
    features: [
      { label: "Zusammenfassung", text: "Eine Zusammenfassung in klarer Sprache, was der Brief tatsächlich sagt." },
      { label: "Fristen", text: "Alle Daten oder Fristen klar markiert, damit Ihnen nichts entgeht." },
      { label: "Antwortentwurf", text: "Eine versandfertige Antwort auf Deutsch, mit Übersetzung, damit Sie genau wissen, was darinsteht." },
    ],
    riskNote:
      "Wenn ein Brief einen Betrag oder ein Datum nennt, bei dem wir uns nicht ganz sicher sind, sagen wir das klar, statt zu raten.",
    priceNote: (price) => `Nach Ihren kostenlosen Briefen kostet das Freischalten unbegrenzter Briefe ${price} pro Jahr.`,
    pillDemo: "Demo bereit",
    headingDemo: "Ihre kostenlose Demo ist bereit",
    demoNote: "Wir verkaufen noch nicht — sobald Papkram vollständig startet, schreiben wir Ihnen.",
    cta: "Laden Sie Ihren ersten Brief hoch",
    footer: "Papkram — Zusammenfassungen in klarer Sprache, Fristen und Antwortentwürfe für deutsche Post.",
  },
  uk: {
    dir: "ltr",
    subject: (limit) => `Ласкаво просимо — ваші перші ${limit} листи безкоштовні`,
    preview: (limit) => `Ваші перші ${limit} листи безкоштовні — картка не потрібна`,
    pill: "Акаунт готовий",
    heading: "Ваш акаунт готовий",
    intro: (limit) =>
      `У вас є ${limit} безкоштовних аналізів листів для початку, картка не потрібна.`,
    features: [
      { label: "Підсумок", text: "Підсумок зрозумілою мовою того, що насправді написано в листі." },
      { label: "Терміни", text: "Усі дати чи терміни чітко позначені, щоб ніщо не пройшло повз вас." },
      { label: "Чернетка відповіді", text: "Готова до надсилання відповідь німецькою, з перекладом, щоб ви точно знали, що в ній написано." },
    ],
    riskNote:
      "Якщо в листі згадано суму чи дату, у якій ми не повністю впевнені, ми чітко про це скажемо, а не вгадуватимемо.",
    priceNote: (price) => `Після безкоштовних листів відкриття необмеженої кількості листів коштує ${price} на рік.`,
    pillDemo: "Демоверсія готова",
    headingDemo: "Ваша безкоштовна демоверсія готова",
    demoNote: "Ми поки що нічого не продаємо — щойно Papkram запуститься повністю, ми напишемо вам на пошту.",
    cta: "Завантажте свій перший лист",
    footer: "Papkram — підсумки зрозумілою мовою, терміни та чернетки відповідей для німецької пошти.",
  },
};
