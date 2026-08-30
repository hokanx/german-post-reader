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
    backToHome: string;
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
      unexpectedError: string;
      unexpectedErrorRecovery: string;
      tooManyAttempts: string;
      tooManyAttemptsRecovery: string;
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
    lettersUsedDemo: (used: number, limit: number) => string;
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
    tooManyAttempts: string;
    tooManyAttemptsRecovery: string;
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
    demoNotice: string;
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
    senderInfoTooLong: string;
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
    sharePoster: string;
    linkCopiedToast: string;
    linkCopyFailed: string;
    shareTweetText: string;
    shareWhatsappText: string;
    posterCaptionText: string;
    posterPreparingToast: string;
    posterShareFailed: string;
    posterFallbackToast: string;
    continueButton: string;
  };
};

export const APP_COPY: Record<AppLanguage, AppCopy> = {
  en: {
    header: {
      logo: "Papkram",
      backToDashboard: "Back to dashboard",
      backToHome: "Back to home",
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
        unexpectedError: "Something went wrong.",
        unexpectedErrorRecovery: "Try again in a moment.",
        tooManyAttempts: "Too many attempts.",
        tooManyAttemptsRecovery: "Wait a few minutes and try again.",
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
      lettersUsedDemo: (used, limit) => `${used} of ${limit} demo letters used`,
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
      tooManyAttempts: "Too many uploads too quickly.",
      tooManyAttemptsRecovery: "Wait a few minutes and try again.",
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
      demoNotice: "Papkram is currently a free demo. You'll be notified by email when full access launches.",
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
      senderInfoTooLong: "That's too long — please shorten your name or address.",
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
      sharePoster: "Share a poster",
      linkCopiedToast: "Link copied.",
      linkCopyFailed: "Couldn't copy the link — select and copy it manually instead.",
      shareTweetText: "Papkram translates confusing German mail into plain language, with deadlines and a ready-to-send reply.",
      shareWhatsappText: "I've been using Papkram to make sense of confusing German mail — worth a look:",
      posterCaptionText:
        "I stopped dreading German mail. Papkram reads the letter, tells me what it actually says, flags the deadline, and drafts my reply — first 4 letters free.",
      posterPreparingToast: "Preparing your poster…",
      posterShareFailed: "Couldn't share the poster — try again, or copy the link instead.",
      posterFallbackToast: "Poster downloaded and caption copied — ready to paste into Instagram, TikTok, or WhatsApp.",
      continueButton: "Continue to dashboard",
    },
  },
  ar: {
    header: {
      logo: "Papkram",
      backToDashboard: "العودة إلى لوحة التحكم",
      backToHome: "العودة إلى الرئيسية",
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
        unexpectedError: "حدث خطأ ما.",
        unexpectedErrorRecovery: "حاول مرة أخرى بعد قليل.",
        tooManyAttempts: "محاولات كثيرة جدًا.",
        tooManyAttemptsRecovery: "انتظر بضع دقائق ثم حاول مرة أخرى.",
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
      lettersUsedDemo: (used, limit) => `${used} من ${limit} خطابات تجريبية مستخدمة`,
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
      tooManyAttempts: "عدد كبير جدًا من التحميلات في وقت قصير.",
      tooManyAttemptsRecovery: "انتظر بضع دقائق ثم حاول مرة أخرى.",
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
      demoNotice: "Papkram حاليًا في وضع التجربة المجانية. سنُخطرك بالبريد الإلكتروني عند إطلاق الوصول الكامل.",
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
      senderInfoTooLong: "هذا طويل جدًا — يرجى اختصار اسمك أو عنوانك.",
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
      sharePoster: "شارك ملصقًا",
      linkCopiedToast: "تم نسخ الرابط.",
      linkCopyFailed: "تعذر نسخ الرابط — حدده وانسخه يدويًا بدلاً من ذلك.",
      shareTweetText: "يترجم Papkram البريد الألماني المربك إلى لغة واضحة، مع المواعيد النهائية ورد جاهز للإرسال.",
      shareWhatsappText: "أستخدم Papkram لفهم البريد الألماني المربك — يستحق نظرة:",
      posterCaptionText:
        "توقفت عن الخوف من البريد الألماني. تطبيق Papkram يقرأ الخطاب، يشرح لي ما يعنيه فعليًا، ينبهني للموعد النهائي، ويكتب لي ردًا جاهزًا — أول 4 خطابات مجانًا.",
      posterPreparingToast: "جارٍ تجهيز الملصق…",
      posterShareFailed: "تعذّرت مشاركة الملصق — حاول مجددًا، أو انسخ الرابط بدلاً من ذلك.",
      posterFallbackToast: "تم تنزيل الملصق ونسخ النص — جاهز للصقه في إنستغرام أو تيك توك أو واتساب.",
      continueButton: "الانتقال إلى لوحة التحكم",
    },
  },
  tr: {
    header: {
      logo: "Papkram",
      backToDashboard: "Panele dön",
      backToHome: "Ana sayfaya dön",
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
        unexpectedError: "Bir şeyler ters gitti.",
        unexpectedErrorRecovery: "Biraz sonra tekrar deneyin.",
        tooManyAttempts: "Çok fazla deneme yapıldı.",
        tooManyAttemptsRecovery: "Birkaç dakika bekleyip tekrar deneyin.",
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
      lettersUsedDemo: (used, limit) => `${limit} demo mektuptan ${used} tanesi kullanıldı`,
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
      tooManyAttempts: "Kısa sürede çok fazla yükleme yapıldı.",
      tooManyAttemptsRecovery: "Birkaç dakika bekleyip tekrar deneyin.",
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
      demoNotice: "Papkram şu anda ücretsiz demo aşamasında. Tam erişim yayına girdiğinde size e-posta ile haber vereceğiz.",
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
      senderInfoTooLong: "Bu çok uzun — lütfen adınızı veya adresinizi kısaltın.",
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
      sharePoster: "Bir poster paylaş",
      linkCopiedToast: "Bağlantı kopyalandı.",
      linkCopyFailed: "Bağlantı kopyalanamadı — bunun yerine seçip elle kopyalayın.",
      shareTweetText: "Papkram, kafa karıştırıcı Almanca mektupları anlaşılır bir dile, son tarihlerle ve gönderime hazır bir yanıtla birlikte çeviriyor.",
      shareWhatsappText: "Kafa karıştırıcı Almanca mektupları anlamak için Papkram kullanıyorum — göz atmaya değer:",
      posterCaptionText:
        "Almanca mektuplardan artık korkmuyorum. Papkram mektubu okuyor, gerçekte ne dediğini anlatıyor, son tarihi hatırlatıyor ve yanıtımı yazıyor — ilk 4 mektup ücretsiz.",
      posterPreparingToast: "Posteriniz hazırlanıyor…",
      posterShareFailed: "Poster paylaşılamadı — tekrar deneyin veya bunun yerine bağlantıyı kopyalayın.",
      posterFallbackToast: "Poster indirildi ve metin kopyalandı — Instagram, TikTok veya WhatsApp'a yapıştırmaya hazır.",
      continueButton: "Panele devam et",
    },
  },
  de: {
    header: {
      logo: "Papkram",
      backToDashboard: "Zurück zum Dashboard",
      backToHome: "Zurück zur Startseite",
    },
    nav: {
      navLabel: "Hauptnavigation",
      history: "Verlauf",
      upload: "Hochladen",
      deadlines: "Fristen",
      settings: "Einstellungen",
    },
    auth: {
      emailLabel: "E-Mail",
      passwordLabel: "Passwort",
      login: {
        heading: "Willkommen zurück",
        subhead: "Melden Sie sich an, um Ihren Briefverlauf zu sehen.",
        submitting: "Anmeldung läuft…",
        submit: "Anmelden",
        noAccount: "Neu hier?",
        startTrialLink: "Kostenlos testen",
      },
      signup: {
        heading: (n) => `${n} Briefe kostenlos, keine Karte nötig`,
        subhead: "Erstellen Sie ein Konto, um Ihre deutsche Post in klarer Sprache zu lesen.",
        submitting: "Ihr Konto wird erstellt…",
        submit: "Kostenlos testen",
        haveAccount: "Sie haben bereits ein Konto?",
        loginLink: "Anmelden",
        newsletterOptInLabel: "Benachrichtigen Sie mich, sobald Papkram vollständig startet.",
      },
      errors: {
        enterEmailPassword: "Geben Sie Ihre E-Mail-Adresse und Ihr Passwort ein.",
        enterPassword: "Geben Sie Ihr Passwort ein",
        invalidCredentials: "E-Mail-Adresse und Passwort stimmen nicht überein.",
        invalidCredentialsRecovery: "Prüfen Sie auf Tippfehler oder setzen Sie Ihr Passwort zurück.",
        checkEmailPassword: "Prüfen Sie Ihre E-Mail-Adresse und Ihr Passwort.",
        passwordTooShort: "Das Passwort muss mindestens 8 Zeichen lang sein",
        emailInUse: "Für diese E-Mail-Adresse besteht bereits ein Konto.",
        emailInUseRecovery: "Versuchen Sie stattdessen, sich anzumelden.",
        weakPassword: "Dieses Passwort ist zu schwach.",
        weakPasswordRecovery: "Verwenden Sie mindestens 8 Zeichen mit einer Mischung aus Buchstaben und Zahlen.",
        signupNoUser: "Die Registrierung hat keinen Benutzer zurückgegeben.",
        signupNoUserRecovery: "Versuchen Sie es gleich noch einmal.",
        accountSetupFailed: "Ihr Konto wurde erstellt, aber die Einrichtung ist fehlgeschlagen.",
        accountSetupFailedRecovery: "Versuchen Sie sich anzumelden — wenn das weiterhin passiert, kontaktieren Sie den Support.",
        unexpectedError: "Etwas ist schiefgelaufen.",
        unexpectedErrorRecovery: "Versuchen Sie es gleich noch einmal.",
        tooManyAttempts: "Zu viele Versuche.",
        tooManyAttemptsRecovery: "Warten Sie ein paar Minuten und versuchen Sie es erneut.",
      },
    },
    onboarding: {
      heading: "Welche Sprache passt für Sie?",
      subhead:
        "Jede Zusammenfassung, jede Frist und jeder Antwortentwurf wird in dieser Sprache verfasst. Sie können sie jederzeit über Ihr Dashboard ändern.",
      choose: "Auswählen",
      savingToast: "Ihre Sprache wird gespeichert…",
      savedToast: "Gespeichert",
      unsupportedLanguage: "Nicht unterstützte Sprache.",
      saveFailed: "Ihre Spracheinstellung konnte nicht gespeichert werden.",
      saveFailedRecovery: "Versuchen Sie es erneut.",
    },
    senderCategories: {
      authority: "Behörde",
      insurer: "Versicherung",
      bank: "Bank",
      landlord: "Vermieter",
      utility: "Versorger",
      school: "Schule",
      delivery: "Zustellung",
      other: "Sonstiges",
    },
    dashboard: {
      uploadButton: "Brief hochladen",
      yourLetters: "Ihre Briefe",
      emptyTitle: "Noch keine Briefe",
      emptyDescription:
        "Laden Sie Ihren ersten deutschen Brief hoch, um eine Zusammenfassung in klarer Sprache, Fristen und eine versandfertige Antwort zu erhalten.",
      unlimitedBadge: "Unbegrenzte Briefe",
      lettersUsed: (used, limit) => `${used} von ${limit} kostenlosen Briefen verwendet`,
      lettersUsedDemo: (used, limit) => `${used} von ${limit} Demo-Briefen verwendet`,
      unlockCta: (price) => `Schalten Sie unbegrenzte Briefe für ${price}/Jahr frei.`,
      analysisPending: "Analyse läuft…",
      manageSubscription: "Abo verwalten",
      openingPortal: "Wird geöffnet…",
      portalError: "Das Abrechnungsportal konnte nicht geöffnet werden.",
      subscriptionActiveToast: "Abo aktiv — unbegrenzte Briefe freigeschaltet!",
      errorTitle: "Ihr Dashboard konnte nicht geladen werden",
      errorRecovery: "Das ist meist vorübergehend. Versuchen Sie es gleich noch einmal.",
      nextUpHeading: "Als Nächstes",
      actionRequiredBadge: "Handlung erforderlich",
      noActionBadge: "Keine Handlung nötig",
      filtersTrigger: "Filter",
      filterAll: "Alle",
      filterActionNeeded: "Handlung erforderlich",
      filterNoAction: "Keine Handlung nötig",
      filterByCategory: "Kategorie",
      filterEmptyTitle: "Keine Briefe entsprechen diesen Filtern",
      filterEmptyDescription: "Probieren Sie eine andere Kombination, oder setzen Sie alle Filter zurück, um wieder alle Briefe zu sehen.",
      clearFilters: "Filter zurücksetzen",
      sortBy: "Sortieren nach",
      sortNewest: "Neueste zuerst",
      sortOldest: "Älteste zuerst",
      sortDeadline: "Nächste Frist zuerst",
    },
    upload: {
      heading: "Brief hochladen",
      subhead:
        "Ein Foto oder ein PDF funktionieren beide. Wir lesen ihn und melden uns mit einer Zusammenfassung in klarer Sprache, etwaigen Fristen und einer versandfertigen Antwort.",
      dropTitle: "Foto oder PDF hier ablegen",
      dropSubtitle: "oder klicken zum Durchsuchen",
      analyzeLetter: "Brief analysieren",
      readingTitle: "Ihr Brief wird gelesen…",
      readingSubtitle: "Das dauert normalerweise nur wenige Sekunden.",
      readingStages: [
        { title: "Ihr Brief wird gelesen…", subtitle: "Das dauert normalerweise nur wenige Sekunden." },
        { title: "Details werden herausgesucht…", subtitle: "Fristen, Beträge und Absender." },
        { title: "Ihre Antwort wird entworfen…", subtitle: "Gleich fertig." },
      ],
      preparingPhoto: "Foto wird vorbereitet…",
      dismiss: "Schließen",
      fileTooLarge: "Diese Datei ist zu groß.",
      fileTooLargePdfRecovery: "Versuchen Sie ein kleineres PDF, oder stattdessen ein Foto des Briefes.",
      fileTooLargeImageRecovery: "Versuchen Sie ein anderes Foto — dieses ist auch nach dem Komprimieren noch zu groß.",
      unsupportedFileType: "Es werden nur JPEG-, PNG- oder PDF-Dateien unterstützt.",
      uploadFailed: "Hochladen fehlgeschlagen — versuchen Sie es erneut.",
      uploadFailedRecovery: "Prüfen Sie Ihre Verbindung. Ist die Datei sehr groß, versuchen Sie ein kleineres Foto.",
      analysisFailed: "Analyse fehlgeschlagen — versuchen Sie es erneut.",
      analysisFailedRecovery: "Prüfen Sie Ihre Verbindung und laden Sie erneut hoch.",
      pleaseLoginAgain: "Bitte melden Sie sich erneut an.",
      chooseFileFirst: "Wählen Sie zuerst eine Datei zum Hochladen.",
      accountLoadFailed: "Ihr Konto konnte nicht geladen werden.",
      accountLoadFailedRecovery: "Versuchen Sie es erneut.",
      trialLimitReached: (limit) => `Sie haben alle ${limit} kostenlosen Briefe aufgebraucht.`,
      trialLimitReachedRecovery: (price) => `Schalten Sie unbegrenzte Briefe für ${price}/Jahr frei.`,
      dailyLimitReached: "Sie haben das heutige Brieflimit erreicht.",
      dailyLimitReachedRecovery: "Versuchen Sie es morgen erneut, oder kontaktieren Sie uns, wenn Sie mehr benötigen.",
      tooManyAttempts: "Zu viele Uploads in zu kurzer Zeit.",
      tooManyAttemptsRecovery: "Warten Sie ein paar Minuten und versuchen Sie es erneut.",
      letterSaveFailed: "Ihr Brief wurde analysiert, konnte aber nicht gespeichert werden.",
      letterSaveFailedRecovery: "Versuchen Sie den Upload erneut.",
    },
    letters: {
      analysisComplete: "Analyse abgeschlossen",
      summary: "Zusammenfassung",
      deadlines: "Fristen",
      worthChecking: "Bitte prüfen",
      lowConfidenceWarning:
        "Wir waren uns nicht ganz sicher, ob dieser Brief korrekt gelesen wurde — das Foto oder der Scan war möglicherweise unklar. Prüfen Sie alles unten sorgfältig, bevor Sie danach handeln.",
      deadlineCount: (n) => `${n} ${n === 1 ? "Frist" : "Fristen"}`,
      riskFlagCount: (n) => `${n} zu prüfen`,
      yourReplyInGerman: "Ihre Antwort, auf Deutsch",
      readyToSend: "So versandfertig — der Empfänger liest Deutsch.",
      redrafting: "Wird neu entworfen…",
      replyRedraftedToast: "Antwort neu entworfen",
      showTranslation: (language) => `Zeigen, was das auf ${language} bedeutet`,
      hideTranslation: (language) => `${language}-Übersetzung ausblenden`,
      copyReply: "Antwort kopieren",
      copied: "Kopiert",
      copiedToast: "Antwort kopiert",
      copyFailedToast: "Kopieren fehlgeschlagen — markieren und kopieren Sie den Text manuell.",
      moreOptions: "Weitere Optionen",
      viewOriginalLetter: "Hochgeladenen Brief ansehen",
      shareSummary: "Zusammenfassung teilen",
      openOriginalFailedToast: "Der Brief konnte nicht geöffnet werden — versuchen Sie es erneut.",
      summaryCopiedToast: "Zusammenfassung kopiert",
      summaryWatermark: "— Zusammengefasst von Papkram · papkram.de",
      letterExplainerWithDate: (sender, date) => `Dieser Brief ist von ${sender}, datiert auf ${date}.`,
      letterExplainerWithoutDate: (sender) => `Dieser Brief ist von ${sender}.`,
      replyToneGroupLabel: "Antwortton",
      notFoundTitle: "Wir können diesen Brief nicht finden",
      notFoundDescription: "Er wurde möglicherweise entfernt, oder der Link gehört nicht zu Ihrem Konto.",
      couldntFindLetter: "Dieser Brief konnte nicht gefunden werden.",
      draftedButNotSaved: "Entworfen, aber die neue Antwort konnte nicht gespeichert werden.",
      errorTitle: "Dieser Brief konnte nicht geladen werden",
      errorRecovery: "Das ist meist vorübergehend. Versuchen Sie es gleich noch einmal.",
      keyFactsHeading: "Woher das stammt",
      paymentsHeading: "Zahlung",
      appointmentsHeading: "Termin",
      actionRequiredBadge: "Handlung erforderlich",
      noActionBadge: "Keine Handlung nötig",
      actionRequiredDescription: "Dieser Brief erfordert eine Antwort von Ihnen.",
      noActionDescription: "Hier ist nichts zu tun — nur für Ihre Unterlagen.",
      translatingBanner: (language) => `Dieser Brief wird nach ${language} übersetzt…`,
      translationFailedToast: "Dieser Brief konnte nicht übersetzt werden.",
      translationFailedRecovery: "Er ist weiterhin in der Originalsprache verfügbar — versuchen Sie es erneut.",
      wizard: {
        stepIntentHeading: "Was möchten Sie sagen?",
        stepFollowUpHeading: "Noch ein paar Details",
        requestTimeQuestion: "Bis wann können Sie das erledigen?",
        requestTimeOptionPlusOneMonth: "In 1 Monat",
        requestTimeOptionPlusTwoMonths: "In 2 Monaten",
        requestTimeOptionInstalments: "In Raten",
        requestTimeCustomDateLabel: "Anderes Datum wählen",
        objectQuestion: "Was stimmt nicht?",
        objectPlaceholder: "Beschreiben Sie mit eigenen Worten, was falsch ist.",
        clarifyQuestion: "Was möchten Sie fragen?",
        clarifyPlaceholder: "Geben Sie Ihre Frage ein.",
        continueButton: "Weiter",
        backButton: "Zurück",
        editAnswerButton: "Antwort bearbeiten",
        sendByEmailButton: "Per E-Mail senden",
        mailtoSubject: "Meine Antwort",
        answerByDate: (date) => `Ich kann das bis ${date} erledigen.`,
        answerInstalments: "Ich möchte gerne in Raten zahlen.",
        answerRequired: "Fügen Sie eine Antwort hinzu, um fortzufahren.",
        answerNotUnderstood: "Das konnten wir nicht ganz nachvollziehen — versuchen Sie, es anders zu formulieren.",
        generatingReply: "Ihre Antwort wird entworfen…",
      },
    },
    paywall: {
      badge: "Kostenlose Testphase beendet",
      heading: (limit) => `Sie haben alle ${limit} kostenlosen Briefe aufgebraucht`,
      description: (price, interval) =>
        `Schalten Sie unbegrenzte Briefe für ${price}/${interval === "year" ? "Jahr" : "Monat"} frei — jederzeit über Ihr Dashboard kündbar.`,
      planToggle: { yearly: "Jährlich — bester Wert", monthly: "Monatlich" },
      redirecting: "Weiterleitung läuft…",
      subscribe: (price, interval) => `Abonnieren — ${price}/${interval === "year" ? "Jahr" : "Monat"}`,
      checkoutError: "Der Bezahlvorgang konnte nicht gestartet werden.",
      earlyAccessConsent:
        "Ich möchte sofort unbegrenzten Zugang erhalten. Mir ist bewusst, dass ich innerhalb von 14 Tagen weiterhin widerrufen kann, dann aber einen anteiligen Betrag für den bereits genutzten Zugang schulde.",
      earlyAccessConsentRequired: "Bestätigen Sie dies, um fortzufahren.",
    },
    demoLimit: {
      badge: "Demo abgeschlossen",
      heading: (limit) => `Sie haben alle ${limit} Demo-Briefe aufgebraucht.`,
      body: "Das war die vollständige Erfahrung — Hochladen, Zusammenfassung in klarer Sprache, Fristen, versandfertige Antwort. Wir benachrichtigen Sie per E-Mail zum Start.",
      backToDashboard: "Zurück zum Dashboard",
    },
    languageSwitcher: {
      ariaLabel: "Analysesprache",
      updatedToast: "Sprache aktualisiert",
    },
    legal: {
      privacy: {
        title: "Datenschutzerklärung",
        sections: [
          {
            heading: "Was wir speichern",
            body: "Wenn Sie einen Brief hochladen, speichern wir das Originalbild oder PDF, die daraus erstellte Analyse (Zusammenfassung, Fristen, Antwortentwurf, Risikohinweise) sowie die von Ihnen gewählte Sprache. Dies wird in einem privaten Speicherbereich und in Datenbankeinträgen gespeichert, die mit Ihrem Konto verknüpft sind — nur Sie haben Zugriff auf Ihre eigenen Briefe.",
          },
          {
            heading: "Wie Ihr Brief verarbeitet wird",
            body: "Der Inhalt eines hochgeladenen Briefs wird zur Erstellung der Analyse an die Gemini-API von Google gesendet. Google nimmt am EU-US Data Privacy Framework teil, das die Rechtsgrundlage für diese Übermittlung bildet. Wir verwenden Ihre Briefe nicht zum Trainieren von Modellen. Wir zeigen den roh extrahierten Text niemals Ihnen oder anderen an — nur die strukturierte Zusammenfassung, Fristen und den Antwortentwurf.",
          },
          {
            heading: "Wer sonst noch mit Ihren Daten arbeitet",
            body: "Einige spezialisierte Anbieter verarbeiten Daten in unserem Auftrag, jeweils für genau einen Zweck: Supabase (Datenbank und Dateispeicherung), Resend (Versand von E-Mails), PostHog (Produktanalyse, nur wenn Sie den Cookie-Hinweis akzeptiert haben), Sentry (Fehlerverfolgung) und Vercel (Hosting). Keiner von ihnen darf Ihre Daten für etwas anderes nutzen, als uns diesen Dienst bereitzustellen.",
          },
          {
            heading: "Zahlungen",
            body: "Die Abrechnung des Abonnements erfolgt über Stripe. Wir sehen oder speichern Ihre Kartendaten nie — Stripe verarbeitet und speichert diese direkt.",
          },
          {
            heading: "Wie lange wir Ihre Daten aufbewahren",
            body: "Wir bewahren Ihr Konto und Ihre Briefe auf, bis Sie Ihr Konto löschen (sofort, über die Einstellungen) oder uns per E-Mail um Löschung bitten. Derzeit gibt es keine automatische Löschung nach einer Zeit der Inaktivität.",
          },
          {
            heading: "Ihre Rechte",
            body: "Sie können Ihr Konto und alle zugehörigen Briefe jederzeit in den Einstellungen löschen — das geschieht sofort und kann nicht rückgängig gemacht werden. Wenn Sie das lieber nicht selbst tun möchten oder eine andere Frage zu Ihren Daten haben, schreiben Sie uns an",
          },
        ],
      },
      terms: {
        title: "Nutzungsbedingungen",
        sections: [
          {
            heading: "Was dieser Dienst ist",
            body: () =>
              "Papkram analysiert deutschsprachige Postbriefe und erstellt eine Zusammenfassung in klarer Sprache, eine Fristenerkennung und einen Antwortentwurf. Es handelt sich um eine Lese- und Formulierungshilfe, nicht um eine Rechts-, Steuer- oder Finanzberatung.",
          },
          {
            heading: "Richtigkeit ist nicht garantiert",
            body: () =>
              "Die KI-Analyse kann Beträge, Daten oder Zusammenhänge falsch lesen, besonders bei Fotos schlechter Qualität. Wenn wir uns nicht sicher sind, weisen wir darauf hin — prüfen Sie aber immer alles, was Geld, gesetzliche Fristen oder amtliche Pflichten betrifft, bevor Sie danach handeln.",
          },
          {
            heading: "Kostenlose Testphase und Abrechnung",
            body: (limit, price) =>
              `Neue Konten erhalten ${limit} kostenlose Brief-Analysen, ohne dass eine Karte erforderlich ist. Danach schaltet ein Abonnement von ${price} pro Jahr unbegrenzte Analysen frei. Die Abrechnung erfolgt jährlich über Stripe; kündigen Sie jederzeit über Ihr Dashboard und behalten Sie den Zugang bis zum Ende der aktuellen Abrechnungsperiode. [MwSt.: Ob dieser Preis die Mehrwertsteuer enthält, hängt von unserem steuerlichen Registrierungsstatus ab und wird vor dem Start bestätigt.]`,
          },
          {
            heading: "Widerrufsrecht",
            body: () =>
              "Wenn Sie als Verbraucher abonnieren, können Sie Ihr Abonnement innerhalb von 14 Tagen nach Vertragsschluss ohne Angabe von Gründen widerrufen. Senden Sie eine klare, datierte Erklärung Ihres Widerrufs an hello@papkram.de — ein Formular ist nicht erforderlich, ein Muster finden Sie unten. Der unbegrenzte Zugang beginnt auf Ihren Wunsch sofort mit dem Abonnement; widerrufen Sie vor Ablauf der 14 Tage, schulden Sie einen anteiligen Betrag für die bereits genutzten Zugangstage, den Rest erstatten wir.",
          },
          {
            heading: "Muster-Widerrufsformular",
            body: () =>
              "An: [Rechtlicher Name des Betreibers], [Anschrift des Betreibers], hello@papkram.de\nHiermit widerrufe(n) ich/wir den von mir/uns abgeschlossenen Vertrag über das Papkram-Abonnement.\nBestellt am: __________\nName der/des Verbraucher(s): __________\nAnschrift der/des Verbraucher(s): __________\nDatum: __________",
          },
          {
            heading: "Kontokündigung",
            body: () =>
              "Sie können die Löschung Ihres Kontos jederzeit per E-Mail an hello@papkram.de beantragen oder es selbst jederzeit in den Einstellungen löschen. Wir können Konten sperren, die zum Missbrauch des Dienstes verwendet werden (z. B. das massenhafte Hochladen von Inhalten, die keine Briefe sind).",
          },
          {
            heading: "Haftung",
            body: () =>
              'Wir haften nicht für Verluste, die daraus entstehen, dass Sie sich auf die KI-generierte Zusammenfassung oder den Antwortentwurf verlassen, ohne alles, was Geld, Fristen oder rechtliche Verpflichtungen betrifft, unabhängig zu prüfen — siehe „Richtigkeit ist nicht garantiert" oben. Darüber hinaus ist unsere Haftung auf die Abonnementgebühr begrenzt, die Sie in den 12 Monaten vor dem Anspruch gezahlt haben, außer wo das Gesetz diese Begrenzung nicht zulässt — etwa bei Vorsatz, grober Fahrlässigkeit oder Verletzung von Leben, Körper oder Gesundheit.',
          },
          {
            heading: "Anwendbares Recht",
            body: () =>
              "Diese Bedingungen unterliegen dem Recht der Bundesrepublik Deutschland. Sind Sie Verbraucher, nimmt Ihnen dies keinen Schutz, den Ihnen das zwingende Recht Ihres gewöhnlichen Aufenthaltslands gewährt. Der Sitz von [Rechtlicher Name des Betreibers] ist der Gerichtsstand für Streitigkeiten mit Geschäftskunden.",
          },
        ],
      },
    },
    deadlines: {
      heading: "Fristen",
      emptyTitle: "Noch keine Fristen",
      emptyDescription: "Laden Sie einen Brief hoch, und alle darin genannten Fristen erscheinen hier, die nächste zuerst.",
      uploadCta: "Brief hochladen",
      undatedLabel: "Kein festes Datum",
      prevMonth: "Vorheriger Monat",
      nextMonth: "Nächster Monat",
      todayLabel: "Heute",
      deadlineWordSingular: "Frist",
      deadlineWordPlural: "Fristen",
    },
    settings: {
      heading: "Einstellungen",
      languageHeading: "Sprache",
      languageDescription: "Jede Zusammenfassung, jede Frist und jeder Antwortentwurf wird in dieser Sprache verfasst.",
      subscriptionHeading: "Abo",
      subscriptionActive: "Sie haben unbegrenzte Briefe.",
      subscriptionFree: "Sie befinden sich in der kostenlosen Testphase.",
      demoNotice: "Papkram befindet sich derzeit in einer kostenlosen Demo. Sie werden per E-Mail benachrichtigt, sobald der vollständige Zugang startet.",
      accountHeading: "Konto",
      senderInfoHeading: "Ihre Angaben",
      senderInfoDescription: "Fügen Sie einmalig Ihren Namen und Ihre Postanschrift hinzu, und jeder Antwortentwurf verwendet sie als Briefkopf — statt eines Platzhalters, den Sie sonst vor dem Versand selbst ausfüllen müssten.",
      fullNameLabel: "Vollständiger Name",
      postalAddressLabel: "Postanschrift",
      saveButton: "Speichern",
      saving: "Wird gespeichert…",
      senderInfoSavedToast: "Gespeichert",
      senderInfoSaveFailed: "Ihre Angaben konnten nicht gespeichert werden.",
      senderInfoSaveFailedRecovery: "Versuchen Sie es erneut.",
      senderInfoTooLong: "Das ist zu lang — kürzen Sie bitte Ihren Namen oder Ihre Adresse.",
      deleteAccountButton: "Konto löschen",
      deleteAccountTitle: "Konto löschen?",
      deleteAccountWarning:
        "Dies löscht dauerhaft alle Ihre Briefe, Antwortentwürfe und hochgeladenen Dateien und kündigt ein aktives Abo sofort. Das kann nicht rückgängig gemacht werden.",
      deleteAccountConfirmLabel: "Geben Sie zur Bestätigung DELETE ein",
      deleteAccountConfirmCta: "Mein Konto löschen",
      deleteAccountDeleting: "Wird gelöscht…",
      deleteAccountSuccessToast: "Ihr Konto und alle zugehörigen Daten wurden gelöscht.",
      deleteAccountFailed: "Ihr Konto konnte nicht gelöscht werden.",
      deleteAccountFailedRecovery: "Versuchen Sie es gleich noch einmal, oder schreiben Sie an hello@papkram.de.",
      deleteAccountUnauthenticated: "Sie müssen angemeldet sein, um Ihr Konto zu löschen.",
    },
    cookieConsent: {
      ariaLabel: "Cookie-Zustimmung",
      message: "Wir verwenden Analyse-Cookies, um zu verstehen, wie Papkram genutzt wird. Ihre hochgeladenen Briefe verwenden wir dafür nie.",
      accept: "Akzeptieren",
      decline: "Ablehnen",
    },
    welcome: {
      heading: "Sie sind dabei.",
      body: "Wir schreiben Ihnen, sobald Papkram vollständig startet.",
      shareHeading: "Kennen Sie jemanden, der verwirrende deutsche Post bekommt?",
      shareTwitter: "Auf X teilen",
      shareWhatsapp: "Auf WhatsApp teilen",
      shareCopyLink: "Link kopieren",
      sharePoster: "Poster teilen",
      linkCopiedToast: "Link kopiert.",
      linkCopyFailed: "Der Link konnte nicht kopiert werden — markieren und kopieren Sie ihn stattdessen manuell.",
      shareTweetText: "Papkram übersetzt verwirrende deutsche Post in klare Sprache, mit Fristen und einer versandfertigen Antwort.",
      shareWhatsappText: "Ich nutze Papkram, um verwirrende deutsche Post zu verstehen — einen Blick wert:",
      posterCaptionText:
        "Ich fürchte mich nicht mehr vor deutscher Post. Papkram liest den Brief, sagt mir, was wirklich drinsteht, weist mich auf die Frist hin und entwirft meine Antwort — die ersten 4 Briefe kostenlos.",
      posterPreparingToast: "Ihr Poster wird vorbereitet…",
      posterShareFailed: "Das Poster konnte nicht geteilt werden — versuchen Sie es erneut, oder kopieren Sie stattdessen den Link.",
      posterFallbackToast: "Poster heruntergeladen und Text kopiert — bereit zum Einfügen in Instagram, TikTok oder WhatsApp.",
      continueButton: "Weiter zum Dashboard",
    },
  },
  uk: {
    header: {
      logo: "Papkram",
      backToDashboard: "Назад до панелі",
      backToHome: "На головну",
    },
    nav: {
      navLabel: "Основна навігація",
      history: "Історія",
      upload: "Завантажити",
      deadlines: "Терміни",
      settings: "Налаштування",
    },
    auth: {
      emailLabel: "Електронна пошта",
      passwordLabel: "Пароль",
      login: {
        heading: "З поверненням",
        subhead: "Увійдіть, щоб переглянути історію ваших листів.",
        submitting: "Вхід…",
        submit: "Увійти",
        noAccount: "Вперше тут?",
        startTrialLink: "Почати безкоштовну пробну версію",
      },
      signup: {
        heading: (n) => `${n} листів безкоштовно, картка не потрібна`,
        subhead: "Створіть акаунт, щоб почати читати вашу німецьку пошту зрозумілою мовою.",
        submitting: "Створення акаунта…",
        submit: "Почати безкоштовну пробну версію",
        haveAccount: "Вже маєте акаунт?",
        loginLink: "Увійти",
        newsletterOptInLabel: "Повідомте мене, коли Papkram запуститься повністю.",
      },
      errors: {
        enterEmailPassword: "Введіть вашу електронну пошту та пароль.",
        enterPassword: "Введіть ваш пароль",
        invalidCredentials: "Ця електронна пошта та пароль не збігаються.",
        invalidCredentialsRecovery: "Перевірте, чи немає помилок, або скиньте пароль.",
        checkEmailPassword: "Перевірте вашу електронну пошту та пароль.",
        passwordTooShort: "Пароль має містити щонайменше 8 символів",
        emailInUse: "Акаунт із такою електронною поштою вже існує.",
        emailInUseRecovery: "Спробуйте натомість увійти.",
        weakPassword: "Цей пароль надто слабкий.",
        weakPasswordRecovery: "Використайте щонайменше 8 символів — літери та цифри.",
        signupNoUser: "Реєстрація не повернула користувача.",
        signupNoUserRecovery: "Спробуйте ще раз за мить.",
        accountSetupFailed: "Ваш акаунт створено, але налаштування не вдалося.",
        accountSetupFailedRecovery: "Спробуйте увійти — якщо це повторюється, зверніться до підтримки.",
        unexpectedError: "Щось пішло не так.",
        unexpectedErrorRecovery: "Спробуйте ще раз за мить.",
        tooManyAttempts: "Забагато спроб.",
        tooManyAttemptsRecovery: "Зачекайте кілька хвилин і спробуйте ще раз.",
      },
    },
    onboarding: {
      heading: "Яка мова вам підходить?",
      subhead:
        "Кожен підсумок, термін і чернетка відповіді будуть написані цією мовою. Ви можете змінити її будь-коли в панелі керування.",
      choose: "Обрати",
      savingToast: "Зберігаємо вашу мову…",
      savedToast: "Збережено",
      unsupportedLanguage: "Мова не підтримується.",
      saveFailed: "Не вдалося зберегти вибрану мову.",
      saveFailedRecovery: "Спробуйте ще раз.",
    },
    senderCategories: {
      authority: "Установа",
      insurer: "Страхова компанія",
      bank: "Банк",
      landlord: "Орендодавець",
      utility: "Комунальні послуги",
      school: "Школа",
      delivery: "Доставка",
      other: "Інше",
    },
    dashboard: {
      uploadButton: "Завантажити лист",
      yourLetters: "Ваші листи",
      emptyTitle: "Поки що немає листів",
      emptyDescription:
        "Завантажте свій перший німецький лист, щоб отримати підсумок зрозумілою мовою, терміни та готову до надсилання відповідь.",
      unlimitedBadge: "Необмежена кількість листів",
      lettersUsed: (used, limit) => `Використано ${used} з ${limit} безкоштовних листів`,
      lettersUsedDemo: (used, limit) => `Використано ${used} з ${limit} демо-листів`,
      unlockCta: (price) => `Відкрийте необмежену кількість листів за ${price}/рік.`,
      analysisPending: "Аналіз триває…",
      manageSubscription: "Керувати підпискою",
      openingPortal: "Відкриваємо…",
      portalError: "Не вдалося відкрити портал оплати.",
      subscriptionActiveToast: "Підписку активовано — необмежена кількість листів відкрита!",
      errorTitle: "Не вдалося завантажити вашу панель",
      errorRecovery: "Зазвичай це тимчасово. Спробуйте ще раз за мить.",
      nextUpHeading: "Далі",
      actionRequiredBadge: "Потрібна дія",
      noActionBadge: "Дія не потрібна",
      filtersTrigger: "Фільтри",
      filterAll: "Усі",
      filterActionNeeded: "Потрібна дія",
      filterNoAction: "Дія не потрібна",
      filterByCategory: "Категорія",
      filterEmptyTitle: "Немає листів, що відповідають цим фільтрам",
      filterEmptyDescription: "Спробуйте іншу комбінацію або скиньте всі фільтри, щоб знову побачити всі листи.",
      clearFilters: "Скинути фільтри",
      sortBy: "Сортувати за",
      sortNewest: "Спочатку нові",
      sortOldest: "Спочатку старі",
      sortDeadline: "Найближчий термін",
    },
    upload: {
      heading: "Завантажити лист",
      subhead:
        "Підійде і фото, і PDF. Ми прочитаємо його й повернемося з підсумком зрозумілою мовою, термінами (якщо є) і готовою до надсилання відповіддю.",
      dropTitle: "Перетягніть сюди фото або PDF",
      dropSubtitle: "або натисніть, щоб вибрати файл",
      analyzeLetter: "Проаналізувати лист",
      readingTitle: "Читаємо ваш лист…",
      readingSubtitle: "Зазвичай це займає кілька секунд.",
      readingStages: [
        { title: "Читаємо ваш лист…", subtitle: "Зазвичай це займає кілька секунд." },
        { title: "Виокремлюємо деталі…", subtitle: "Терміни, суми та відправника." },
        { title: "Готуємо чернетку відповіді…", subtitle: "Ще трохи." },
      ],
      preparingPhoto: "Готуємо фото…",
      dismiss: "Закрити",
      fileTooLarge: "Цей файл завеликий.",
      fileTooLargePdfRecovery: "Спробуйте менший PDF або натомість фото листа.",
      fileTooLargeImageRecovery: "Спробуйте інше фото — воно залишається завеликим навіть після стиснення.",
      unsupportedFileType: "Підтримуються лише файли JPEG, PNG або PDF.",
      uploadFailed: "Завантаження не вдалося — спробуйте ще раз.",
      uploadFailedRecovery: "Перевірте з'єднання. Якщо файл дуже великий, спробуйте менше фото.",
      analysisFailed: "Аналіз не вдався — спробуйте ще раз.",
      analysisFailedRecovery: "Перевірте з'єднання і спробуйте завантажити знову.",
      pleaseLoginAgain: "Будь ласка, увійдіть знову.",
      chooseFileFirst: "Спершу виберіть файл для завантаження.",
      accountLoadFailed: "Не вдалося завантажити ваш акаунт.",
      accountLoadFailedRecovery: "Спробуйте ще раз.",
      trialLimitReached: (limit) => `Ви використали всі ${limit} безкоштовних листів.`,
      trialLimitReachedRecovery: (price) => `Відкрийте необмежену кількість листів за ${price}/рік.`,
      dailyLimitReached: "Ви досягли сьогоднішнього ліміту листів.",
      dailyLimitReachedRecovery: "Спробуйте завтра, або зв'яжіться з нами, якщо потрібно більше.",
      tooManyAttempts: "Забагато завантажень за короткий час.",
      tooManyAttemptsRecovery: "Зачекайте кілька хвилин і спробуйте ще раз.",
      letterSaveFailed: "Ваш лист проаналізовано, але не вдалося зберегти.",
      letterSaveFailedRecovery: "Спробуйте завантажити знову.",
    },
    letters: {
      analysisComplete: "Аналіз завершено",
      summary: "Підсумок",
      deadlines: "Терміни",
      worthChecking: "Варто перевірити",
      lowConfidenceWarning:
        "Ми не були повністю впевнені, що цей лист прочитано правильно — фото чи скан могли бути нечіткими. Перевірте все нижче, перш ніж діяти.",
      deadlineCount: (n) => `${n} ${n === 1 ? "термін" : "термінів"}`,
      riskFlagCount: (n) => `${n} варто перевірити`,
      yourReplyInGerman: "Ваша відповідь німецькою",
      readyToSend: "Готова до надсилання як є — отримувач читає німецькою.",
      redrafting: "Переписуємо…",
      replyRedraftedToast: "Відповідь переписано",
      showTranslation: (language) => `Показати переклад мовою ${language}`,
      hideTranslation: (language) => `Сховати переклад мовою ${language}`,
      copyReply: "Копіювати відповідь",
      copied: "Скопійовано",
      copiedToast: "Відповідь скопійовано",
      copyFailedToast: "Не вдалося скопіювати — виділіть і скопіюйте текст вручну.",
      moreOptions: "Ще варіанти",
      viewOriginalLetter: "Переглянути завантажений лист",
      shareSummary: "Поділитися підсумком",
      openOriginalFailedToast: "Не вдалося відкрити лист — спробуйте ще раз.",
      summaryCopiedToast: "Підсумок скопійовано",
      summaryWatermark: "— Підсумовано Papkram · papkram.de",
      letterExplainerWithDate: (sender, date) => `Цей лист від ${sender}, датований ${date}.`,
      letterExplainerWithoutDate: (sender) => `Цей лист від ${sender}.`,
      replyToneGroupLabel: "Тон відповіді",
      notFoundTitle: "Ми не можемо знайти цей лист",
      notFoundDescription: "Можливо, його видалено, або посилання не належить вашому акаунту.",
      couldntFindLetter: "Не вдалося знайти цей лист.",
      draftedButNotSaved: "Чернетку створено, але нову відповідь не вдалося зберегти.",
      errorTitle: "Не вдалося завантажити цей лист",
      errorRecovery: "Зазвичай це тимчасово. Спробуйте ще раз за мить.",
      keyFactsHeading: "Звідки це відомо",
      paymentsHeading: "Платіж",
      appointmentsHeading: "Зустріч",
      actionRequiredBadge: "Потрібна дія",
      noActionBadge: "Дія не потрібна",
      actionRequiredDescription: "Цей лист потребує вашої відповіді.",
      noActionDescription: "Тут нічого робити — просто для ваших записів.",
      translatingBanner: (language) => `Перекладаємо цей лист мовою ${language}…`,
      translationFailedToast: "Не вдалося перекласти цей лист.",
      translationFailedRecovery: "Він досі тут мовою оригіналу — спробуйте ще раз.",
      wizard: {
        stepIntentHeading: "Що ви хочете сказати?",
        stepFollowUpHeading: "Ще кілька деталей",
        requestTimeQuestion: "До якого часу ви зможете це зробити?",
        requestTimeOptionPlusOneMonth: "За 1 місяць",
        requestTimeOptionPlusTwoMonths: "За 2 місяці",
        requestTimeOptionInstalments: "Частинами",
        requestTimeCustomDateLabel: "Вибрати іншу дату",
        objectQuestion: "Що саме неправильно?",
        objectPlaceholder: "Опишіть своїми словами, що не так.",
        clarifyQuestion: "Що ви хочете запитати?",
        clarifyPlaceholder: "Введіть ваше запитання.",
        continueButton: "Продовжити",
        backButton: "Назад",
        editAnswerButton: "Редагувати відповідь",
        sendByEmailButton: "Надіслати електронною поштою",
        mailtoSubject: "Моя відповідь",
        answerByDate: (date) => `Я зможу зробити це до ${date}.`,
        answerInstalments: "Я хотів(ла) би домовитися про оплату частинами.",
        answerRequired: "Додайте відповідь, щоб продовжити.",
        answerNotUnderstood: "Ми не зовсім зрозуміли — спробуйте сформулювати інакше.",
        generatingReply: "Готуємо чернетку відповіді…",
      },
    },
    paywall: {
      badge: "Безкоштовний період завершено",
      heading: (limit) => `Ви використали всі ${limit} безкоштовних листів`,
      description: (price, interval) =>
        `Відкрийте необмежену кількість листів за ${price}/${interval === "year" ? "рік" : "місяць"} — скасувати можна будь-коли в панелі керування.`,
      planToggle: { yearly: "Щорічно — найвигідніше", monthly: "Щомісяця" },
      redirecting: "Перенаправляємо…",
      subscribe: (price, interval) => `Підписатися — ${price}/${interval === "year" ? "рік" : "місяць"}`,
      checkoutError: "Не вдалося розпочати оформлення оплати.",
      earlyAccessConsent:
        "Я хочу отримати необмежений доступ негайно. Я розумію, що можу відмовитися протягом 14 днів, але тоді буду винен(на) пропорційну суму за вже використаний доступ.",
      earlyAccessConsentRequired: "Підтвердьте це, щоб продовжити.",
    },
    demoLimit: {
      badge: "Демоверсію завершено",
      heading: (limit) => `Ви використали всі ${limit} демо-листів.`,
      body: "Це був повний досвід — завантаження, підсумок зрозумілою мовою, терміни, готова до надсилання відповідь. Ми напишемо вам на пошту, коли відбудеться запуск.",
      backToDashboard: "Назад до панелі",
    },
    languageSwitcher: {
      ariaLabel: "Мова аналізу",
      updatedToast: "Мову оновлено",
    },
    legal: {
      privacy: {
        title: "Політика конфіденційності",
        sections: [
          {
            heading: "Що ми зберігаємо",
            body: "Коли ви завантажуєте лист, ми зберігаємо оригінальне зображення чи PDF, аналіз, який ми на його основі створюємо (підсумок, терміни, чернетку відповіді, позначки ризику), та обрану вами мову. Це зберігається в приватному сховищі та записах бази даних, пов'язаних із вашим акаунтом — доступ до ваших листів маєте лише ви.",
          },
          {
            heading: "Як обробляється ваш лист",
            body: "Вміст завантаженого листа надсилається до Gemini API компанії Google для створення аналізу. Google бере участь у рамковій угоді EU-US Data Privacy Framework, яка є правовою підставою для цієї передачі даних. Ми не використовуємо ваші листи для навчання жодної моделі. Ми ніколи не показуємо необроблений розпізнаний текст ні вам, ні будь-кому іншому — лише структурований підсумок, терміни та чернетку відповіді.",
          },
          {
            heading: "Хто ще працює з вашими даними",
            body: "Кілька спеціалізованих постачальників обробляють дані від нашого імені, кожен для однієї конкретної мети: Supabase (база даних і зберігання файлів), Resend (надсилання листів електронною поштою), PostHog (аналітика продукту, лише якщо ви погодилися на банер cookie-файлів), Sentry (відстеження помилок) і Vercel (хостинг). Жоден з них не може використовувати ваші дані для чогось, окрім надання цієї послуги нам.",
          },
          {
            heading: "Платежі",
            body: "Оплату підписки обробляє Stripe. Ми ніколи не бачимо і не зберігаємо дані вашої картки — Stripe обробляє й зберігає їх напряму.",
          },
          {
            heading: "Як довго ми зберігаємо ваші дані",
            body: "Ми зберігаємо ваш акаунт і листи, доки ви не видалите акаунт (миттєво, у Налаштуваннях) або не попросите нас видалити його електронною поштою. Наразі немає автоматичного видалення після періоду бездіяльності.",
          },
          {
            heading: "Ваші права",
            body: "Ви можете видалити свій акаунт і всі пов'язані листи будь-коли в Налаштуваннях — це відбувається миттєво і незворотно. Якщо ви не хочете робити це самостійно або маєте інше запитання щодо ваших даних, напишіть нам на",
          },
        ],
      },
      terms: {
        title: "Умови надання послуг",
        sections: [
          {
            heading: "Що це за сервіс",
            body: () =>
              "Papkram аналізує німецькомовні поштові листи та створює підсумок зрозумілою мовою, виявлення термінів і чернетку відповіді. Це інструмент для читання й складання відповіді, а не юридична, податкова чи фінансова консультація.",
          },
          {
            heading: "Точність не гарантована",
            body: () =>
              "ШІ-аналіз може неправильно прочитати суми, дати чи контекст, особливо з фото низької якості. Коли ми не впевнені, ми це позначаємо — але завжди перевіряйте самостійно все, що стосується грошей, законних термінів чи офіційних зобов'язань, перш ніж діяти.",
          },
          {
            heading: "Безкоштовний період і оплата",
            body: (limit, price) =>
              `Нові акаунти отримують ${limit} безкоштовних аналізів листів без картки. Далі підписка вартістю ${price} на рік відкриває необмежену кількість аналізів. Оплата стягується щорічно через Stripe; скасуйте будь-коли в панелі керування, і доступ збережеться до кінця поточного розрахункового періоду. [ПДВ: чи включає ця ціна ПДВ, залежить від нашого податкового статусу реєстрації, буде уточнено до запуску.]`,
          },
          {
            heading: "Право на відмову (Widerrufsrecht)",
            body: () =>
              "Якщо ви оформлюєте підписку як споживач, ви можете відмовитися від неї протягом 14 днів після оформлення, без пояснення причин. Надішліть на hello@papkram.de чітку датовану заяву про відмову — форма не обов'язкова, хоча зразок наведено нижче. Необмежений доступ починається одразу після оформлення підписки на ваш запит; якщо ви відмовитеся до завершення 14 днів, ви будете винні пропорційну суму за вже використані дні доступу, а решту ми повернемо.",
          },
          {
            heading: "Зразок форми відмови (Muster-Widerrufsformular)",
            body: () =>
              "Кому: [Юридична назва оператора], [Адреса оператора], hello@papkram.de\nЦим я/ми повідомляю(ємо) про відмову від договору на підписку Papkram.\nДата замовлення: __________\nІм'я споживача(ів): __________\nАдреса споживача(ів): __________\nДата: __________",
          },
          {
            heading: "Припинення дії акаунта",
            body: () =>
              "Ви можете будь-коли запросити видалення акаунта, написавши на hello@papkram.de, або видалити його самостійно в Налаштуваннях. Ми можемо призупиняти дію акаунтів, які використовуються для зловживання сервісом (наприклад, масове завантаження вмісту, що не є листами).",
          },
          {
            heading: "Відповідальність",
            body: () =>
              "Ми не несемо відповідальності за втрати, пов'язані з покладанням на згенерований ШІ підсумок чи чернетку відповіді без незалежної перевірки всього, що стосується грошей, термінів чи юридичних зобов'язань — див. «Точність не гарантована» вище. Поза цим наша відповідальність обмежена сумою підписки, яку ви сплатили за 12 місяців до подання претензії, крім випадків, коли закон не допускає такого обмеження — наприклад, у разі умислу, грубої недбалості чи шкоди життю, тілу або здоров'ю.",
          },
          {
            heading: "Застосовне право",
            body: () =>
              "Ці умови регулюються законодавством Федеративної Республіки Німеччина. Якщо ви споживач, це не позбавляє вас захисту, наданого обов'язковим законодавством країни вашого постійного проживання. Місце ведення діяльності [Юридична назва оператора] є місцем юрисдикції для спорів із бізнес-клієнтами.",
          },
        ],
      },
    },
    deadlines: {
      heading: "Терміни",
      emptyTitle: "Поки що немає термінів",
      emptyDescription: "Завантажте лист, і всі терміни, згадані в ньому, з'являться тут, найближчі спочатку.",
      uploadCta: "Завантажити лист",
      undatedLabel: "Без фіксованої дати",
      prevMonth: "Попередній місяць",
      nextMonth: "Наступний місяць",
      todayLabel: "Сьогодні",
      deadlineWordSingular: "термін",
      deadlineWordPlural: "терміни",
    },
    settings: {
      heading: "Налаштування",
      languageHeading: "Мова",
      languageDescription: "Кожен підсумок, термін і чернетка відповіді пишуться цією мовою.",
      subscriptionHeading: "Підписка",
      subscriptionActive: "У вас необмежена кількість листів.",
      subscriptionFree: "Ви користуєтеся безкоштовним пробним періодом.",
      demoNotice: "Papkram наразі є безкоштовною демоверсією. Ми повідомимо вас електронною поштою, коли відкриється повний доступ.",
      accountHeading: "Акаунт",
      senderInfoHeading: "Ваші дані",
      senderInfoDescription: "Додайте своє ім'я та поштову адресу один раз, і кожна чернетка відповіді використовуватиме їх як шапку листа — замість заповнювача, який вам довелося б вписувати вручну перед надсиланням.",
      fullNameLabel: "Повне ім'я",
      postalAddressLabel: "Поштова адреса",
      saveButton: "Зберегти",
      saving: "Зберігаємо…",
      senderInfoSavedToast: "Збережено",
      senderInfoSaveFailed: "Не вдалося зберегти ваші дані.",
      senderInfoSaveFailedRecovery: "Спробуйте ще раз.",
      senderInfoTooLong: "Це занадто довго — скоротіть, будь ласка, ім'я або адресу.",
      deleteAccountButton: "Видалити акаунт",
      deleteAccountTitle: "Видалити ваш акаунт?",
      deleteAccountWarning:
        "Це назавжди видалить усі ваші листи, чернетки відповідей і завантажені файли та негайно скасує будь-яку активну підписку. Це неможливо скасувати.",
      deleteAccountConfirmLabel: "Введіть DELETE для підтвердження",
      deleteAccountConfirmCta: "Видалити мій акаунт",
      deleteAccountDeleting: "Видаляємо…",
      deleteAccountSuccessToast: "Ваш акаунт і всі пов'язані дані видалено.",
      deleteAccountFailed: "Не вдалося видалити ваш акаунт.",
      deleteAccountFailedRecovery: "Спробуйте ще раз за мить або напишіть на hello@papkram.de.",
      deleteAccountUnauthenticated: "Щоб видалити акаунт, потрібно увійти.",
    },
    cookieConsent: {
      ariaLabel: "Згода на cookie-файли",
      message: "Ми використовуємо аналітичні cookie-файли, щоб розуміти, як використовується Papkram. Для цього ми ніколи не використовуємо ваші завантажені листи.",
      accept: "Прийняти",
      decline: "Відхилити",
    },
    welcome: {
      heading: "Вас додано.",
      body: "Ми напишемо вам одразу, як тільки Papkram запуститься повністю.",
      shareHeading: "Знаєте когось, хто отримує заплутану німецьку пошту?",
      shareTwitter: "Поділитися в X",
      shareWhatsapp: "Поділитися у WhatsApp",
      shareCopyLink: "Копіювати посилання",
      sharePoster: "Поділитися постером",
      linkCopiedToast: "Посилання скопійовано.",
      linkCopyFailed: "Не вдалося скопіювати посилання — виділіть і скопіюйте його вручну.",
      shareTweetText: "Papkram перекладає заплутану німецьку пошту зрозумілою мовою, з термінами та готовою до надсилання відповіддю.",
      shareWhatsappText: "Я користуюся Papkram, щоб розбиратися в заплутаній німецькій пошті — варто глянути:",
      posterCaptionText:
        "Я більше не боюся німецької пошти. Papkram читає лист, пояснює, що там насправді написано, нагадує про термін і готує мою відповідь — перші 4 листи безкоштовно.",
      posterPreparingToast: "Готуємо ваш постер…",
      posterShareFailed: "Не вдалося поділитися постером — спробуйте ще раз або скопіюйте посилання.",
      posterFallbackToast: "Постер завантажено, а текст скопійовано — готово для вставки в Instagram, TikTok або WhatsApp.",
      continueButton: "Перейти до панелі",
    },
  },
};
