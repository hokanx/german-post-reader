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
  nav: {
    navLabel: string;
    history: string;
    upload: string;
    deadlines: string;
    settings: string;
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
      newsletterOptInLabel: string;
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
  /** Accessible label for each sender-category icon on a dashboard letter card — e.g. "Authority" / "Bank". Not visible text by default, just the icon's aria-label/title. */
  senderCategories: {
    authority: string;
    insurer: string;
    bank: string;
    landlord: string;
    utility: string;
    school: string;
    delivery: string;
    other: string;
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
    nextUpHeading: string;
    actionRequiredBadge: string;
    noActionBadge: string;
    filtersTrigger: string;
    filterAll: string;
    filterActionNeeded: string;
    filterNoAction: string;
    filterByCategory: string;
    filterEmptyTitle: string;
    filterEmptyDescription: string;
    clearFilters: string;
    sortBy: string;
    sortNewest: string;
    sortOldest: string;
    sortDeadline: string;
  };
  upload: {
    heading: string;
    subhead: string;
    dropTitle: string;
    dropSubtitle: string;
    analyzeLetter: string;
    readingTitle: string;
    readingSubtitle: string;
    /** Cycled every few seconds while the upload is pending, so a ~10-20s wait feels like forward motion instead of one static message. First entry mirrors readingTitle/readingSubtitle. */
    readingStages: { title: string; subtitle: string }[];
    preparingPhoto: string;
    dismiss: string;
    fileTooLarge: string;
    fileTooLargePdfRecovery: string;
    fileTooLargeImageRecovery: string;
    unsupportedFileType: string;
    uploadFailed: string;
    uploadFailedRecovery: string;
    analysisFailed: string;
    analysisFailedRecovery: string;
    pleaseLoginAgain: string;
    chooseFileFirst: string;
    accountLoadFailed: string;
    accountLoadFailedRecovery: string;
    trialLimitReached: (limit: number) => string;
    trialLimitReachedRecovery: (price: string) => string;
    dailyLimitReached: string;
    dailyLimitReachedRecovery: string;
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
    moreOptions: string;
    viewOriginalLetter: string;
    shareSummary: string;
    openOriginalFailedToast: string;
    summaryCopiedToast: string;
    summaryWatermark: string;
    /** Opening line of the exported/shared summary, written as a natural sentence explaining who the letter is from and when it was dated — not a bare data dump. */
    letterExplainerWithDate: (sender: string, date: string) => string;
    letterExplainerWithoutDate: (sender: string) => string;
    replyToneGroupLabel: string;
    notFoundTitle: string;
    notFoundDescription: string;
    couldntFindLetter: string;
    draftedButNotSaved: string;
    errorTitle: string;
    errorRecovery: string;
    keyFactsHeading: string;
    paymentsHeading: string;
    appointmentsHeading: string;
    actionRequiredBadge: string;
    noActionBadge: string;
    actionRequiredDescription: string;
    noActionDescription: string;
    translatingBanner: (language: string) => string;
    translationFailedToast: string;
    translationFailedRecovery: string;
    wizard: {
      stepIntentHeading: string;
      stepFollowUpHeading: string;
      requestTimeQuestion: string;
      requestTimeOptionPlusOneMonth: string;
      requestTimeOptionPlusTwoMonths: string;
      requestTimeOptionInstalments: string;
      requestTimeCustomDateLabel: string;
      objectQuestion: string;
      objectPlaceholder: string;
      clarifyQuestion: string;
      clarifyPlaceholder: string;
      continueButton: string;
      backButton: string;
      editAnswerButton: string;
      sendByEmailButton: string;
      mailtoSubject: string;
      answerByDate: (date: string) => string;
      answerInstalments: string;
      answerRequired: string;
      answerNotUnderstood: string;
      generatingReply: string;
    };
  };
  paywall: {
    badge: string;
    heading: (limit: number) => string;
    description: (price: string, interval: "year" | "month") => string;
    planToggle: { yearly: string; monthly: string };
    redirecting: string;
    subscribe: (price: string, interval: "year" | "month") => string;
    checkoutError: string;
    earlyAccessConsent: string;
    earlyAccessConsentRequired: string;
  };
  demoLimit: {
    badge: string;
    heading: (limit: number) => string;
    body: string;
    backToDashboard: string;
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
  deadlines: {
    heading: string;
    emptyTitle: string;
    emptyDescription: string;
    uploadCta: string;
    undatedLabel: string;
    prevMonth: string;
    nextMonth: string;
    todayLabel: string;
    /** Singular/plural word for "deadline(s)", combined client-side as `${n} ${word}` for a day cell's aria-label — a template *function* can't cross the Server -> Client Component prop boundary (only serializable data can), unlike `letters.deadlineCount` which is only ever called server-side. */
    deadlineWordSingular: string;
    deadlineWordPlural: string;
  };
  settings: {
    heading: string;
    languageHeading: string;
    languageDescription: string;
    subscriptionHeading: string;
    subscriptionActive: string;
    subscriptionFree: string;
    accountHeading: string;
    senderInfoHeading: string;
    senderInfoDescription: string;
    fullNameLabel: string;
    postalAddressLabel: string;
    saveButton: string;
    saving: string;
    senderInfoSavedToast: string;
    senderInfoSaveFailed: string;
    senderInfoSaveFailedRecovery: string;
    deleteAccountButton: string;
    deleteAccountTitle: string;
    deleteAccountWarning: string;
    deleteAccountConfirmLabel: string;
    deleteAccountConfirmCta: string;
    deleteAccountDeleting: string;
    deleteAccountSuccessToast: string;
    deleteAccountFailed: string;
    deleteAccountFailedRecovery: string;
    deleteAccountUnauthenticated: string;
  };
  cookieConsent: {
    ariaLabel: string;
    message: string;
    accept: string;
    decline: string;
  };
  welcome: {
    heading: string;
    body: string;
    shareHeading: string;
    shareTwitter: string;
    shareWhatsapp: string;
    shareCopyLink: string;
    linkCopiedToast: string;
    shareTweetText: string;
    shareWhatsappText: string;
    continueButton: string;
  };
};

export const APP_COPY: Record<AppLanguage, AppCopy> = {
  en: {
    header: {
      logo: "Papkram",
      backToDashboard: "Back to dashboard",
    },
    nav: {
      navLabel: "Main navigation",
      history: "History",
      upload: "Upload",
      deadlines: "Deadlines",
      settings: "Settings",
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
        newsletterOptInLabel: "Notify me when Papkram fully launches.",
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
    senderCategories: {
      authority: "Authority",
      insurer: "Insurer",
      bank: "Bank",
      landlord: "Landlord",
      utility: "Utility",
      school: "School",
      delivery: "Delivery",
      other: "Other",
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
      nextUpHeading: "Next up",
      actionRequiredBadge: "Action needed",
      noActionBadge: "No action needed",
      filtersTrigger: "Filters",
      filterAll: "All",
      filterActionNeeded: "Action needed",
      filterNoAction: "No action needed",
      filterByCategory: "Category",
      filterEmptyTitle: "No letters match these filters",
      filterEmptyDescription: "Try a different combination, or clear all filters to see every letter again.",
      clearFilters: "Clear filters",
      sortBy: "Sort by",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      sortDeadline: "Soonest deadline",
    },
    upload: {
      heading: "Upload a letter",
      subhead:
        "A photo or a PDF both work. We'll read it and come back with a plain-language summary, any deadlines, and a ready-to-send reply.",
      dropTitle: "Drop a photo or PDF here",
      dropSubtitle: "or click to browse",
      analyzeLetter: "Analyze letter",
      readingTitle: "Reading your letter…",
      readingSubtitle: "This usually takes a few seconds.",
      readingStages: [
        { title: "Reading your letter…", subtitle: "This usually takes a few seconds." },
        { title: "Pulling out the details…", subtitle: "Deadlines, amounts, and who it's from." },
        { title: "Drafting your reply…", subtitle: "Almost there." },
      ],
      preparingPhoto: "Preparing photo…",
      dismiss: "Dismiss",
      fileTooLarge: "That file is too large.",
      fileTooLargePdfRecovery: "Try a smaller PDF, or a photo of the letter instead.",
      fileTooLargeImageRecovery: "Try a different photo — this one is still too large after compressing.",
      unsupportedFileType: "Only JPEG, PNG, or PDF files are supported.",
      uploadFailed: "Upload failed — try again.",
      uploadFailedRecovery: "Check your connection. If the file is very large, try a smaller photo.",
      analysisFailed: "Analysis failed — try again.",
      analysisFailedRecovery: "Check your connection and try uploading again.",
      pleaseLoginAgain: "Please log in again.",
      chooseFileFirst: "Choose a file to upload first.",
      accountLoadFailed: "Couldn't load your account.",
      accountLoadFailedRecovery: "Try again.",
      trialLimitReached: (limit) => `You've used all ${limit} free letters.`,
      trialLimitReachedRecovery: (price) => `Unlock unlimited letters for ${price}/year.`,
      dailyLimitReached: "You've reached today's letter limit.",
      dailyLimitReachedRecovery: "Try again tomorrow, or contact us if you need more.",
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
      moreOptions: "More options",
      viewOriginalLetter: "View uploaded letter",
      shareSummary: "Share summary",
      openOriginalFailedToast: "Couldn't open the letter — try again.",
      summaryCopiedToast: "Summary copied",
      summaryWatermark: "— Summarized by Papkram · papkram.de",
      letterExplainerWithDate: (sender, date) => `This letter is from ${sender}, dated ${date}.`,
      letterExplainerWithoutDate: (sender) => `This letter is from ${sender}.`,
      replyToneGroupLabel: "Reply tone",
      notFoundTitle: "We can't find that letter",
      notFoundDescription: "It may have been removed, or the link doesn't belong to your account.",
      couldntFindLetter: "Couldn't find that letter.",
      draftedButNotSaved: "Drafted, but couldn't save the new reply.",
      errorTitle: "Couldn't load this letter",
      errorRecovery: "This is usually temporary. Try again in a moment.",
      keyFactsHeading: "Where this comes from",
      paymentsHeading: "Payment",
      appointmentsHeading: "Appointment",
      actionRequiredBadge: "Action needed",
      noActionBadge: "No action needed",
      actionRequiredDescription: "This letter needs a response from you.",
      noActionDescription: "Nothing to do here — for your records.",
      translatingBanner: (language) => `Translating this letter to ${language}…`,
      translationFailedToast: "Couldn't translate this letter.",
      translationFailedRecovery: "It's still here in its original language — try again.",
      wizard: {
        stepIntentHeading: "What do you want to say?",
        stepFollowUpHeading: "A couple more details",
        requestTimeQuestion: "When can you do this by?",
        requestTimeOptionPlusOneMonth: "In 1 month",
        requestTimeOptionPlusTwoMonths: "In 2 months",
        requestTimeOptionInstalments: "In instalments",
        requestTimeCustomDateLabel: "Choose another date",
        objectQuestion: "What's incorrect?",
        objectPlaceholder: "Tell us what's wrong, in your own words.",
        clarifyQuestion: "What do you want to ask?",
        clarifyPlaceholder: "Type your question.",
        continueButton: "Continue",
        backButton: "Back",
        editAnswerButton: "Edit answer",
        sendByEmailButton: "Send by email",
        mailtoSubject: "My reply",
        answerByDate: (date) => `I can do this by ${date}.`,
        answerInstalments: "I'd like to arrange to pay in instalments.",
        answerRequired: "Add an answer to continue.",
        answerNotUnderstood: "We couldn't quite make sense of that — try rephrasing.",
        generatingReply: "Drafting your reply…",
      },
    },
    paywall: {
      badge: "Free trial ended",
      heading: (limit) => `You've used all ${limit} free letters`,
      description: (price, interval) =>
        `Unlock unlimited letters for ${price}/${interval} — cancel any time from your dashboard.`,
      planToggle: { yearly: "Yearly — best value", monthly: "Monthly" },
      redirecting: "Redirecting…",
      subscribe: (price, interval) => `Subscribe — ${price}/${interval}`,
      checkoutError: "Couldn't start checkout.",
      earlyAccessConsent:
        "I want unlimited access to start right away. I understand I can still withdraw within 14 days, but I'll owe a proportionate amount for the access I've already used by then.",
      earlyAccessConsentRequired: "Confirm this to continue.",
    },
    demoLimit: {
      badge: "Demo complete",
      heading: (limit) => `You've used all ${limit} demo letters.`,
      body: "That's the full experience — upload, plain-language summary, deadlines, ready-to-send reply. We'll email you at launch.",
      backToDashboard: "Back to dashboard",
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
            body: "The contents of an uploaded letter are sent to Google's Gemini API to generate the analysis. Google participates in the EU-US Data Privacy Framework, which is the legal basis for this transfer. We do not use your letters to train any model. We never display the raw extracted text back to you or anyone else — only the structured summary, deadlines, and reply draft.",
          },
          {
            heading: "Who else handles your data",
            body: "A few specialized providers process data on our behalf, each for one specific purpose: Supabase (database and file storage), Resend (sending emails), PostHog (product analytics, only if you accepted the cookie banner), Sentry (error tracking), and Vercel (hosting). None of them can use your data for anything beyond providing their service to us.",
          },
          {
            heading: "Payments",
            body: "Subscription billing is handled by Stripe. We never see or store your card details — Stripe processes and stores that directly.",
          },
          {
            heading: "How long we keep your data",
            body: "We keep your account and letters until you delete your account (instantly, from Settings) or ask us to delete it by email. There's currently no automatic deletion after a period of inactivity.",
          },
          {
            heading: "Your rights",
            body: "You can delete your account and all associated letters any time from Settings — this is immediate and cannot be undone. If you'd rather not do it yourself, or have any other question about your data, email us at",
          },
        ],
      },
      terms: {
        title: "Terms of Service",
        sections: [
          {
            heading: "What this service is",
            body: () =>
              "Papkram analyzes German-language postal letters and produces a plain-language summary, deadline detection, and a draft reply. It is a reading and drafting aid, not legal, tax, or financial advice.",
          },
          {
            heading: "Accuracy isn't guaranteed",
            body: () =>
              "AI analysis can misread amounts, dates, or context, especially from low-quality photos. When we're not confident, we flag it — but always double-check anything involving money, legal deadlines, or official obligations before acting on it.",
          },
          {
            heading: "Free trial and billing",
            body: (limit, price) =>
              `New accounts get ${limit} free letter analyses, no card required. Beyond that, a subscription of ${price} per year unlocks unlimited analyses. Billed annually via Stripe; cancel any time from your dashboard and you'll keep access until the current billing period ends. [VAT: whether this price includes VAT depends on our tax registration status, to be confirmed before launch.]`,
          },
          {
            heading: "Right of withdrawal (Widerrufsrecht)",
            body: () =>
              "If you're subscribing as a consumer, you can withdraw from your subscription within 14 days of subscribing, without giving a reason. Email hello@papkram.de with a clear, dated statement that you wish to withdraw — no form is required, though a model form is below. Unlimited access starts immediately when you subscribe, at your request; if you withdraw before the 14 days are up, you'll owe a proportionate amount for the days of access you already used, and we'll refund the rest.",
          },
          {
            heading: "Model withdrawal form (Muster-Widerrufsformular)",
            body: () =>
              "To: [Operator legal name], [Operator address], hello@papkram.de\nI/We hereby give notice that I/we withdraw from my/our contract for the Papkram subscription.\nOrdered on: __________\nName of consumer(s): __________\nAddress of consumer(s): __________\nDate: __________",
          },
          {
            heading: "Account termination",
            body: () =>
              "You can request account deletion at any time by emailing hello@papkram.de, or delete it yourself any time from Settings. We may suspend accounts used to abuse the service (e.g. uploading non-letter content at scale).",
          },
          {
            heading: "Liability",
            body: () =>
              'We\'re not liable for losses from relying on the AI-generated summary or reply draft without independently checking anything involving money, deadlines, or legal obligations — see "Accuracy isn\'t guaranteed" above. Beyond that, our liability is limited to the subscription fee you paid in the 12 months before the claim, except where the law doesn\'t allow that limit — for intent, gross negligence, or injury to life, body, or health, for example.',
          },
          {
            heading: "Governing law",
            body: () =>
              "These terms are governed by the law of the Federal Republic of Germany. If you're a consumer, this doesn't take away any protection given to you by the mandatory law of the country where you normally live. [Operator legal name]'s place of business is the place of jurisdiction for disputes with business customers.",
          },
        ],
      },
    },
    deadlines: {
      heading: "Deadlines",
      emptyTitle: "No deadlines yet",
      emptyDescription: "Upload a letter and any deadlines it mentions will show up here, soonest first.",
      uploadCta: "Upload a letter",
      undatedLabel: "No fixed date",
      prevMonth: "Previous month",
      nextMonth: "Next month",
      todayLabel: "Today",
      deadlineWordSingular: "deadline",
      deadlineWordPlural: "deadlines",
    },
    settings: {
      heading: "Settings",
      languageHeading: "Language",
      languageDescription: "Every summary, deadline, and reply draft is written in this language.",
      subscriptionHeading: "Subscription",
      subscriptionActive: "You have unlimited letters.",
      subscriptionFree: "You're on the free trial.",
      accountHeading: "Account",
      senderInfoHeading: "Your details",
      senderInfoDescription: "Add your name and postal address once, and every reply draft will use them as the letterhead — instead of a placeholder you'd have to fill in yourself before sending.",
      fullNameLabel: "Full name",
      postalAddressLabel: "Postal address",
      saveButton: "Save",
      saving: "Saving…",
      senderInfoSavedToast: "Saved",
      senderInfoSaveFailed: "Couldn't save your details.",
      senderInfoSaveFailedRecovery: "Try again.",
      deleteAccountButton: "Delete account",
      deleteAccountTitle: "Delete your account?",
      deleteAccountWarning:
        "This permanently deletes all your letters, reply drafts, and uploaded files, and cancels any active subscription immediately. This cannot be undone.",
      deleteAccountConfirmLabel: "Type DELETE to confirm",
      deleteAccountConfirmCta: "Delete my account",
      deleteAccountDeleting: "Deleting…",
      deleteAccountSuccessToast: "Your account and all associated data have been deleted.",
      deleteAccountFailed: "Couldn't delete your account.",
      deleteAccountFailedRecovery: "Try again in a moment, or email hello@papkram.de.",
      deleteAccountUnauthenticated: "You need to be logged in to delete your account.",
    },
    cookieConsent: {
      ariaLabel: "Cookie consent",
      message: "We use analytics cookies to understand how Papkram is used. We never use your uploaded letters for this.",
      accept: "Accept",
      decline: "Decline",
    },
    welcome: {
      heading: "You're in.",
      body: "We'll email you the moment Papkram fully launches.",
      shareHeading: "Know someone who gets confusing German mail?",
      shareTwitter: "Share on X",
      shareWhatsapp: "Share on WhatsApp",
      shareCopyLink: "Copy link",
      linkCopiedToast: "Link copied.",
      shareTweetText: "Papkram translates confusing German mail into plain language, with deadlines and a ready-to-send reply.",
      shareWhatsappText: "I've been using Papkram to make sense of confusing German mail — worth a look:",
      continueButton: "Continue to dashboard",
    },
  },
  ar: {
    header: {
      logo: "Papkram",
      backToDashboard: "العودة إلى لوحة التحكم",
    },
    nav: {
      navLabel: "التنقل الرئيسي",
      history: "السجل",
      upload: "رفع",
      deadlines: "المواعيد النهائية",
      settings: "الإعدادات",
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
        newsletterOptInLabel: "أخبرني عندما يُطلق Papkram رسميًا.",
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
    senderCategories: {
      authority: "جهة حكومية",
      insurer: "شركة تأمين",
      bank: "بنك",
      landlord: "مالك العقار",
      utility: "مرافق",
      school: "مدرسة",
      delivery: "توصيل",
      other: "أخرى",
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
      nextUpHeading: "التالي",
      actionRequiredBadge: "يتطلب إجراء",
      noActionBadge: "لا يتطلب إجراء",
      filtersTrigger: "الفلاتر",
      filterAll: "الكل",
      filterActionNeeded: "يتطلب إجراء",
      filterNoAction: "لا يتطلب إجراء",
      filterByCategory: "الفئة",
      filterEmptyTitle: "لا توجد خطابات مطابقة لهذه الفلاتر",
      filterEmptyDescription: "جرّب مجموعة مختلفة، أو امسح كل الفلاتر لرؤية جميع الخطابات مجددًا.",
      clearFilters: "مسح الفلاتر",
      sortBy: "الترتيب حسب",
      sortNewest: "الأحدث أولاً",
      sortOldest: "الأقدم أولاً",
      sortDeadline: "أقرب موعد نهائي",
    },
    upload: {
      heading: "ارفع خطابًا",
      subhead: "تصلح الصورة أو ملف PDF. سنقرأه ونعود إليك بملخص بلغة واضحة، وأي مواعيد نهائية، ورد جاهز للإرسال.",
      dropTitle: "أفلت صورة أو ملف PDF هنا",
      dropSubtitle: "أو اضغط للتصفح",
      analyzeLetter: "حلّل الخطاب",
      readingTitle: "جارٍ قراءة خطابك…",
      readingSubtitle: "يستغرق هذا عادةً بضع ثوانٍ.",
      readingStages: [
        { title: "جارٍ قراءة خطابك…", subtitle: "يستغرق هذا عادةً بضع ثوانٍ." },
        { title: "جارٍ استخراج التفاصيل…", subtitle: "المواعيد النهائية والمبالغ والجهة المرسلة." },
        { title: "جارٍ صياغة ردك…", subtitle: "أوشكنا على الانتهاء." },
      ],
      preparingPhoto: "جارٍ تجهيز الصورة…",
      dismiss: "إغلاق",
      fileTooLarge: "هذا الملف كبير جدًا.",
      fileTooLargePdfRecovery: "جرّب ملف PDF أصغر، أو التقط صورة للخطاب بدلاً من ذلك.",
      fileTooLargeImageRecovery: "جرّب صورة أخرى — هذه لا تزال كبيرة جدًا حتى بعد الضغط.",
      unsupportedFileType: "يُدعم فقط JPEG أو PNG أو PDF.",
      uploadFailed: "فشل الرفع — حاول مرة أخرى.",
      uploadFailedRecovery: "تحقق من اتصالك. إذا كان الملف كبيرًا جدًا، جرّب صورة أصغر.",
      analysisFailed: "فشل التحليل — حاول مرة أخرى.",
      analysisFailedRecovery: "تحقق من اتصالك وحاول الرفع مرة أخرى.",
      pleaseLoginAgain: "يرجى تسجيل الدخول مرة أخرى.",
      chooseFileFirst: "اختر ملفًا لرفعه أولاً.",
      accountLoadFailed: "تعذر تحميل حسابك.",
      accountLoadFailedRecovery: "حاول مرة أخرى.",
      trialLimitReached: (limit) => `لقد استخدمت جميع خطاباتك المجانية الـ ${limit}.`,
      trialLimitReachedRecovery: (price) => `افتح خطابات غير محدودة مقابل ${price} سنويًا.`,
      dailyLimitReached: "لقد وصلت إلى الحد الأقصى من الخطابات لهذا اليوم.",
      dailyLimitReachedRecovery: "حاول مرة أخرى غدًا، أو تواصل معنا إذا احتجت إلى المزيد.",
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
      moreOptions: "خيارات إضافية",
      viewOriginalLetter: "عرض الخطاب المرفوع",
      shareSummary: "مشاركة الملخص",
      openOriginalFailedToast: "تعذر فتح الخطاب — حاول مرة أخرى.",
      summaryCopiedToast: "تم نسخ الملخص",
      summaryWatermark: "— تم التلخيص بواسطة Papkram · papkram.de",
      letterExplainerWithDate: (sender, date) => `هذا خطاب من ${sender}، بتاريخ ${date}.`,
      letterExplainerWithoutDate: (sender) => `هذا خطاب من ${sender}.`,
      replyToneGroupLabel: "نبرة الرد",
      notFoundTitle: "لا يمكننا العثور على هذا الخطاب",
      notFoundDescription: "ربما تمت إزالته، أو أن الرابط لا يخص حسابك.",
      couldntFindLetter: "تعذر العثور على هذا الخطاب.",
      draftedButNotSaved: "تمت الصياغة، لكن تعذر حفظ الرد الجديد.",
      errorTitle: "تعذر تحميل هذا الخطاب",
      errorRecovery: "هذا عادةً مؤقت. حاول مرة أخرى بعد قليل.",
      keyFactsHeading: "من أين جاءت هذه المعلومات",
      paymentsHeading: "الدفع",
      appointmentsHeading: "الموعد",
      actionRequiredBadge: "يتطلب إجراء",
      noActionBadge: "لا يتطلب إجراء",
      actionRequiredDescription: "يتطلب هذا الخطاب ردًا منك.",
      noActionDescription: "لا شيء للقيام به هنا — للاحتفاظ بسجلك فقط.",
      translatingBanner: (language) => `جارٍ ترجمة هذا الخطاب إلى ${language}…`,
      translationFailedToast: "تعذرت ترجمة هذا الخطاب.",
      translationFailedRecovery: "لا يزال متاحًا بلغته الأصلية — حاول مرة أخرى.",
      wizard: {
        stepIntentHeading: "ماذا تريد أن تقول؟",
        stepFollowUpHeading: "بضعة تفاصيل إضافية",
        requestTimeQuestion: "متى يمكنك القيام بذلك؟",
        requestTimeOptionPlusOneMonth: "خلال شهر واحد",
        requestTimeOptionPlusTwoMonths: "خلال شهرين",
        requestTimeOptionInstalments: "على أقساط",
        requestTimeCustomDateLabel: "اختر تاريخًا آخر",
        objectQuestion: "ما الخطأ في ذلك؟",
        objectPlaceholder: "اشرح ما هو غير صحيح بكلماتك الخاصة.",
        clarifyQuestion: "ما الذي تريد سؤاله؟",
        clarifyPlaceholder: "اكتب سؤالك.",
        continueButton: "متابعة",
        backButton: "رجوع",
        editAnswerButton: "تعديل الإجابة",
        sendByEmailButton: "إرسال بالبريد الإلكتروني",
        mailtoSubject: "ردي",
        answerByDate: (date) => `يمكنني القيام بذلك بحلول ${date}.`,
        answerInstalments: "أرغب في السداد على أقساط.",
        answerRequired: "أضف إجابة للمتابعة.",
        answerNotUnderstood: "لم نتمكن من فهم ذلك تمامًا — حاول إعادة الصياغة.",
        generatingReply: "جارٍ صياغة ردك…",
      },
    },
    paywall: {
      badge: "انتهت التجربة المجانية",
      heading: (limit) => `لقد استخدمت جميع خطاباتك المجانية الـ ${limit}`,
      description: (price, interval) =>
        `افتح خطابات غير محدودة مقابل ${price} ${interval === "year" ? "سنويًا" : "شهريًا"} — ألغِ في أي وقت من لوحة التحكم.`,
      planToggle: { yearly: "سنويًا — أفضل قيمة", monthly: "شهريًا" },
      redirecting: "جارٍ التوجيه…",
      subscribe: (price, interval) => `اشترك — ${price} ${interval === "year" ? "سنويًا" : "شهريًا"}`,
      checkoutError: "تعذر بدء الدفع.",
      earlyAccessConsent:
        "أريد أن يبدأ الوصول غير المحدود فورًا. أفهم أنه لا يزال بإمكاني الانسحاب خلال 14 يومًا، لكنني سأكون مدينًا بمبلغ متناسب مقابل الوصول الذي استخدمته حتى ذلك الحين.",
      earlyAccessConsentRequired: "أكّد هذا للمتابعة.",
    },
    demoLimit: {
      badge: "اكتملت التجربة",
      heading: (limit) => `لقد استخدمت جميع الـ ${limit} خطابات التجريبية.`,
      body: "هذه هي التجربة الكاملة — الرفع، والملخص بلغة واضحة، والمواعيد النهائية، ورد جاهز للإرسال. سنراسلك بالبريد الإلكتروني عند الإطلاق.",
      backToDashboard: "العودة إلى لوحة التحكم",
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
            body: "تُرسَل محتويات الخطاب المرفوع إلى واجهة Gemini من Google لإنشاء التحليل. تشارك Google في إطار خصوصية البيانات بين الاتحاد الأوروبي والولايات المتحدة (EU-US Data Privacy Framework)، وهو الأساس القانوني لهذا النقل. لا نستخدم خطاباتك لتدريب أي نموذج. لا نعرض أبدًا النص المستخرج الخام لك أو لأي شخص آخر — فقط الملخص المنظم والمواعيد النهائية ومسودة الرد.",
          },
          {
            heading: "من غيرنا يتعامل مع بياناتك",
            body: "يعالج عدد قليل من مزوّدي الخدمات المتخصصين بياناتك نيابةً عنا، كل منهم لغرض محدد واحد: Supabase (قاعدة البيانات وتخزين الملفات)، Resend (إرسال الرسائل الإلكترونية)، PostHog (تحليلات المنتج، فقط إذا وافقت على شريط ملفات تعريف الارتباط)، Sentry (تتبع الأخطاء)، وVercel (الاستضافة). لا يمكن لأي منهم استخدام بياناتك لأي غرض يتجاوز تقديم خدمته لنا.",
          },
          {
            heading: "المدفوعات",
            body: "تُدار فوترة الاشتراك عبر Stripe. لا نرى أو نخزّن أبدًا تفاصيل بطاقتك — تُعالجها Stripe وتخزّنها مباشرةً.",
          },
          {
            heading: "المدة التي نحتفظ فيها ببياناتك",
            body: "نحتفظ بحسابك وخطاباتك حتى تحذف حسابك (فورًا، من الإعدادات) أو تطلب منا حذفه عبر البريد الإلكتروني. لا يوجد حاليًا حذف تلقائي بعد فترة من عدم النشاط.",
          },
          {
            heading: "حقوقك",
            body: "يمكنك حذف حسابك وجميع الخطابات المرتبطة به في أي وقت من الإعدادات — هذا فوري ولا يمكن التراجع عنه. إذا كنت تفضل عدم القيام بذلك بنفسك، أو لديك أي سؤال آخر بشأن بياناتك، راسلنا على",
          },
        ],
      },
      terms: {
        title: "شروط الخدمة",
        sections: [
          {
            heading: "ما هي هذه الخدمة",
            body: () =>
              "يحلل Papkram الخطابات البريدية باللغة الألمانية وينتج ملخصًا بلغة واضحة، وكشفًا للمواعيد النهائية، ومسودة رد. إنها أداة مساعدة للقراءة والصياغة، وليست استشارة قانونية أو ضريبية أو مالية.",
          },
          {
            heading: "الدقة غير مضمونة",
            body: () =>
              "قد يخطئ تحليل الذكاء الاصطناعي في قراءة المبالغ أو التواريخ أو السياق، خاصةً من الصور ذات الجودة المنخفضة. عندما لا نكون واثقين، نشير إلى ذلك بوضوح — لكن راجع دائمًا أي شيء يتعلق بالمال أو المواعيد القانونية أو الالتزامات الرسمية قبل التصرف بناءً عليه.",
          },
          {
            heading: "التجربة المجانية والفوترة",
            body: (limit, price) =>
              `تحصل الحسابات الجديدة على ${limit} تحليلات مجانية للخطابات، بدون بطاقة مطلوبة. بعد ذلك، يفتح اشتراك بقيمة ${price} سنويًا تحليلات غير محدودة. تُفوتر سنويًا عبر Stripe؛ ألغِ في أي وقت من لوحة التحكم وستحتفظ بالوصول حتى نهاية فترة الفوترة الحالية. [ضريبة القيمة المضافة: ما إذا كان هذا السعر يشمل الضريبة يعتمد على وضعنا الضريبي المسجل، وسيتم تأكيده قبل الإطلاق.]`,
          },
          {
            heading: "حق الانسحاب (Widerrufsrecht)",
            body: () =>
              "إذا كنت تشترك بصفتك مستهلكًا، يمكنك الانسحاب من اشتراكك خلال 14 يومًا من الاشتراك، دون إبداء أي سبب. أرسل بريدًا إلكترونيًا إلى hello@papkram.de يتضمن بيانًا واضحًا ومؤرخًا برغبتك في الانسحاب — لا حاجة لنموذج محدد، وإن كان النموذج المعياري أدناه متاحًا. يبدأ الوصول غير المحدود فور الاشتراك، بناءً على طلبك؛ فإذا انسحبت قبل انتهاء الـ14 يومًا، ستكون مدينًا بمبلغ متناسب مقابل أيام الوصول التي استخدمتها بالفعل، وسنرد الباقي.",
          },
          {
            heading: "النموذج المعياري للانسحاب (Muster-Widerrufsformular)",
            body: () =>
              "إلى: [الاسم القانوني للمشغّل]، [عنوان المشغّل]، hello@papkram.de\nأُعلن/نُعلن بموجب هذا عن انسحابي/انسحابنا من عقد اشتراك Papkram.\nتاريخ الطلب: __________\nاسم المستهلك (المستهلكين): __________\nعنوان المستهلك (المستهلكين): __________\nالتاريخ: __________",
          },
          {
            heading: "إنهاء الحساب",
            body: () =>
              "يمكنك طلب حذف حسابك في أي وقت عبر إرسال بريد إلكتروني إلى hello@papkram.de، أو حذفه بنفسك في أي وقت من الإعدادات. قد نعلّق الحسابات التي تُستخدم لإساءة استخدام الخدمة (مثل رفع محتوى ليس خطابات على نطاق واسع).",
          },
          {
            heading: "المسؤولية",
            body: () =>
              'لسنا مسؤولين عن أي خسائر ناتجة عن الاعتماد على الملخص أو مسودة الرد المُنتَجة بالذكاء الاصطناعي دون التحقق المستقل من أي شيء يتعلق بالمال أو المواعيد النهائية أو الالتزامات القانونية — راجع "الدقة غير مضمونة" أعلاه. وفيما عدا ذلك، تقتصر مسؤوليتنا على قيمة الاشتراك الذي دفعته خلال الـ12 شهرًا السابقة للمطالبة، إلا في الحالات التي لا يسمح فيها القانون بهذا الحد — كالقصد أو الإهمال الجسيم أو الإضرار بالحياة أو الجسد أو الصحة، على سبيل المثال.',
          },
          {
            heading: "القانون الحاكم",
            body: () =>
              "تخضع هذه الشروط لقانون جمهورية ألمانيا الاتحادية. إذا كنت مستهلكًا، فإن هذا لا يسلبك أي حماية يمنحها لك القانون الإلزامي في بلد إقامتك المعتادة. مقر عمل [الاسم القانوني للمشغّل] هو مكان الاختصاص القضائي للنزاعات مع العملاء من الشركات.",
          },
        ],
      },
    },
    deadlines: {
      heading: "المواعيد النهائية",
      emptyTitle: "لا توجد مواعيد نهائية بعد",
      emptyDescription: "ارفع خطابًا وستظهر هنا أي مواعيد نهائية مذكورة فيه، الأقرب أولاً.",
      uploadCta: "ارفع خطابًا",
      undatedLabel: "بدون تاريخ محدد",
      prevMonth: "الشهر السابق",
      nextMonth: "الشهر التالي",
      todayLabel: "اليوم",
      deadlineWordSingular: "موعد نهائي",
      deadlineWordPlural: "مواعيد نهائية",
    },
    settings: {
      heading: "الإعدادات",
      languageHeading: "اللغة",
      languageDescription: "يُكتب كل ملخص وموعد نهائي ومسودة رد بهذه اللغة.",
      subscriptionHeading: "الاشتراك",
      subscriptionActive: "لديك خطابات غير محدودة.",
      subscriptionFree: "أنت في التجربة المجانية.",
      accountHeading: "الحساب",
      senderInfoHeading: "بياناتك",
      senderInfoDescription: "أضف اسمك وعنوانك البريدي مرة واحدة، وستستخدمهما كل مسودة رد كترويسة — بدلاً من عنصر نائب يتعين عليك تعبئته يدويًا قبل الإرسال.",
      fullNameLabel: "الاسم الكامل",
      postalAddressLabel: "العنوان البريدي",
      saveButton: "حفظ",
      saving: "جارٍ الحفظ…",
      senderInfoSavedToast: "تم الحفظ",
      senderInfoSaveFailed: "تعذر حفظ بياناتك.",
      senderInfoSaveFailedRecovery: "حاول مرة أخرى.",
      deleteAccountButton: "حذف الحساب",
      deleteAccountTitle: "هل تريد حذف حسابك؟",
      deleteAccountWarning:
        "سيؤدي هذا إلى حذف جميع خطاباتك ومسودات الرد والملفات المرفوعة نهائيًا، وإلغاء أي اشتراك نشط فورًا. لا يمكن التراجع عن هذا الإجراء.",
      deleteAccountConfirmLabel: "اكتب DELETE للتأكيد",
      deleteAccountConfirmCta: "احذف حسابي",
      deleteAccountDeleting: "جارٍ الحذف…",
      deleteAccountSuccessToast: "تم حذف حسابك وجميع البيانات المرتبطة به.",
      deleteAccountFailed: "تعذر حذف حسابك.",
      deleteAccountFailedRecovery: "حاول مرة أخرى بعد قليل، أو راسلنا على hello@papkram.de.",
      deleteAccountUnauthenticated: "يجب تسجيل الدخول لحذف حسابك.",
    },
    cookieConsent: {
      ariaLabel: "الموافقة على ملفات تعريف الارتباط",
      message: "نستخدم ملفات تعريف ارتباط تحليلية لفهم كيفية استخدام Papkram. لا نستخدم خطاباتك المرفوعة في ذلك أبدًا.",
      accept: "موافق",
      decline: "رفض",
    },
    welcome: {
      heading: "أنت الآن ضمن القائمة.",
      body: "سنراسلك بالبريد الإلكتروني بمجرد إطلاق Papkram رسميًا.",
      shareHeading: "تعرف شخصًا يستلم بريدًا ألمانيًا مربكًا؟",
      shareTwitter: "شارك على X",
      shareWhatsapp: "شارك على واتساب",
      shareCopyLink: "نسخ الرابط",
      linkCopiedToast: "تم نسخ الرابط.",
      shareTweetText: "يترجم Papkram البريد الألماني المربك إلى لغة واضحة، مع المواعيد النهائية ورد جاهز للإرسال.",
      shareWhatsappText: "أستخدم Papkram لفهم البريد الألماني المربك — يستحق نظرة:",
      continueButton: "الانتقال إلى لوحة التحكم",
    },
  },
  tr: {
    header: {
      logo: "Papkram",
      backToDashboard: "Panele dön",
    },
    nav: {
      navLabel: "Ana gezinme",
      history: "Geçmiş",
      upload: "Yükle",
      deadlines: "Son tarihler",
      settings: "Ayarlar",
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
        newsletterOptInLabel: "Papkram tam olarak yayına girdiğinde bana haber ver.",
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
    senderCategories: {
      authority: "Resmi kurum",
      insurer: "Sigorta şirketi",
      bank: "Banka",
      landlord: "Ev sahibi",
      utility: "Hizmet sağlayıcı",
      school: "Okul",
      delivery: "Teslimat",
      other: "Diğer",
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
      nextUpHeading: "Sırada",
      actionRequiredBadge: "İşlem gerekiyor",
      noActionBadge: "İşlem gerekmiyor",
      filtersTrigger: "Filtreler",
      filterAll: "Tümü",
      filterActionNeeded: "İşlem gerekiyor",
      filterNoAction: "İşlem gerekmiyor",
      filterByCategory: "Kategori",
      filterEmptyTitle: "Bu filtrelere uyan mektup yok",
      filterEmptyDescription: "Farklı bir kombinasyon deneyin veya tüm mektupları tekrar görmek için filtreleri temizleyin.",
      clearFilters: "Filtreleri temizle",
      sortBy: "Sırala",
      sortNewest: "En yeni",
      sortOldest: "En eski",
      sortDeadline: "En yakın son tarih",
    },
    upload: {
      heading: "Mektup yükle",
      subhead:
        "Fotoğraf veya PDF, ikisi de olur. Onu okuyup sade bir özet, varsa son tarihler ve gönderime hazır bir yanıtla döneceğiz.",
      dropTitle: "Buraya bir fotoğraf veya PDF bırakın",
      dropSubtitle: "veya göz atmak için tıklayın",
      analyzeLetter: "Mektubu analiz et",
      readingTitle: "Mektubunuz okunuyor…",
      readingSubtitle: "Bu genellikle birkaç saniye sürer.",
      readingStages: [
        { title: "Mektubunuz okunuyor…", subtitle: "Bu genellikle birkaç saniye sürer." },
        { title: "Ayrıntılar çıkarılıyor…", subtitle: "Son tarihler, tutarlar ve gönderen." },
        { title: "Yanıtınız hazırlanıyor…", subtitle: "Neredeyse bitti." },
      ],
      preparingPhoto: "Fotoğraf hazırlanıyor…",
      dismiss: "Kapat",
      fileTooLarge: "Bu dosya çok büyük.",
      fileTooLargePdfRecovery: "Daha küçük bir PDF veya bunun yerine mektubun bir fotoğrafını deneyin.",
      fileTooLargeImageRecovery: "Farklı bir fotoğraf deneyin — bu, sıkıştırmadan sonra bile hâlâ çok büyük.",
      unsupportedFileType: "Yalnızca JPEG, PNG veya PDF dosyaları desteklenir.",
      uploadFailed: "Yükleme başarısız — tekrar deneyin.",
      uploadFailedRecovery: "Bağlantınızı kontrol edin. Dosya çok büyükse daha küçük bir fotoğraf deneyin.",
      analysisFailed: "Analiz başarısız — tekrar deneyin.",
      analysisFailedRecovery: "Bağlantınızı kontrol edin ve tekrar yüklemeyi deneyin.",
      pleaseLoginAgain: "Lütfen tekrar giriş yapın.",
      chooseFileFirst: "Önce yüklenecek bir dosya seçin.",
      accountLoadFailed: "Hesabınız yüklenemedi.",
      accountLoadFailedRecovery: "Tekrar deneyin.",
      trialLimitReached: (limit) => `${limit} ücretsiz mektubunuzun tamamını kullandınız.`,
      trialLimitReachedRecovery: (price) => `Yılda ${price} karşılığında sınırsız mektubun kilidini açın.`,
      dailyLimitReached: "Bugünkü mektup sınırınıza ulaştınız.",
      dailyLimitReachedRecovery: "Yarın tekrar deneyin, ya da daha fazlasına ihtiyacınız varsa bize ulaşın.",
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
      moreOptions: "Diğer seçenekler",
      viewOriginalLetter: "Yüklenen mektubu görüntüle",
      shareSummary: "Özeti paylaş",
      openOriginalFailedToast: "Mektup açılamadı — tekrar deneyin.",
      summaryCopiedToast: "Özet kopyalandı",
      summaryWatermark: "— Papkram ile özetlendi · papkram.de",
      letterExplainerWithDate: (sender, date) => `Bu, ${sender} tarafından gönderilen ve ${date} tarihli bir mektuptur.`,
      letterExplainerWithoutDate: (sender) => `Bu, ${sender} tarafından gönderilen bir mektuptur.`,
      replyToneGroupLabel: "Yanıt tonu",
      notFoundTitle: "Bu mektubu bulamıyoruz",
      notFoundDescription: "Kaldırılmış olabilir veya bağlantı hesabınıza ait olmayabilir.",
      couldntFindLetter: "Bu mektup bulunamadı.",
      draftedButNotSaved: "Taslak oluşturuldu ama yeni yanıt kaydedilemedi.",
      errorTitle: "Bu mektup yüklenemedi",
      errorRecovery: "Bu genellikle geçicidir. Biraz sonra tekrar deneyin.",
      keyFactsHeading: "Bu bilgi nereden geliyor",
      paymentsHeading: "Ödeme",
      appointmentsHeading: "Randevu",
      actionRequiredBadge: "İşlem gerekiyor",
      noActionBadge: "İşlem gerekmiyor",
      actionRequiredDescription: "Bu mektup sizden bir yanıt gerektiriyor.",
      noActionDescription: "Burada yapılacak bir şey yok — sadece kayıtlarınız için.",
      translatingBanner: (language) => `Bu mektup ${language} diline çevriliyor…`,
      translationFailedToast: "Bu mektup çevrilemedi.",
      translationFailedRecovery: "Hâlâ orijinal dilinde burada — tekrar deneyin.",
      wizard: {
        stepIntentHeading: "Ne söylemek istiyorsunuz?",
        stepFollowUpHeading: "Birkaç detay daha",
        requestTimeQuestion: "Bunu ne zamana kadar yapabilirsiniz?",
        requestTimeOptionPlusOneMonth: "1 ay içinde",
        requestTimeOptionPlusTwoMonths: "2 ay içinde",
        requestTimeOptionInstalments: "Taksitle",
        requestTimeCustomDateLabel: "Başka bir tarih seçin",
        objectQuestion: "Neyi yanlış buluyorsunuz?",
        objectPlaceholder: "Yanlış olanı kendi cümlelerinizle anlatın.",
        clarifyQuestion: "Ne sormak istiyorsunuz?",
        clarifyPlaceholder: "Sorunuzu yazın.",
        continueButton: "Devam et",
        backButton: "Geri",
        editAnswerButton: "Yanıtı düzenle",
        sendByEmailButton: "E-posta ile gönder",
        mailtoSubject: "Yanıtım",
        answerByDate: (date) => `Bunu ${date} tarihine kadar yapabilirim.`,
        answerInstalments: "Taksitle ödeme yapmak istiyorum.",
        answerRequired: "Devam etmek için bir yanıt ekleyin.",
        answerNotUnderstood: "Bunu tam olarak anlayamadık — farklı şekilde ifade etmeyi deneyin.",
        generatingReply: "Yanıtınız hazırlanıyor…",
      },
    },
    paywall: {
      badge: "Ücretsiz deneme sona erdi",
      heading: (limit) => `${limit} ücretsiz mektubunuzun tamamını kullandınız`,
      description: (price, interval) =>
        `${interval === "year" ? "Yılda" : "Ayda"} ${price} karşılığında sınırsız mektubun kilidini açın — istediğiniz zaman panelinizden iptal edin.`,
      planToggle: { yearly: "Yıllık — en avantajlı", monthly: "Aylık" },
      redirecting: "Yönlendiriliyor…",
      subscribe: (price, interval) => `Abone ol — ${interval === "year" ? "yılda" : "ayda"} ${price}`,
      checkoutError: "Ödeme başlatılamadı.",
      earlyAccessConsent:
        "Sınırsız erişimin hemen başlamasını istiyorum. 14 gün içinde yine de cayabileceğimi, ancak o ana kadar kullandığım erişim için orantılı bir tutar borçlanacağımı anlıyorum.",
      earlyAccessConsentRequired: "Devam etmek için bunu onaylayın.",
    },
    demoLimit: {
      badge: "Demo tamamlandı",
      heading: (limit) => `${limit} demo mektubun tümünü kullandınız.`,
      body: "İşte tam deneyim — yükleme, sade bir özet, son tarihler, gönderime hazır bir yanıt. Yayına girdiğimizde size e-posta göndereceğiz.",
      backToDashboard: "Panele dön",
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
            body: "Yüklenen bir mektubun içeriği, analizi oluşturmak için Google'ın Gemini API'sine gönderilir. Google, AB-ABD Veri Gizliliği Çerçevesi'ne (EU-US Data Privacy Framework) katılmaktadır; bu, bu aktarımın yasal dayanağıdır. Mektuplarınızı herhangi bir modeli eğitmek için kullanmayız. Ham çıkarılan metni asla size veya başka birine göstermeyiz — yalnızca yapılandırılmış özeti, son tarihleri ve yanıt taslağını gösteririz.",
          },
          {
            heading: "Verilerinizle başka kimler ilgileniyor",
            body: "Birkaç uzman sağlayıcı, bizim adımıza, her biri tek bir amaç için veri işler: Supabase (veritabanı ve dosya depolama), Resend (e-posta gönderimi), PostHog (ürün analitiği, yalnızca çerez bildirimini kabul ettiyseniz), Sentry (hata izleme) ve Vercel (barındırma). Hiçbiri verilerinizi bize hizmet sağlamanın ötesinde bir amaçla kullanamaz.",
          },
          {
            heading: "Ödemeler",
            body: "Abonelik faturalandırması Stripe tarafından yönetilir. Kart bilgilerinizi asla görmez veya saklamayız — Stripe bunu doğrudan işler ve saklar.",
          },
          {
            heading: "Verilerinizi ne kadar süre saklıyoruz",
            body: "Hesabınızı silene kadar (Ayarlar'dan anında) veya e-posta ile silmemizi isteyene kadar hesabınızı ve mektuplarınızı saklarız. Şu anda hareketsizlik süresinden sonra otomatik silme bulunmamaktadır.",
          },
          {
            heading: "Haklarınız",
            body: "Hesabınızı ve ilişkili tüm mektupları istediğiniz zaman Ayarlar'dan silebilirsiniz — bu anında gerçekleşir ve geri alınamaz. Bunu kendiniz yapmak istemiyorsanız veya verileriniz hakkında başka bir sorunuz varsa, bize şu adresten ulaşın:",
          },
        ],
      },
      terms: {
        title: "Kullanım Şartları",
        sections: [
          {
            heading: "Bu hizmet nedir",
            body: () =>
              "Papkram, Almanca posta mektuplarını analiz eder ve sade bir özet, son tarih tespiti ve bir yanıt taslağı üretir. Bu bir okuma ve taslak oluşturma yardımcısıdır, hukuki, mali veya vergi danışmanlığı değildir.",
          },
          {
            heading: "Doğruluk garanti edilmez",
            body: () =>
              "Yapay zeka analizi, özellikle düşük kaliteli fotoğraflardan, tutarları, tarihleri veya bağlamı yanlış okuyabilir. Emin olmadığımızda bunu işaretleriz — ancak para, yasal son tarihler veya resmi yükümlülüklerle ilgili her şeyi harekete geçmeden önce her zaman kontrol edin.",
          },
          {
            heading: "Ücretsiz deneme ve faturalandırma",
            body: (limit, price) =>
              `Yeni hesaplar, kart gerekmeden ${limit} ücretsiz mektup analizi alır. Bunun ötesinde, yılda ${price} tutarındaki bir abonelik sınırsız analizin kilidini açar. Stripe üzerinden yıllık faturalandırılır; panelinizden istediğiniz zaman iptal edebilirsiniz ve mevcut faturalandırma dönemi sona erene kadar erişiminizi korursunuz. [KDV: bu fiyata KDV dahil olup olmadığı vergi kayıt durumumuza bağlıdır, lansmandan önce netleştirilecektir.]`,
          },
          {
            heading: "Cayma hakkı (Widerrufsrecht)",
            body: () =>
              "Tüketici olarak abone oluyorsanız, abone olduktan sonra 14 gün içinde, herhangi bir gerekçe göstermeden aboneliğinizden cayabilirsiniz. hello@papkram.de adresine cayma isteğinizi açıkça belirten, tarihli bir e-posta gönderin — belirli bir form gerekmez, ancak aşağıda örnek bir form bulunmaktadır. Sınırsız erişim, talebiniz üzerine abone olduğunuzda hemen başlar; 14 gün dolmadan cayarsanız, o ana kadar kullandığınız erişim günleri için orantılı bir tutar borçlanırsınız ve kalan kısmı iade ederiz.",
          },
          {
            heading: "Örnek cayma formu (Muster-Widerrufsformular)",
            body: () =>
              "Kime: [Operatörün yasal adı], [Operatörün adresi], hello@papkram.de\nİşbu belgeyle Papkram aboneliği sözleşmemden/sözleşmemizden caydığımı/caydığımızı bildiririm/bildiririz.\nSipariş tarihi: __________\nTüketici(ler)in adı: __________\nTüketici(ler)in adresi: __________\nTarih: __________",
          },
          {
            heading: "Hesap sonlandırma",
            body: () =>
              "hello@papkram.de adresine e-posta göndererek ya da istediğiniz zaman Ayarlar'dan kendiniz hesabınızın silinmesini talep edebilirsiniz. Hizmeti kötüye kullanmak için kullanılan hesapları askıya alabiliriz (örneğin, büyük ölçekte mektup olmayan içerik yükleme).",
          },
          {
            heading: "Sorumluluk",
            body: () =>
              'Para, son tarihler veya yasal yükümlülüklerle ilgili herhangi bir şeyi bağımsız olarak kontrol etmeden yapay zeka tarafından oluşturulan özete veya yanıt taslağına güvenmekten kaynaklanan kayıplardan sorumlu değiliz — yukarıdaki "Doğruluk garanti edilmez" bölümüne bakın. Bunun ötesinde, sorumluluğumuz, talepten önceki 12 ay içinde ödediğiniz abonelik ücretiyle sınırlıdır; kasıt, ağır ihmal veya yaşam, beden ya da sağlığa verilen zarar gibi kanunun bu sınırlamaya izin vermediği durumlar hariçtir.',
          },
          {
            heading: "Uygulanacak hukuk",
            body: () =>
              "Bu şartlar, Almanya Federal Cumhuriyeti kanunlarına tabidir. Tüketici iseniz, bu durum, olağan olarak ikamet ettiğiniz ülkenin emredici hukukunun size sağladığı korumayı ortadan kaldırmaz. [Operatörün yasal adı]'nın iş yeri, ticari müşterilerle olan uyuşmazlıklar için yetkili yargı yeridir.",
          },
        ],
      },
    },
    deadlines: {
      heading: "Son tarihler",
      emptyTitle: "Henüz son tarih yok",
      emptyDescription: "Bir mektup yükleyin, içinde geçen son tarihler burada en yakın olandan başlayarak görünsün.",
      uploadCta: "Mektup yükle",
      undatedLabel: "Sabit tarih yok",
      prevMonth: "Önceki ay",
      nextMonth: "Sonraki ay",
      todayLabel: "Bugün",
      deadlineWordSingular: "son tarih",
      deadlineWordPlural: "son tarih",
    },
    settings: {
      heading: "Ayarlar",
      languageHeading: "Dil",
      languageDescription: "Her özet, son tarih ve yanıt taslağı bu dilde yazılır.",
      subscriptionHeading: "Abonelik",
      subscriptionActive: "Sınırsız mektubunuz var.",
      subscriptionFree: "Ücretsiz denemedesiniz.",
      accountHeading: "Hesap",
      senderInfoHeading: "Bilgileriniz",
      senderInfoDescription: "Adınızı ve posta adresinizi bir kez ekleyin; her yanıt taslağı bunları antet olarak kullansın — göndermeden önce kendinizin doldurması gereken bir yer tutucu yerine.",
      fullNameLabel: "Ad soyad",
      postalAddressLabel: "Posta adresi",
      saveButton: "Kaydet",
      saving: "Kaydediliyor…",
      senderInfoSavedToast: "Kaydedildi",
      senderInfoSaveFailed: "Bilgileriniz kaydedilemedi.",
      senderInfoSaveFailedRecovery: "Tekrar deneyin.",
      deleteAccountButton: "Hesabı sil",
      deleteAccountTitle: "Hesabınızı silmek istiyor musunuz?",
      deleteAccountWarning:
        "Bu işlem tüm mektuplarınızı, yanıt taslaklarınızı ve yüklediğiniz dosyaları kalıcı olarak siler, aktif bir aboneliği varsa hemen iptal eder. Bu işlem geri alınamaz.",
      deleteAccountConfirmLabel: "Onaylamak için DELETE yazın",
      deleteAccountConfirmCta: "Hesabımı sil",
      deleteAccountDeleting: "Siliniyor…",
      deleteAccountSuccessToast: "Hesabınız ve ilişkili tüm verileriniz silindi.",
      deleteAccountFailed: "Hesabınız silinemedi.",
      deleteAccountFailedRecovery: "Birazdan tekrar deneyin veya hello@papkram.de adresine e-posta gönderin.",
      deleteAccountUnauthenticated: "Hesabınızı silmek için giriş yapmış olmanız gerekir.",
    },
    cookieConsent: {
      ariaLabel: "Çerez izni",
      message: "Papkram'ın nasıl kullanıldığını anlamak için analiz çerezleri kullanıyoruz. Yüklediğiniz mektupları bunun için asla kullanmıyoruz.",
      accept: "Kabul et",
      decline: "Reddet",
    },
    welcome: {
      heading: "Kaydınız alındı.",
      body: "Papkram tam olarak yayına girer girmez size e-posta göndereceğiz.",
      shareHeading: "Kafa karıştırıcı Almanca mektuplar alan birini tanıyor musunuz?",
      shareTwitter: "X'te paylaş",
      shareWhatsapp: "WhatsApp'ta paylaş",
      shareCopyLink: "Bağlantıyı kopyala",
      linkCopiedToast: "Bağlantı kopyalandı.",
      shareTweetText: "Papkram, kafa karıştırıcı Almanca mektupları anlaşılır bir dile, son tarihlerle ve gönderime hazır bir yanıtla birlikte çeviriyor.",
      shareWhatsappText: "Kafa karıştırıcı Almanca mektupları anlamak için Papkram kullanıyorum — göz atmaya değer:",
      continueButton: "Panele devam et",
    },
  },
};
