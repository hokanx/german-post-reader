/**
 * Hand-written ar/tr translations of the seed letters, used to fill in
 * scripts/.seed-translations.json where translate-seed-letters.ts (real
 * Gemini calls) couldn't finish because the Gemini free tier's daily quota
 * (20 requests/day, shared across the whole API key) ran out partway
 * through. Same shape/order as LETTERS in src/lib/seed/letters-data.ts —
 * index i here corresponds to LETTERS[i]. `null` means "don't override the
 * cache" (already filled in by a real translateLetterContent() call).
 *
 * amount/date/source_quote are never included here — those fields are
 * never translated (see CLAUDE.md AI pipeline rules), so merge-manual-
 * translations.ts always takes them from the original English seed data.
 */

type ManualLetter = {
  summary: string;
  deadlineDescriptions: string[];
  riskFlags: string[];
  paymentDescriptions: string[];
  appointmentDescriptions: string[];
  keyFactLabels: string[];
  keyFactValues: string[];
  replyDraftTranslation: string;
};

export const AR: (ManualLetter | null)[] = [
  null, // 0 Stadtwerke München — already translated via Gemini
  null, // 1 Techniker Krankenkasse — already translated via Gemini
  null, // 2 Finanzamt München — already translated via Gemini
  null, // 3 Hausverwaltung Schmidt — already translated via Gemini
  null, // 4 Ausländerbehörde Berlin — already translated via Gemini
  null, // 5 ARD ZDF Beitragsservice — already translated via Gemini
  null, // 6 Deutsche Rentenversicherung Bund — already translated via Gemini
  {
    // 7 Jobcenter Berlin Mitte
    summary:
      "يحتاج مركز التوظيف (Jobcenter) إلى إثبات محدّث لحالتك الوظيفية الحالية لمواصلة معالجة ملفك.",
    deadlineDescriptions: ["تقديم مستندات التوظيف المحدثة"],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["الموعد النهائي للتقديم"],
    keyFactValues: ["20 فبراير 2026"],
    replyDraftTranslation:
      "السادة Jobcenter Berlin Mitte المحترمون،\n\nأؤكد بهذا أنني سأقوم بتقديم مستندات التوظيف الحالية المطلوبة بحلول 20 فبراير 2026. سأوفر الأوراق المطلوبة في أقرب وقت ممكن.\n\nمع خالص التحيات،",
  },
  {
    // 8 Bürgeramt Friedrichshain-Kreuzberg
    summary:
      "تأكيد بأن تسجيل عنوانك (Anmeldung) قد تمت معالجته بنجاح. يُرجى الاحتفاظ بهذا لسجلاتك.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "السادة مكتب الأحوال المدنية (Bürgeramt) المحترمون،\n\nأشكركم على تأكيد تسجيل عنواني. لا حاجة لأي إجراء إضافي من جانبي.\n\nمع خالص التحيات،",
  },
  {
    // 9 Sparkasse Berlin
    summary:
      "يُخطرك بنكك بتغيير في جدول رسوم الحساب سيبدأ سريانه اعتباراً من الربع القادم.",
    deadlineDescriptions: ["دخول رسوم الحساب الجديدة حيز التنفيذ"],
    riskFlags: [
      "كان مبلغ الرسم الشهري الجديد مطبوعاً بخط صغير ومحجوباً جزئياً بسبب طية في الخطاب — يُرجى تأكيد الرقم الدقيق مباشرة مع فرعك.",
    ],
    paymentDescriptions: ["رسم الحساب الشهري الجديد"],
    appointmentDescriptions: [],
    keyFactLabels: ["تاريخ السريان"],
    keyFactValues: ["1 أبريل 2026"],
    replyDraftTranslation:
      "السادة Sparkasse Berlin المحترمون،\n\nأحيط علماً بجدول الرسوم الجديد الساري اعتباراً من 1 أبريل 2026، وليس لدي أي اعتراض.\n\nمع خالص التحيات،",
  },
  {
    // 10 DHL Paket
    summary:
      "فشلت محاولة تسليم طرد بينما كنت خارج المنزل. يتم الاحتفاظ به في نقطة استلام DHL محلية لمدة 7 أيام.",
    deadlineDescriptions: ["استلام الطرد من نقطة استلام DHL"],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["الموعد النهائي للاستلام"],
    keyFactValues: ["6 فبراير 2026"],
    replyDraftTranslation:
      "لا يلزم الرد على هذا الإشعار. يُرجى إحضار بطاقة الاستلام وبطاقة هوية إلى محطة DHL Packstation بحلول 6 فبراير 2026.",
  },
  {
    // 11 Grundschule am Rathaus
    summary:
      "تُبلغك مدرسة طفلك باجتماع أولياء الأمور والمعلمين القادم وتطلب منك تأكيد موعد.",
    deadlineDescriptions: ["تأكيد موعد اجتماع أولياء الأمور والمعلمين"],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["الموعد النهائي للتأكيد"],
    keyFactValues: ["12 فبراير 2026"],
    replyDraftTranslation:
      "السادة مدرسة Grundschule am Rathaus المحترمون،\n\nأشكركم على الدعوة لاجتماع أولياء الأمور والمعلمين. أود تأكيد حضوري وأطلب تحديد موعد مناسب بحلول 12 فبراير 2026.\n\nمع خالص التحيات،",
  },
  {
    // 12 HUK-COBURG Kfz-Versicherung
    summary:
      "إشعار تجديد تأمين سيارتك — يرتفع القسط السنوي قليلاً بسبب تعديل في السعر الإقليمي.",
    deadlineDescriptions: ["دخول التجديد حيز التنفيذ وتطبيق القسط الجديد"],
    riskFlags: [],
    paymentDescriptions: ["القسط السنوي الجديد"],
    appointmentDescriptions: [],
    keyFactLabels: ["تاريخ التجديد"],
    keyFactValues: ["15 مارس 2026"],
    replyDraftTranslation:
      "السادة HUK-COBURG المحترمون،\n\nأحيط علماً بالقسط الجديد لتجديد الوثيقة اعتباراً من 15 مارس 2026 وسأستمر في الخطة الحالية.\n\nمع خالص التحيات،",
  },
  {
    // 13 Vodafone Kabel Deutschland
    summary:
      "يُخطرك مزود خدمة الإنترنت بانتهاء الخصم الترويجي، وستزداد فاتورتك الشهرية.",
    deadlineDescriptions: ["بدء التسعير القياسي بعد انتهاء الفترة الترويجية"],
    riskFlags: [],
    paymentDescriptions: ["السعر الشهري الجديد بعد انتهاء العرض الترويجي"],
    appointmentDescriptions: [],
    keyFactLabels: ["بداية التسعير القياسي"],
    keyFactValues: ["1 مارس 2026"],
    replyDraftTranslation:
      "السادة Vodafone المحترمون،\n\nأشكركم على إبلاغي بانتهاء الخصم الترويجي على باقة الإنترنت الخاصة بي قبل 1 مارس 2026. يُرجى إعلامي في حال توفر أي عروض حالية للاحتفاظ بالعميل.\n\nمع خالص التحيات،",
  },
  {
    // 14 Handwerker Elektro Meier
    summary: "فاتورة عن أعمال إصلاح كهربائية تم تنفيذها في شقتك الشهر الماضي.",
    deadlineDescriptions: ["دفع فاتورة الأعمال الكهربائية المكتملة"],
    riskFlags: [],
    paymentDescriptions: ["المبلغ المستحق للفاتورة"],
    appointmentDescriptions: [],
    keyFactLabels: ["الموعد النهائي للفاتورة"],
    keyFactValues: ["25 فبراير 2026"],
    replyDraftTranslation:
      "السادة Elektro Meier المحترمون،\n\nأشكركم على إتمام أعمال الإصلاح. أؤكد استلام الفاتورة وسأقوم بالدفع قبل 25 فبراير 2026.\n\nمع خالص التحيات،",
  },
  {
    // 15 Stadtreinigung Berlin (BSR)
    summary:
      "إشعار بزيادة طفيفة في رسم جمع النفايات السنوي، تسري اعتباراً من فاتورتك القادمة.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: ["رسم جمع النفايات السنوي الجديد"],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "السادة BSR المحترمون،\n\nأحيط علماً بالرسم الجديد لجمع النفايات وليس لدي أي استفسارات في الوقت الحالي.\n\nمع خالص التحيات،",
  },
  {
    // 16 AOK Nordost
    summary:
      "يدعوك مزود التأمين الصحي الخاص بك إلى فحص صحي وقائي مجاني متاح مرة كل عامين.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "السادة AOK Nordost المحترمون،\n\nأشكركم على الدعوة للفحص الصحي الوقائي. أود تحديد موعد حسب التوفر.\n\nمع خالص التحيات،",
  },
  {
    // 17 Amtsgericht Berlin-Mitte
    summary:
      "يُطلب منك المثول كشاهد في قضية مدنية بسيطة. هذا استدعاء قضائي رسمي، وليس غرامة أو اتهاماً موجهاً إليك.",
    deadlineDescriptions: [],
    riskFlags: [
      "هذا استدعاء قانوني رسمي — كان رقم قاعة المحكمة صعب القراءة من الصورة. يُرجى تأكيد رقم القاعة قبل موعد المثول.",
    ],
    paymentDescriptions: [],
    appointmentDescriptions: ["المثول كشاهد"],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "السادة محكمة Amtsgericht Berlin-Mitte المحترمون،\n\nأؤكد استلام استدعاء الشهادة الخاص بتاريخ 10 مارس 2026 وسأحضر كما هو مطلوب. يُرجى إعلامي في حال وجود مستندات يجب إحضارها.\n\nمع خالص التحيات،",
  },
  {
    // 18 Techem Energy Services
    summary:
      "كشف حساب تكلفة التدفئة السنوي من شركة قياس عدادات المبنى. هذا للعلم فقط ويُظهر حصتك من تكاليف تدفئة المبنى.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: ["حصتك من تكاليف التدفئة"],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "السادة Techem المحترمون،\n\nأشكركم على كشف حساب تكلفة التدفئة السنوي. راجعت الأرقام وليس لدي أي استفسارات.\n\nمع خالص التحيات،",
  },
  {
    // 19 Deutsche Post — Nachsendeauftrag
    summary:
      "تأكيد بأن طلب إعادة توجيه بريدك إلى عنوانك الجديد قد تم إعداده بنجاح.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "السادة Deutsche Post المحترمون،\n\nأشكركم على تأكيد طلب إعادة توجيه بريدي. لا حاجة لأي إجراء إضافي.\n\nمع خالص التحيات،",
  },
];

