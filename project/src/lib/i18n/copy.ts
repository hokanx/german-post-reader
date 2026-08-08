import type { AppLanguage } from "@/lib/letters/types";

/**
 * Translation dictionary for every authenticated/auth-adjacent page — the
 * marketing landing page has its own equivalent at
 * components/landing/copy.ts (a separate, cookie-driven pre-signup locale
 * that doesn't yet share a type with AppLanguage, despite identical values).
 */
export type AppCopy = {
  header: {
    logo: string;
    backToDashboard: string;
  };
  auth: {
    emailLabel: string;
    passwordLabel: string;
    login: {
      heading: string;
      subhead: string;
      submitting: string;
      submit: string;
      noAccount: string;
      startTrialLink: string;
    };
    signup: {
      heading: (freeLetterLimit: number) => string;
      subhead: string;
      submitting: string;
      submit: string;
      haveAccount: string;
      loginLink: string;
    };
    errors: {
      enterEmailPassword: string;
      enterPassword: string;
      invalidCredentials: string;
      invalidCredentialsRecovery: string;
      checkEmailPassword: string;
      passwordTooShort: string;
      emailInUse: string;
      emailInUseRecovery: string;
      weakPassword: string;
      weakPasswordRecovery: string;
      signupNoUser: string;
      signupNoUserRecovery: string;
      accountSetupFailed: string;
      accountSetupFailedRecovery: string;
    };
  };
  onboarding: {
    heading: string;
    subhead: string;
    choose: string;
    savingToast: string;
    savedToast: string;
    unsupportedLanguage: string;
    saveFailed: string;
    saveFailedRecovery: string;
  };
  dashboard: {
    uploadButton: string;
    yourLetters: string;
    emptyTitle: string;
    emptyDescription: string;
    unlimitedBadge: string;
    lettersUsed: (used: number, limit: number) => string;
    unlockCta: (price: string) => string;
    analysisPending: string;
    manageSubscription: string;
    openingPortal: string;
    portalError: string;
    subscriptionActiveToast: string;
    errorTitle: string;
    errorRecovery: string;
  };
  upload: {
    heading: string;
    subhead: string;
    dropTitle: string;
    dropSubtitle: string;
    takePhoto: string;
    analyzeLetter: string;
    readingTitle: string;
    readingSubtitle: string;
    preparingPhoto: string;
    dismiss: string;
    fileTooLarge: string;
    fileTooLargePdfRecovery: string;
    fileTooLargeImageRecovery: string;
    unsupportedFileType: string;
    uploadFailed: string;
    uploadFailedRecovery: string;
    pleaseLoginAgain: string;
    chooseFileFirst: string;
    accountLoadFailed: string;
    accountLoadFailedRecovery: string;
    trialLimitReached: (limit: number) => string;
    trialLimitReachedRecovery: (price: string) => string;
    letterSaveFailed: string;
    letterSaveFailedRecovery: string;
  };
  letters: {
    analysisComplete: string;
    summary: string;
    deadlines: string;
    worthChecking: string;
    lowConfidenceWarning: string;
    deadlineCount: (n: number) => string;
    riskFlagCount: (n: number) => string;
    yourReplyInGerman: string;
    readyToSend: string;
    redrafting: string;
    replyRedraftedToast: string;
    showTranslation: (language: string) => string;
    hideTranslation: (language: string) => string;
    copyReply: string;
    copied: string;
    copiedToast: string;
    copyFailedToast: string;
    replyToneGroupLabel: string;
    notFoundTitle: string;
    notFoundDescription: string;
    couldntFindLetter: string;
    draftedButNotSaved: string;
    errorTitle: string;
    errorRecovery: string;
  };
  paywall: {
    badge: string;
    heading: (limit: number) => string;
    description: (price: string) => string;
    redirecting: string;
    subscribe: (price: string) => string;
    checkoutError: string;
  };
  languageSwitcher: {
    ariaLabel: string;
    updatedToast: string;
  };
  legal: {
    privacy: {
      title: string;
      sections: { heading: string; body: string }[];
    };
    terms: {
      title: string;
      sections: { heading: string; body: (freeLetterLimit: number, price: string) => string }[];
    };
  };
};