export const TR: (ManualLetter | null)[] = [
  {
    // 0 Stadtwerke München
    summary:
      "2025 yılı elektrik yıllık hesap özetiniz, aylık ödemelerinizin karşıladığından daha fazla enerji tükettiğinizi gösteriyor. 187,42 € ek ödeme borcunuz bulunuyor.",
    deadlineDescriptions: ["187,42 € bakiyeyi Stadtwerke München'e ödeyin"],
    riskFlags: [],
    paymentDescriptions: ["Borçlu olduğunuz tutar"],
    appointmentDescriptions: [],
    keyFactLabels: ["Ödeme son tarihi"],
    keyFactValues: ["28 Şubat 2026"],
    replyDraftTranslation:
      "Sayın Stadtwerke München yetkilileri,\n\n15 Ocak 2026 tarihli elektrik faturanızın alındığını bu yazıyla onaylıyorum. Belirtilen hesaba 187,42 € tutarındaki bakiyeyi son ödeme tarihinden önce göndereceğim.\n\nSaygılarımla,",
  },
  {
    // 1 Techniker Krankenkasse
    summary:
      "Sağlık sigortanız, bildirdiğiniz gelirde değişiklik olduğu için aylık katkı payınızın 1 Mart 2026 tarihinden itibaren artacağını onaylıyor.",
    deadlineDescriptions: ["Yeni katkı payı tutarı yürürlüğe girer"],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["Yürürlük tarihi"],
    keyFactValues: ["1 Mart 2026"],
    replyDraftTranslation:
      "Sayın Techniker Krankenkasse yetkilileri,\n\n1 Mart 2026 tarihinden itibaren geçerli olacak yeni katkı payı oranı hakkındaki bilgilendirme için teşekkür ederim. Herhangi bir itirazım yok ve ödemeye mevcut otomatik ödeme talimatıyla devam edeceğim.\n\nSaygılarımla,",
  },
  {
    // 2 Finanzamt München
    summary:
      "Vergi dairesi, 2025 yılı gelir vergisi beyannamenize ait belgeleri talep ediyor. Yanıt vermezseniz, ödemeniz gereken vergiyi kendileri tahmin edebilir — bu tahmin genellikle gerçek tutardan daha yüksek olur.",
    deadlineDescriptions: ["2025 vergi beyannamesi belgelerini gönderin"],
    riskFlags: [
      "Mektupta kısmen okunaksız olan bir referans numarasından bahsediliyor — bunun Finanzamt ile önceki yazışmalarınızla eşleştiğini kontrol edin.",
    ],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["Gönderim son tarihi", "Vergi yılı"],
    keyFactValues: ["15 Nisan 2026", "2025"],
    replyDraftTranslation:
      "Sayın Finanzamt München yetkilileri,\n\n2025 yılına ait gelir vergisi beyannamemi hazırlamaktayım ve 15 Nisan 2026 son tarihine kadar göndereceğim. Bu süre zarfında ek belge gerekirse lütfen bana bildirin.\n\nSaygılarımla,",
  },
  {
    // 3 Hausverwaltung Schmidt
    summary:
      "Ev sahibinizin yönetim şirketi, binanızda yapılacak rutin bir gaz kaloriferi denetimi hakkında sizi bilgilendiriyor.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: ["Kalorifer denetimi"],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın Hausverwaltung Schmidt yetkilileri,\n\n10 Şubat 2026 tarihindeki kalorifer denetimi bildirimi için teşekkür ederim. Girişe izin vermek üzere evde bulunacağımı onaylıyorum.\n\nSaygılarımla,",
  },
  {
    // 4 Ausländerbehörde Berlin
    summary:
      "Göçmenlik dairesi, oturma izninizin süresi dolmadan önce yenileme için randevu almanızı istiyor.",
    deadlineDescriptions: ["Oturma izni süresi doluyor — bu tarihten önce yenileyin"],
    riskFlags: [
      "Son geçerlilik tarihi netti, ancak mektupta fotoğraftan okunamayan bir randevu alma portalı bağlantısına da atıfta bulunuluyor — doğru URL için orijinal mektubu kontrol edin.",
    ],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["Oturma izni bitiş tarihi"],
    keyFactValues: ["20 Mayıs 2026"],
    replyDraftTranslation:
      "Sayın Ausländerbehörde Berlin yetkilileri,\n\n20 Mayıs 2026 tarihinde sona erecek oturma iznim hakkında yazıyorum. Yenileme sürecini başlatmak için mümkün olan en kısa sürede bir randevu almak istiyorum.\n\nSaygılarımla,",
  },
  {
    // 5 ARD ZDF Beitragsservice
    summary:
      "Bu, zorunlu Alman yayın ücretinizin (Rundfunkbeitrag) kaydınızı ve üç aylık ödeme tutarınızı onaylayan resmi bildirimdir.",
    deadlineDescriptions: ["Üç aylık yayın ücreti ödemesi son tarihi"],
    riskFlags: [],
    paymentDescriptions: ["Üç aylık yayın ücreti"],
    appointmentDescriptions: [],
    keyFactLabels: ["Ödeme son tarihi"],
    keyFactValues: ["15 Şubat 2026"],
    replyDraftTranslation:
      "Sayın Beitragsservice yetkilileri,\n\nRundfunkbeitrag kaydımın onay yazısını aldığımı bildiririm ve üç aylık tutarın ödemesini 15 Şubat 2026 tarihinden önce gerçekleştireceğim.\n\nSaygılarımla,",
  },
  {
    // 6 Deutsche Rentenversicherung Bund
    summary:
      "Yıllık emeklilik katkı payı bildiriminiz — bu yalnızca bilgilendirme amaçlıdır ve şimdiye kadar emekliliğinize ne kadar ödendiğini gösterir. Herhangi bir işlem gerekmiyor.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın Deutsche Rentenversicherung yetkilileri,\n\nYıllık emeklilik katkı payı bildirimi için teşekkür ederim. Bilgileri inceledim ve şu an için herhangi bir sorum bulunmuyor.\n\nSaygılarımla,",
  },
  {
    // 7 Jobcenter Berlin Mitte
    summary:
      "Jobcenter, davanızın işlenmeye devam edebilmesi için güncel istihdam durumunuza dair güncellenmiş bir kanıt talep ediyor.",
    deadlineDescriptions: ["Güncellenmiş istihdam belgelerini gönderin"],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["Gönderim son tarihi"],
    keyFactValues: ["20 Şubat 2026"],
    replyDraftTranslation:
      "Sayın Jobcenter Berlin Mitte yetkilileri,\n\nTalep edilen güncel istihdam belgelerini 20 Şubat 2026 tarihine kadar göndereceğimi bu yazıyla onaylıyorum. Belgeleri mümkün olan en kısa sürede sağlayacağım.\n\nSaygılarımla,",
  },
  {
    // 8 Bürgeramt Friedrichshain-Kreuzberg
    summary:
      "Adres kaydınızın (Anmeldung) başarıyla işlendiğine dair onay. Bunu kayıtlarınız için saklayın.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın Bürgeramt yetkilileri,\n\nAdres kaydımın onaylandığı için teşekkür ederim. Benim tarafımdan başka bir işlem gerekmemektedir.\n\nSaygılarımla,",
  },
  {
    // 9 Sparkasse Berlin
    summary:
      "Bankanız, gelecek çeyrekten itibaren geçerli olacak hesap ücret tarifesindeki bir değişikliği size bildiriyor.",
    deadlineDescriptions: ["Yeni hesap ücretleri yürürlüğe girer"],
    riskFlags: [
      "Yeni aylık ücret tutarı küçük punto ile basılmış ve mektuptaki bir katlanma nedeniyle kısmen görünmüyordu — kesin rakamı doğrudan şubenizle teyit edin.",
    ],
    paymentDescriptions: ["Yeni aylık hesap ücreti"],
    appointmentDescriptions: [],
    keyFactLabels: ["Yürürlük tarihi"],
    keyFactValues: ["1 Nisan 2026"],
    replyDraftTranslation:
      "Sayın Sparkasse Berlin yetkilileri,\n\n1 Nisan 2026 tarihinden itibaren geçerli olacak yeni ücret tarifesini not ettim ve herhangi bir itirazım bulunmuyor.\n\nSaygılarımla,",
  },
  {
    // 10 DHL Paket
    summary:
      "Siz evde yokken bir paket teslimat denemesi başarısız oldu. Paket, 7 gün boyunca yerel bir DHL teslim alma noktasında bekletiliyor.",
    deadlineDescriptions: ["Paketi DHL teslim alma noktasından teslim alın"],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["Teslim alma son tarihi"],
    keyFactValues: ["6 Şubat 2026"],
    replyDraftTranslation:
      "Bu yazışma için bir yanıt gerekmemektedir. Teslim alma kartını ve kimliğinizi 6 Şubat 2026 tarihine kadar DHL Packstation'a götürün.",
  },
  {
    // 11 Grundschule am Rathaus
    summary:
      "Çocuğunuzun okulu, yaklaşan veli-öğretmen görüşmesi hakkında sizi bilgilendiriyor ve bir zaman dilimini onaylamanızı istiyor.",
    deadlineDescriptions: ["Veli-öğretmen görüşmesi zaman dilimini onaylayın"],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: ["Onay son tarihi"],
    keyFactValues: ["12 Şubat 2026"],
    replyDraftTranslation:
      "Sayın Grundschule am Rathaus yetkilileri,\n\nVeli-öğretmen görüşmesine davetiniz için teşekkür ederim. Katılımımı onaylamak istiyor ve 12 Şubat 2026 tarihine kadar uygun bir randevu rica ediyorum.\n\nSaygılarımla,",
  },
  {
    // 12 HUK-COBURG Kfz-Versicherung
    summary:
      "Araç sigortası yenileme bildiriminiz — bölgesel oran ayarlaması nedeniyle yıllık priminiz hafifçe artıyor.",
    deadlineDescriptions: ["Yenileme yürürlüğe girer, yeni prim uygulanır"],
    riskFlags: [],
    paymentDescriptions: ["Yeni yıllık prim"],
    appointmentDescriptions: [],
    keyFactLabels: ["Yenileme tarihi"],
    keyFactValues: ["15 Mart 2026"],
    replyDraftTranslation:
      "Sayın HUK-COBURG yetkilileri,\n\n15 Mart 2026 tarihinden itibaren geçerli olacak poliçe yenileme priminin güncellendiğini not ettim ve mevcut plan ile devam edeceğim.\n\nSaygılarımla,",
  },
  {
    // 13 Vodafone Kabel Deutschland
    summary:
      "İnternet sağlayıcınız, promosyon indiriminizin sona erdiğini ve aylık faturanızın artacağını bildiriyor.",
    deadlineDescriptions: ["Promosyon dönemi sona erdikten sonra standart fiyatlandırma başlar"],
    riskFlags: [],
    paymentDescriptions: ["Promosyon sona erdikten sonra yeni aylık ücret"],
    appointmentDescriptions: [],
    keyFactLabels: ["Standart fiyatlandırma başlangıcı"],
    keyFactValues: ["1 Mart 2026"],
    replyDraftTranslation:
      "Sayın Vodafone yetkilileri,\n\nİnternet tarifemdeki promosyon indiriminin 1 Mart 2026 tarihinden önce sona erdiği bilgisi için teşekkür ederim. Şu anda geçerli sözleşme yenileme teklifleri olup olmadığını bildirmenizi rica ederim.\n\nSaygılarımla,",
  },
  {
    // 14 Handwerker Elektro Meier
    summary: "Geçen ay dairenizde tamamlanan elektrik onarım işi için bir fatura.",
    deadlineDescriptions: ["Tamamlanan elektrik işi için faturayı ödeyin"],
    riskFlags: [],
    paymentDescriptions: ["Ödenecek fatura tutarı"],
    appointmentDescriptions: [],
    keyFactLabels: ["Fatura son ödeme tarihi"],
    keyFactValues: ["25 Şubat 2026"],
    replyDraftTranslation:
      "Sayın Elektro Meier yetkilileri,\n\nOnarım işini tamamladığınız için teşekkür ederim. Faturayı onaylıyorum ve ödemeyi 25 Şubat 2026 tarihinden önce gerçekleştireceğim.\n\nSaygılarımla,",
  },
  {
    // 15 Stadtreinigung Berlin (BSR)
    summary:
      "Yıllık atık toplama ücretinizde, bir sonraki faturanızla birlikte geçerli olacak küçük bir artış bildirimi.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: ["Yeni yıllık atık toplama ücreti"],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın BSR yetkilileri,\n\nGüncellenen atık toplama ücretini not ettim ve şu an için herhangi bir sorum bulunmuyor.\n\nSaygılarımla,",
  },
  {
    // 16 AOK Nordost
    summary:
      "Sağlık sigortanız, her iki yılda bir sunulan ücretsiz koruyucu sağlık kontrolüne sizi davet ediyor.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın AOK Nordost yetkilileri,\n\nKoruyucu sağlık kontrolüne davetiniz için teşekkür ederim. Uygun bir zamanda randevu almak istiyorum.\n\nSaygılarımla,",
  },
  {
    // 17 Amtsgericht Berlin-Mitte
    summary:
      "Küçük bir hukuk davasında tanık olarak hazır bulunmanız isteniyor. Bu resmi bir mahkeme celbidir, size karşı bir ceza veya suçlama değildir.",
    deadlineDescriptions: [],
    riskFlags: [
      "Bu resmi bir hukuki celptir — fotoğraftan tam mahkeme salonu numarasını okumak zordu. Duruşma tarihinden önce salon numarasını teyit edin.",
    ],
    paymentDescriptions: [],
    appointmentDescriptions: ["Tanık olarak hazır bulunun"],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın Amtsgericht Berlin-Mitte yetkilileri,\n\n10 Mart 2026 tarihli tanık celbinin alındığını onaylıyorum ve talep edildiği şekilde hazır bulunacağım. Getirilmesi gereken belgeler varsa lütfen bana bildirin.\n\nSaygılarımla,",
  },
  {
    // 18 Techem Energy Services
    summary:
      "Binanızın sayaç okuma şirketinden yıllık ısıtma maliyeti hesap özetiniz. Bu bilgilendirme amaçlıdır ve binanın ısıtma maliyetlerindeki payınızı gösterir.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: ["Isıtma maliyetlerindeki payınız"],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın Techem yetkilileri,\n\nYıllık ısıtma maliyeti hesap özeti için teşekkür ederim. Rakamları inceledim ve herhangi bir sorum bulunmuyor.\n\nSaygılarımla,",
  },
  {
    // 19 Deutsche Post — Nachsendeauftrag
    summary: "Yeni adresinize posta yönlendirme talimatınızın başarıyla ayarlandığına dair onay.",
    deadlineDescriptions: [],
    riskFlags: [],
    paymentDescriptions: [],
    appointmentDescriptions: [],
    keyFactLabels: [],
    keyFactValues: [],
    replyDraftTranslation:
      "Sayın Deutsche Post yetkilileri,\n\nPosta yönlendirme talimatımın onaylandığı için teşekkür ederim. Benim tarafımdan başka bir işlem gerekmemektedir.\n\nSaygılarımla,",
  },
];