export const APP_COPY: Record<AppLanguage, AppCopy> = {
  en: {
    header: {
      logo: "German Post, translated.",
      backToDashboard: "Back to dashboard",
    },
    auth: {
      emailLabel: "Email",
      passwordLabel: "Password",
      login: {
        heading: "Welcome back",
        subhead: "Log in to see your letter history.",
        submitting: "Logging in…",
        submit: "Log in",
        noAccount: "New here?",
        startTrialLink: "Start your free trial",
      },
      signup: {
        heading: (n) => `${n} letters free, no card needed`,
        subhead: "Create an account to start reading your German post in plain language.",
        submitting: "Creating your account…",
        submit: "Start free trial",
        haveAccount: "Already have an account?",
        loginLink: "Log in",
      },
      errors: {
        enterEmailPassword: "Enter your email and password.",
        enterPassword: "Enter your password",
        invalidCredentials: "That email and password don't match.",
        invalidCredentialsRecovery: "Check for typos, or reset your password.",
        checkEmailPassword: "Check your email and password.",
        passwordTooShort: "Password must be at least 8 characters",
        emailInUse: "An account with this email already exists.",
        emailInUseRecovery: "Try logging in instead.",
        weakPassword: "That password is too weak.",
        weakPasswordRecovery: "Use at least 8 characters with a mix of letters and numbers.",
        signupNoUser: "Signup did not return a user.",
        signupNoUserRecovery: "Try again in a moment.",
        accountSetupFailed: "Your account was created but setup failed.",
        accountSetupFailedRecovery: "Try logging in — if this keeps happening, contact support.",
      },
    },
    onboarding: {
      heading: "What language works for you?",
      subhead:
        "Every summary, deadline, and reply draft will be written in this language. You can switch it any time from your dashboard.",
      choose: "Choose",
      savingToast: "Saving your language…",
      savedToast: "Saved",
      unsupportedLanguage: "Unsupported language.",
      saveFailed: "Couldn't save your language preference.",
      saveFailedRecovery: "Try again.",
    },
    dashboard: {
      uploadButton: "Upload a letter",
      yourLetters: "Your letters",
      emptyTitle: "No letters yet",
      emptyDescription:
        "Upload your first German letter to get a plain-language summary, deadlines, and a ready-to-send reply.",
      unlimitedBadge: "Unlimited letters",
      lettersUsed: (used, limit) => `${used} of ${limit} free letters used`,
      unlockCta: (price) => `Unlock unlimited letters for ${price}/year.`,
      analysisPending: "Analysis pending…",
      manageSubscription: "Manage subscription",
      openingPortal: "Opening…",
      portalError: "Couldn't open the billing portal.",
      subscriptionActiveToast: "Subscription active — unlimited letters unlocked!",
      errorTitle: "Couldn't load your dashboard",
      errorRecovery: "This is usually temporary. Try again in a moment.",
    },
    upload: {
      heading: "Upload a letter",
      subhead:
        "A photo or a PDF both work. We'll read it and come back with a plain-language summary, any deadlines, and a ready-to-send reply.",
      dropTitle: "Drop a photo or PDF here",
      dropSubtitle: "or click to browse",
      takePhoto: "Take a photo",
      analyzeLetter: "Analyze letter",
      readingTitle: "Reading your letter…",
      readingSubtitle: "This usually takes a few seconds.",
      preparingPhoto: "Preparing photo…",
      dismiss: "Dismiss",
      fileTooLarge: "That file is too large.",
      fileTooLargePdfRecovery: "Try a smaller PDF, or a photo of the letter instead.",
      fileTooLargeImageRecovery: "Try a different photo — this one is still too large after compressing.",
      unsupportedFileType: "Only JPEG, PNG, or PDF files are supported.",
      uploadFailed: "Upload failed — try again.",
      uploadFailedRecovery: "Check your connection. If the file is very large, try a smaller photo.",
      pleaseLoginAgain: "Please log in again.",
      chooseFileFirst: "Choose a file to upload first.",
      accountLoadFailed: "Couldn't load your account.",
      accountLoadFailedRecovery: "Try again.",
      trialLimitReached: (limit) => `You've used all ${limit} free letters.`,
      trialLimitReachedRecovery: (price) => `Unlock unlimited letters for ${price}/year.`,
      letterSaveFailed: "Your letter was analyzed but couldn't be saved.",
      letterSaveFailedRecovery: "Try uploading again.",
    },
    letters: {
      analysisComplete: "Analysis complete",
      summary: "Summary",
      deadlines: "Deadlines",
      worthChecking: "Worth double-checking",
      lowConfidenceWarning:
        "We weren't fully confident this letter was read correctly — the photo or scan may have been unclear. Double-check everything below before acting on it.",
      deadlineCount: (n) => `${n} ${n === 1 ? "deadline" : "deadlines"}`,
      riskFlagCount: (n) => `${n} to double-check`,
      yourReplyInGerman: "Your reply, in German",
      readyToSend: "Ready to send as-is — the recipient reads German.",
      redrafting: "Redrafting…",
      replyRedraftedToast: "Reply redrafted",
      showTranslation: (language) => `Show what this says in ${language}`,
      hideTranslation: (language) => `Hide ${language} translation`,
      copyReply: "Copy reply",
      copied: "Copied",
      copiedToast: "Reply copied",
      copyFailedToast: "Couldn't copy — select and copy the text manually.",
      replyToneGroupLabel: "Reply tone",
      notFoundTitle: "We can't find that letter",
      notFoundDescription: "It may have been removed, or the link doesn't belong to your account.",
      couldntFindLetter: "Couldn't find that letter.",
      draftedButNotSaved: "Drafted, but couldn't save the new reply.",
      errorTitle: "Couldn't load this letter",
      errorRecovery: "This is usually temporary. Try again in a moment.",
    },
    paywall: {
      badge: "Free trial ended",
      heading: (limit) => `You've used all ${limit} free letters`,
      description: (price) => `Unlock unlimited letters for ${price}/year — cancel any time from your dashboard.`,
      redirecting: "Redirecting…",
      subscribe: (price) => `Subscribe — ${price}/year`,
      checkoutError: "Couldn't start checkout.",
    },
    languageSwitcher: {
      ariaLabel: "Analysis language",
      updatedToast: "Language updated",
    },
    legal: {
      privacy: {
        title: "Privacy Policy",
        sections: [
          {
            heading: "What we store",
            body: "When you upload a letter, we store the original image or PDF, the analysis we generate from it (summary, deadlines, reply draft, risk flags), and the language you chose. This is stored in a private storage bucket and database rows tied to your account — only you can access your own letters.",
          },
          {
            heading: "How your letter is processed",
            body: "The contents of an uploaded letter are sent to Google's Gemini API to generate the analysis. We do not use your letters to train any model. We never display the raw extracted text back to you or anyone else — only the structured summary, deadlines, and reply draft.",
          },
          {
            heading: "Payments",
            body: "Subscription billing is handled by Stripe. We never see or store your card details — Stripe processes and stores that directly.",
          },
          {
            heading: "Your rights",
            body: "You can request deletion of your account and all associated letters at any time by contacting",
          },
        ],
      },
      terms: {
        title: "Terms of Service",
        sections: [
          {
            heading: "What this service is",
            body: () =>
              "German Post Letter Reader analyzes German-language postal letters and produces a plain-language summary, deadline detection, and a draft reply. It is a reading and drafting aid, not legal, tax, or financial advice.",
          },
          {
            heading: "Accuracy isn't guaranteed",
            body: () =>
              "AI analysis can misread amounts, dates, or context, especially from low-quality photos. When we're not confident, we flag it — but always double-check anything involving money, legal deadlines, or official obligations before acting on it.",
          },
          {
            heading: "Free trial and billing",
            body: (limit, price) =>
              `New accounts get ${limit} free letter analyses, no card required. Beyond that, a subscription of ${price} per year unlocks unlimited analyses. Billed annually via Stripe; cancel any time from your dashboard and you'll keep access until the current billing period ends.`,
          },
          {
            heading: "Account termination",
            body: () =>
              "You can delete your account at any time. We may suspend accounts used to abuse the service (e.g. uploading non-letter content at scale).",
          },
        ],
      },
    },
  },
  ar: {
    header: {
      logo: "بريدك الألماني، مترجمًا.",
      backToDashboard: "العودة إلى لوحة التحكم",
    },
    auth: {
      emailLabel: "البريد الإلكتروني",
      passwordLabel: "كلمة المرور",
      login: {
        heading: "مرحبًا بعودتك",
        subhead: "سجّل الدخول لعرض سجل خطاباتك.",
        submitting: "جارٍ تسجيل الدخول…",
        submit: "تسجيل الدخول",
        noAccount: "جديد هنا؟",
        startTrialLink: "ابدأ تجربتك المجانية",
      },
      signup: {
        heading: (n) => `${n} خطابات مجانية، بدون بطاقة`,
        subhead: "أنشئ حسابًا لتبدأ بقراءة بريدك الألماني بلغة واضحة.",
        submitting: "جارٍ إنشاء حسابك…",
        submit: "ابدأ تجربتك المجانية",
        haveAccount: "لديك حساب بالفعل؟",
        loginLink: "تسجيل الدخول",
      },
      errors: {
        enterEmailPassword: "أدخل بريدك الإلكتروني وكلمة المرور.",
        enterPassword: "أدخل كلمة المرور",
        invalidCredentials: "البريد الإلكتروني وكلمة المرور غير متطابقين.",
        invalidCredentialsRecovery: "تحقق من الأخطاء الإملائية، أو أعد تعيين كلمة المرور.",
        checkEmailPassword: "تحقق من بريدك الإلكتروني وكلمة المرور.",
        passwordTooShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
        emailInUse: "يوجد حساب بهذا البريد الإلكتروني بالفعل.",
        emailInUseRecovery: "جرّب تسجيل الدخول بدلاً من ذلك.",
        weakPassword: "كلمة المرور هذه ضعيفة جدًا.",
        weakPasswordRecovery: "استخدم 8 أحرف على الأقل مع مزيج من الحروف والأرقام.",
        signupNoUser: "لم يُرجع التسجيل بيانات مستخدم.",
        signupNoUserRecovery: "حاول مرة أخرى بعد قليل.",
        accountSetupFailed: "تم إنشاء حسابك، لكن الإعداد فشل.",
        accountSetupFailedRecovery: "جرّب تسجيل الدخول — إذا استمر هذا، تواصل مع الدعم.",
      },
    },
    onboarding: {
      heading: "ما اللغة التي تناسبك؟",
      subhead:
        "سيُكتب كل ملخص وموعد نهائي ومسودة رد بهذه اللغة. يمكنك تغييرها في أي وقت من لوحة التحكم.",
      choose: "اختر",
      savingToast: "جارٍ حفظ لغتك…",
      savedToast: "تم الحفظ",
      unsupportedLanguage: "لغة غير مدعومة.",
      saveFailed: "تعذر حفظ تفضيل اللغة.",
      saveFailedRecovery: "حاول مرة أخرى.",
    },
    dashboard: {
      uploadButton: "ارفع خطابًا",
      yourLetters: "خطاباتك",
      emptyTitle: "لا توجد خطابات بعد",
      emptyDescription: "ارفع أول خطاب ألماني لك للحصول على ملخص بلغة واضحة ومواعيد نهائية ورد جاهز للإرسال.",
      unlimitedBadge: "خطابات غير محدودة",
      lettersUsed: (used, limit) => `${used} من ${limit} خطابات مجانية مستخدمة`,
      unlockCta: (price) => `افتح خطابات غير محدودة مقابل ${price} سنويًا.`,
      analysisPending: "التحليل قيد الانتظار…",
      manageSubscription: "إدارة الاشتراك",
      openingPortal: "جارٍ الفتح…",
      portalError: "تعذر فتح بوابة الفوترة.",
      subscriptionActiveToast: "الاشتراك مفعّل — خطابات غير محدودة متاحة الآن!",
      errorTitle: "تعذر تحميل لوحة التحكم",
      errorRecovery: "هذا عادةً مؤقت. حاول مرة أخرى بعد قليل.",
    },
    upload: {
      heading: "ارفع خطابًا",
      subhead: "تصلح الصورة أو ملف PDF. سنقرأه ونعود إليك بملخص بلغة واضحة، وأي مواعيد نهائية، ورد جاهز للإرسال.",
      dropTitle: "أفلت صورة أو ملف PDF هنا",
      dropSubtitle: "أو اضغط للتصفح",
      takePhoto: "التقط صورة",
      analyzeLetter: "حلّل الخطاب",
      readingTitle: "جارٍ قراءة خطابك…",
      readingSubtitle: "يستغرق هذا عادةً بضع ثوانٍ.",
      preparingPhoto: "جارٍ تجهيز الصورة…",
      dismiss: "إغلاق",
      fileTooLarge: "هذا الملف كبير جدًا.",
      fileTooLargePdfRecovery: "جرّب ملف PDF أصغر، أو التقط صورة للخطاب بدلاً من ذلك.",
      fileTooLargeImageRecovery: "جرّب صورة أخرى — هذه لا تزال كبيرة جدًا حتى بعد الضغط.",
      unsupportedFileType: "يُدعم فقط JPEG أو PNG أو PDF.",
      uploadFailed: "فشل الرفع — حاول مرة أخرى.",
      uploadFailedRecovery: "تحقق من اتصالك. إذا كان الملف كبيرًا جدًا، جرّب صورة أصغر.",
      pleaseLoginAgain: "يرجى تسجيل الدخول مرة أخرى.",
      chooseFileFirst: "اختر ملفًا لرفعه أولاً.",
      accountLoadFailed: "تعذر تحميل حسابك.",
      accountLoadFailedRecovery: "حاول مرة أخرى.",
      trialLimitReached: (limit) => `لقد استخدمت جميع خطاباتك المجانية الـ ${limit}.`,
      trialLimitReachedRecovery: (price) => `افتح خطابات غير محدودة مقابل ${price} سنويًا.`,
      letterSaveFailed: "تم تحليل خطابك لكن تعذر حفظه.",
      letterSaveFailedRecovery: "حاول الرفع مرة أخرى.",
    },
    letters: {
      analysisComplete: "تم التحليل",
      summary: "الملخص",
      deadlines: "المواعيد النهائية",
      worthChecking: "يستحق المراجعة",
      lowConfidenceWarning:
        "لم نكن واثقين تمامًا من قراءة هذا الخطاب بشكل صحيح — قد تكون الصورة أو المسح غير واضحين. راجع كل ما يلي بعناية قبل التصرف بناءً عليه.",
      deadlineCount: (n) => `${n} ${n === 1 ? "موعد نهائي" : "مواعيد نهائية"}`,
      riskFlagCount: (n) => `${n} يستحق المراجعة`,
      yourReplyInGerman: "ردك، بالألمانية",
      readyToSend: "جاهز للإرسال كما هو — المستلم يقرأ الألمانية.",
      redrafting: "جارٍ إعادة الصياغة…",
      replyRedraftedToast: "تمت إعادة صياغة الرد",
      showTranslation: (language) => `أظهر ما يقوله هذا بلغة ${language}`,
      hideTranslation: (language) => `أخفِ الترجمة بلغة ${language}`,
      copyReply: "انسخ الرد",
      copied: "تم النسخ",
      copiedToast: "تم نسخ الرد",
      copyFailedToast: "تعذر النسخ — حدد النص وانسخه يدويًا.",
      replyToneGroupLabel: "نبرة الرد",
      notFoundTitle: "لا يمكننا العثور على هذا الخطاب",
      notFoundDescription: "ربما تمت إزالته، أو أن الرابط لا يخص حسابك.",
      couldntFindLetter: "تعذر العثور على هذا الخطاب.",
      draftedButNotSaved: "تمت الصياغة، لكن تعذر حفظ الرد الجديد.",
      errorTitle: "تعذر تحميل هذا الخطاب",
      errorRecovery: "هذا عادةً مؤقت. حاول مرة أخرى بعد قليل.",
    },
    paywall: {
      badge: "انتهت التجربة المجانية",
      heading: (limit) => `لقد استخدمت جميع خطاباتك المجانية الـ ${limit}`,
      description: (price) => `افتح خطابات غير محدودة مقابل ${price} سنويًا — ألغِ في أي وقت من لوحة التحكم.`,
      redirecting: "جارٍ التوجيه…",
      subscribe: (price) => `اشترك — ${price} سنويًا`,
      checkoutError: "تعذر بدء الدفع.",
    },
    languageSwitcher: {
      ariaLabel: "لغة التحليل",
      updatedToast: "تم تحديث اللغة",
    },
    legal: {
      privacy: {
        title: "سياسة الخصوصية",
        sections: [
          {
            heading: "ما الذي نخزنه",
            body: "عند رفع خطاب، نخزّن الصورة الأصلية أو ملف PDF، والتحليل الذي ننتجه منه (الملخص، المواعيد النهائية، مسودة الرد، علامات الخطر)، واللغة التي اخترتها. يُخزَّن هذا في مساحة تخزين خاصة وسجلات قاعدة بيانات مرتبطة بحسابك — أنت وحدك من يمكنه الوصول إلى خطاباتك.",
          },
          {
            heading: "كيف تتم معالجة خطابك",
            body: "تُرسَل محتويات الخطاب المرفوع إلى واجهة Gemini من Google لإنشاء التحليل. لا نستخدم خطاباتك لتدريب أي نموذج. لا نعرض أبدًا النص المستخرج الخام لك أو لأي شخص آخر — فقط الملخص المنظم والمواعيد النهائية ومسودة الرد.",
          },
          {
            heading: "المدفوعات",
            body: "تُدار فوترة الاشتراك عبر Stripe. لا نرى أو نخزّن أبدًا تفاصيل بطاقتك — تُعالجها Stripe وتخزّنها مباشرةً.",
          },
          {
            heading: "حقوقك",
            body: "يمكنك طلب حذف حسابك وجميع الخطابات المرتبطة به في أي وقت عبر التواصل معنا على",
          },
        ],
      },
      terms: {
        title: "شروط الخدمة",
        sections: [
          {
            heading: "ما هي هذه الخدمة",
            body: () =>
              "يحلل German Post Letter Reader الخطابات البريدية باللغة الألمانية وينتج ملخصًا بلغة واضحة، وكشفًا للمواعيد النهائية، ومسودة رد. إنها أداة مساعدة للقراءة والصياغة، وليست استشارة قانونية أو ضريبية أو مالية.",
          },
          {
            heading: "الدقة غير مضمونة",
            body: () =>
              "قد يخطئ تحليل الذكاء الاصطناعي في قراءة المبالغ أو التواريخ أو السياق، خاصةً من الصور ذات الجودة المنخفضة. عندما لا نكون واثقين، نشير إلى ذلك بوضوح — لكن راجع دائمًا أي شيء يتعلق بالمال أو المواعيد القانونية أو الالتزامات الرسمية قبل التصرف بناءً عليه.",
          },
          {
            heading: "التجربة المجانية والفوترة",
            body: (limit, price) =>
              `تحصل الحسابات الجديدة على ${limit} تحليلات مجانية للخطابات، بدون بطاقة مطلوبة. بعد ذلك، يفتح اشتراك بقيمة ${price} سنويًا تحليلات غير محدودة. تُفوتر سنويًا عبر Stripe؛ ألغِ في أي وقت من لوحة التحكم وستحتفظ بالوصول حتى نهاية فترة الفوترة الحالية.`,
          },
          {
            heading: "إنهاء الحساب",
            body: () =>
              "يمكنك حذف حسابك في أي وقت. قد نعلّق الحسابات التي تُستخدم لإساءة استخدام الخدمة (مثل رفع محتوى ليس خطابات على نطاق واسع).",
          },
        ],
      },
    },
  },
  tr: {
    header: {
      logo: "Alman postanız, çevrildi.",
      backToDashboard: "Panele dön",
    },
    auth: {
      emailLabel: "E-posta",
      passwordLabel: "Şifre",
      login: {
        heading: "Tekrar hoş geldiniz",
        subhead: "Mektup geçmişinizi görmek için giriş yapın.",
        submitting: "Giriş yapılıyor…",
        submit: "Giriş yap",
        noAccount: "Yeni misiniz?",
        startTrialLink: "Ücretsiz denemeyi başlatın",
      },
      signup: {
        heading: (n) => `${n} ücretsiz mektup, kart gerekmez`,
        subhead: "Alman postanızı sade bir dille okumaya başlamak için hesap oluşturun.",
        submitting: "Hesabınız oluşturuluyor…",
        submit: "Ücretsiz denemeyi başlat",
        haveAccount: "Zaten bir hesabınız var mı?",
        loginLink: "Giriş yap",
      },
      errors: {
        enterEmailPassword: "E-posta adresinizi ve şifrenizi girin.",
        enterPassword: "Şifrenizi girin",
        invalidCredentials: "Bu e-posta ve şifre eşleşmiyor.",
        invalidCredentialsRecovery: "Yazım hatalarını kontrol edin veya şifrenizi sıfırlayın.",
        checkEmailPassword: "E-posta adresinizi ve şifrenizi kontrol edin.",
        passwordTooShort: "Şifre en az 8 karakter olmalıdır",
        emailInUse: "Bu e-posta ile zaten bir hesap var.",
        emailInUseRecovery: "Bunun yerine giriş yapmayı deneyin.",
        weakPassword: "Bu şifre çok zayıf.",
        weakPasswordRecovery: "Harf ve rakam karışımıyla en az 8 karakter kullanın.",
        signupNoUser: "Kayıt bir kullanıcı döndürmedi.",
        signupNoUserRecovery: "Biraz sonra tekrar deneyin.",
        accountSetupFailed: "Hesabınız oluşturuldu ama kurulum başarısız oldu.",
        accountSetupFailedRecovery: "Giriş yapmayı deneyin — bu devam ederse destekle iletişime geçin.",
      },
    },
    onboarding: {
      heading: "Sizin için hangi dil uygun?",
      subhead:
        "Her özet, son tarih ve yanıt taslağı bu dilde yazılacak. İstediğiniz zaman panelinizden değiştirebilirsiniz.",
      choose: "Seç",
      savingToast: "Diliniz kaydediliyor…",
      savedToast: "Kaydedildi",
      unsupportedLanguage: "Desteklenmeyen dil.",
      saveFailed: "Dil tercihiniz kaydedilemedi.",
      saveFailedRecovery: "Tekrar deneyin.",
    },
    dashboard: {
      uploadButton: "Mektup yükle",
      yourLetters: "Mektuplarınız",
      emptyTitle: "Henüz mektup yok",
      emptyDescription:
        "Sade bir özet, son tarihler ve gönderime hazır bir yanıt almak için ilk Alman mektubunuzu yükleyin.",
      unlimitedBadge: "Sınırsız mektup",
      lettersUsed: (used, limit) => `${limit} ücretsiz mektuptan ${used} tanesi kullanıldı`,
      unlockCta: (price) => `Yılda ${price} karşılığında sınırsız mektubun kilidini açın.`,
      analysisPending: "Analiz bekleniyor…",
      manageSubscription: "Aboneliği yönet",
      openingPortal: "Açılıyor…",
      portalError: "Faturalandırma portalı açılamadı.",
      subscriptionActiveToast: "Abonelik aktif — sınırsız mektupların kilidi açıldı!",
      errorTitle: "Paneliniz yüklenemedi",
      errorRecovery: "Bu genellikle geçicidir. Biraz sonra tekrar deneyin.",
    },
    upload: {
      heading: "Mektup yükle",
      subhead:
        "Fotoğraf veya PDF, ikisi de olur. Onu okuyup sade bir özet, varsa son tarihler ve gönderime hazır bir yanıtla döneceğiz.",
      dropTitle: "Buraya bir fotoğraf veya PDF bırakın",
      dropSubtitle: "veya göz atmak için tıklayın",
      takePhoto: "Fotoğraf çek",
      analyzeLetter: "Mektubu analiz et",
      readingTitle: "Mektubunuz okunuyor…",
      readingSubtitle: "Bu genellikle birkaç saniye sürer.",
      preparingPhoto: "Fotoğraf hazırlanıyor…",
      dismiss: "Kapat",
      fileTooLarge: "Bu dosya çok büyük.",
      fileTooLargePdfRecovery: "Daha küçük bir PDF veya bunun yerine mektubun bir fotoğrafını deneyin.",
      fileTooLargeImageRecovery: "Farklı bir fotoğraf deneyin — bu, sıkıştırmadan sonra bile hâlâ çok büyük.",
      unsupportedFileType: "Yalnızca JPEG, PNG veya PDF dosyaları desteklenir.",
      uploadFailed: "Yükleme başarısız — tekrar deneyin.",
      uploadFailedRecovery: "Bağlantınızı kontrol edin. Dosya çok büyükse daha küçük bir fotoğraf deneyin.",
      pleaseLoginAgain: "Lütfen tekrar giriş yapın.",
      chooseFileFirst: "Önce yüklenecek bir dosya seçin.",
      accountLoadFailed: "Hesabınız yüklenemedi.",
      accountLoadFailedRecovery: "Tekrar deneyin.",
      trialLimitReached: (limit) => `${limit} ücretsiz mektubunuzun tamamını kullandınız.`,
      trialLimitReachedRecovery: (price) => `Yılda ${price} karşılığında sınırsız mektubun kilidini açın.`,
      letterSaveFailed: "Mektubunuz analiz edildi ama kaydedilemedi.",
      letterSaveFailedRecovery: "Tekrar yüklemeyi deneyin.",
    },
    letters: {
      analysisComplete: "Analiz tamamlandı",
      summary: "Özet",
      deadlines: "Son tarihler",
      worthChecking: "Kontrol etmeye değer",
      lowConfidenceWarning:
        "Bu mektubun doğru okunduğundan tam olarak emin değildik — fotoğraf veya tarama net olmayabilir. Buna göre hareket etmeden önce aşağıdaki her şeyi kontrol edin.",
      deadlineCount: (n) => `${n} son tarih`,
      riskFlagCount: (n) => `${n} kontrol edilmeli`,
      yourReplyInGerman: "Yanıtınız, Almanca",
      readyToSend: "Olduğu gibi gönderime hazır — alıcı Almanca okuyor.",
      redrafting: "Yeniden taslak oluşturuluyor…",
      replyRedraftedToast: "Yanıt yeniden yazıldı",
      showTranslation: (language) => `Bunun ${language} olarak ne söylediğini göster`,
      hideTranslation: (language) => `${language} çevirisini gizle`,
      copyReply: "Yanıtı kopyala",
      copied: "Kopyalandı",
      copiedToast: "Yanıt kopyalandı",
      copyFailedToast: "Kopyalanamadı — metni seçip elle kopyalayın.",
      replyToneGroupLabel: "Yanıt tonu",
      notFoundTitle: "Bu mektubu bulamıyoruz",
      notFoundDescription: "Kaldırılmış olabilir veya bağlantı hesabınıza ait olmayabilir.",
      couldntFindLetter: "Bu mektup bulunamadı.",
      draftedButNotSaved: "Taslak oluşturuldu ama yeni yanıt kaydedilemedi.",
      errorTitle: "Bu mektup yüklenemedi",
      errorRecovery: "Bu genellikle geçicidir. Biraz sonra tekrar deneyin.",
    },
    paywall: {
      badge: "Ücretsiz deneme sona erdi",
      heading: (limit) => `${limit} ücretsiz mektubunuzun tamamını kullandınız`,
      description: (price) => `Yılda ${price} karşılığında sınırsız mektubun kilidini açın — istediğiniz zaman panelinizden iptal edin.`,
      redirecting: "Yönlendiriliyor…",
      subscribe: (price) => `Abone ol — yılda ${price}`,
      checkoutError: "Ödeme başlatılamadı.",
    },
    languageSwitcher: {
      ariaLabel: "Analiz dili",
      updatedToast: "Dil güncellendi",
    },
    legal: {
      privacy: {
        title: "Gizlilik Politikası",
        sections: [
          {
            heading: "Ne saklıyoruz",
            body: "Bir mektup yüklediğinizde, orijinal görüntüyü veya PDF'i, ondan oluşturduğumuz analizi (özet, son tarihler, yanıt taslağı, risk işaretleri) ve seçtiğiniz dili saklarız. Bu, hesabınıza bağlı özel bir depolama alanında ve veritabanı satırlarında saklanır — mektuplarınıza yalnızca siz erişebilirsiniz.",
          },
          {
            heading: "Mektubunuz nasıl işlenir",
            body: "Yüklenen bir mektubun içeriği, analizi oluşturmak için Google'ın Gemini API'sine gönderilir. Mektuplarınızı herhangi bir modeli eğitmek için kullanmayız. Ham çıkarılan metni asla size veya başka birine göstermeyiz — yalnızca yapılandırılmış özeti, son tarihleri ve yanıt taslağını gösteririz.",
          },
          {
            heading: "Ödemeler",
            body: "Abonelik faturalandırması Stripe tarafından yönetilir. Kart bilgilerinizi asla görmez veya saklamayız — Stripe bunu doğrudan işler ve saklar.",
          },
          {
            heading: "Haklarınız",
            body: "İstediğiniz zaman hesabınızın ve ilişkili tüm mektupların silinmesini talep etmek için bize ulaşın:",
          },
        ],
      },
      terms: {
        title: "Kullanım Şartları",
        sections: [
          {
            heading: "Bu hizmet nedir",
            body: () =>
              "German Post Letter Reader, Almanca posta mektuplarını analiz eder ve sade bir özet, son tarih tespiti ve bir yanıt taslağı üretir. Bu bir okuma ve taslak oluşturma yardımcısıdır, hukuki, mali veya vergi danışmanlığı değildir.",
          },
          {
            heading: "Doğruluk garanti edilmez",
            body: () =>
              "Yapay zeka analizi, özellikle düşük kaliteli fotoğraflardan, tutarları, tarihleri veya bağlamı yanlış okuyabilir. Emin olmadığımızda bunu işaretleriz — ancak para, yasal son tarihler veya resmi yükümlülüklerle ilgili her şeyi harekete geçmeden önce her zaman kontrol edin.",
          },
          {
            heading: "Ücretsiz deneme ve faturalandırma",
            body: (limit, price) =>
              `Yeni hesaplar, kart gerekmeden ${limit} ücretsiz mektup analizi alır. Bunun ötesinde, yılda ${price} tutarındaki bir abonelik sınırsız analizin kilidini açar. Stripe üzerinden yıllık faturalandırılır; panelinizden istediğiniz zaman iptal edebilirsiniz ve mevcut faturalandırma dönemi sona erene kadar erişiminizi korursunuz.`,
          },
          {
            heading: "Hesap sonlandırma",
            body: () =>
              "Hesabınızı istediğiniz zaman silebilirsiniz. Hizmeti kötüye kullanmak için kullanılan hesapları askıya alabiliriz (örneğin, büyük ölçekte mektup olmayan içerik yükleme).",
          },
        ],
      },
    },
  },
};
