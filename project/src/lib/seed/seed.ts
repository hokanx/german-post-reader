/**
 * Dev/local seed script — populates a demo account with realistic letters
 * so the dashboard is never built against an empty table. Run with
 * `npm run seed`. Idempotent: re-running clears and re-inserts the demo
 * user's letters rather than duplicating them.
 */
import path from "node:path";
import { faker } from "@faker-js/faker";
import { createClient } from "@supabase/supabase-js";
import type { SenderCategory } from "../letters/types";

process.loadEnvFile(path.resolve(__dirname, "../../../.env.local"));

faker.seed(42);

const DEMO_EMAIL = "demo@germanpostreader.app";
const DEMO_PASSWORD = "DemoAccount123!";

type SeedLetter = {
  sender: string;
  sender_category: SenderCategory;
  summary: string;
  deadlines: { date: string; description: string }[];
  payments: { description: string; amount: string; source_quote: string }[];
  appointments: { description: string; date: string; source_quote: string }[];
  key_facts: { label: string; value: string; source_quote: string }[];
  action_required: boolean;
  /** Always German — matches the real pipeline's contract (see CLAUDE.md Stripe/AI pipeline rules). */
  reply_draft: string;
  /** English translation of reply_draft, shown behind the "show translation" toggle. */
  reply_draft_translation: string;
  risk_flags: string[];
};

const LETTERS: SeedLetter[] = [
  {
    sender: "Stadtwerke München",
    sender_category: "utility",
    summary:
      "Your 2025 electricity annual statement shows you used more power than your monthly payments covered. You owe an extra 187,42 €.",
    deadlines: [{ date: "2026-02-28", description: "Pay the 187,42 € balance to Stadtwerke München" }],
    payments: [
      { description: "Amount you owe", amount: "187,42 €", source_quote: "Nachzahlung: 187,42 €" },
    ],
    appointments: [],
    key_facts: [
      { label: "Payment deadline", value: "28. Februar 2026", source_quote: "fällig zum 28.02.2026" },
    ],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nhiermit bestätige ich den Erhalt Ihrer Stromabrechnung vom 15. Januar 2026. Ich werde den ausstehenden Betrag von 187,42 € fristgerecht auf das angegebene Konto überweisen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Stadtwerke München,\n\nI am writing to confirm receipt of your electricity settlement dated 15 January 2026. I will transfer the outstanding amount of 187,42 € to the account provided before the due date.\n\nKind regards,",
    risk_flags: [],
  },
  {
    sender: "Techniker Krankenkasse",
    sender_category: "insurer",
    summary:
      "Your health insurer confirms your monthly contribution is increasing from 1 March 2026 because your reported income changed.",
    deadlines: [{ date: "2026-03-01", description: "New contribution amount takes effect" }],
    payments: [],
    appointments: [],
    key_facts: [
      { label: "Effective date", value: "1. März 2026", source_quote: "mit Wirkung zum 01.03.2026" },
    ],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Mitteilung über den neuen Beitragssatz ab dem 1. März 2026. Ich habe keine Einwände und werde die Zahlung wie gewohnt per Lastschrift fortsetzen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Techniker Krankenkasse,\n\nThank you for informing me of the updated contribution amount effective 1 March 2026. I have no objection and will continue payment via the existing direct debit.\n\nBest regards,",
    risk_flags: [],
  },
  {
    sender: "Finanzamt München",
    sender_category: "authority",
    summary:
      "The tax office is requesting your 2025 income tax return documents. If you don't respond, they may estimate your tax owed themselves — which is usually higher than the real amount.",
    deadlines: [{ date: "2026-04-15", description: "Submit 2025 tax return documents" }],
    payments: [],
    appointments: [],
    key_facts: [
      { label: "Submission deadline", value: "15. April 2026", source_quote: "Frist: 15.04.2026" },
      { label: "Tax year", value: "2025", source_quote: "Einkommensteuererklärung 2025" },
    ],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nich bereite derzeit meine Einkommensteuererklärung für 2025 vor und werde diese fristgerecht bis zum 15. April 2026 einreichen. Bitte teilen Sie mir mit, falls in der Zwischenzeit weitere Unterlagen erforderlich sind.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Finanzamt München,\n\nI am preparing my 2025 income tax return and will submit it before the deadline of 15 April 2026. Please let me know if any additional documentation is required in the meantime.\n\nSincerely,",
    risk_flags: [
      "The letter mentions a reference number that was partially unreadable in the photo — double-check it matches your previous correspondence with the Finanzamt.",
    ],
  },
  {
    sender: "Vermieter — Hausverwaltung Schmidt",
    sender_category: "landlord",
    summary:
      "Your landlord's property management company is notifying you of a routine gas heating inspection in your building.",
    deadlines: [],
    payments: [],
    appointments: [
      { description: "Heating inspection", date: "2026-02-10", source_quote: "Die Überprüfung findet am 10.02.2026 statt" },
    ],
    key_facts: [],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Ankündigung der Heizungsinspektion am 10. Februar 2026. Ich bestätige, dass ich anwesend sein werde, um den Zugang zu ermöglichen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Hausverwaltung Schmidt,\n\nThank you for the notice regarding the heating inspection on 10 February 2026. I confirm I will be present to allow access.\n\nKind regards,",
    risk_flags: [],
  },
  {
    sender: "Ausländerbehörde Berlin",
    sender_category: "authority",
    summary:
      "The immigration office is asking you to book an appointment to renew your residence permit before it expires.",
    deadlines: [{ date: "2026-05-20", description: "Residence permit expires — renew before this date" }],
    payments: [],
    appointments: [],
    key_facts: [
      { label: "Permit expiry date", value: "20. Mai 2026", source_quote: "Ihr Aufenthaltstitel läuft am 20.05.2026 ab" },
    ],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen bezüglich meines Aufenthaltstitels, der am 20. Mai 2026 abläuft. Ich möchte so schnell wie möglich einen Termin zur Verlängerung vereinbaren.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Ausländerbehörde Berlin,\n\nI am writing regarding my residence permit expiring on 20 May 2026. I would like to book an appointment to begin the renewal process as soon as possible.\n\nBest regards,",
    risk_flags: [
      "The expiry date was clear, but the letter also references an appointment booking portal link that couldn't be read from the photo — check the physical letter for the correct URL.",
    ],
  },
  {
    sender: "ARD ZDF Deutschlandradio Beitragsservice",
    sender_category: "authority",
    summary:
      "This is the mandatory German broadcasting fee (Rundfunkbeitrag) confirming your registration and quarterly payment amount.",
    deadlines: [{ date: "2026-02-15", description: "Quarterly broadcasting fee payment due" }],
    payments: [
      { description: "Quarterly broadcasting fee", amount: "18,36 €", source_quote: "vierteljährlicher Beitrag: 18,36 €" },
    ],
    appointments: [],
    key_facts: [
      { label: "Payment deadline", value: "15. Februar 2026", source_quote: "fällig am 15.02.2026" },
    ],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nhiermit bestätige ich den Erhalt der Anmeldebestätigung für den Rundfunkbeitrag und werde die Zahlung des vierteljährlichen Betrags bis zum 15. Februar 2026 veranlassen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Beitragsservice,\n\nI confirm receipt of my Rundfunkbeitrag registration and will arrange payment of the quarterly amount before 15 February 2026.\n\nKind regards,",
    risk_flags: [],
  },
  {
    sender: "Deutsche Rentenversicherung Bund",
    sender_category: "authority",
    summary:
      "Your annual pension contribution statement — this is informational only and shows how much has been paid into your pension so far. No action needed.",
    deadlines: [],
    payments: [],
    appointments: [],
    key_facts: [],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die jährliche Renteninformation. Ich habe die Angaben geprüft und habe derzeit keine Rückfragen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Deutsche Rentenversicherung,\n\nThank you for the annual statement of my pension contributions. I have reviewed it and have no questions at this time.\n\nBest regards,",
    risk_flags: [],
  },
  {
    sender: "Jobcenter Berlin Mitte",
    sender_category: "authority",
    summary:
      "The Jobcenter needs updated proof of your current employment status to continue processing your case.",
    deadlines: [{ date: "2026-02-20", description: "Submit updated employment documents" }],
    payments: [],
    appointments: [],
    key_facts: [
      { label: "Submission deadline", value: "20. Februar 2026", source_quote: "bis zum 20.02.2026 einzureichen" },
    ],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nhiermit bestätige ich, dass ich die angeforderten aktuellen Beschäftigungsnachweise bis zum 20. Februar 2026 einreichen werde. Ich werde die Unterlagen so schnell wie möglich zur Verfügung stellen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Jobcenter Berlin Mitte,\n\nPlease find my request to submit updated employment documentation before 20 February 2026. I will provide the requested paperwork as soon as possible.\n\nSincerely,",
    risk_flags: [],
  },
  {
    sender: "Bürgeramt Friedrichshain-Kreuzberg",
    sender_category: "authority",
    summary:
      "Confirmation that your address registration (Anmeldung) was successfully processed. Keep this for your records.",
    deadlines: [],
    payments: [],
    appointments: [],
    key_facts: [],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Bestätigung meiner Anmeldung. Von meiner Seite ist keine weitere Handlung erforderlich.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Bürgeramt,\n\nThank you for confirming my address registration. No further action is needed from my side.\n\nBest regards,",
    risk_flags: [],
  },
  {
    sender: "Sparkasse Berlin",
    sender_category: "bank",
    summary:
      "Your bank is notifying you of a change to their account fee schedule starting next quarter.",
    deadlines: [{ date: "2026-04-01", description: "New account fees take effect" }],
    payments: [
      { description: "New monthly account fee", amount: "4,90 €", source_quote: "neue monatliche Kontoführungsgebühr: 4,90 €" },
    ],
    appointments: [],
    key_facts: [
      { label: "Effective date", value: "1. April 2026", source_quote: "gültig ab dem 01.04.2026" },
    ],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nich nehme die neue Gebührenordnung, die ab dem 1. April 2026 gilt, zur Kenntnis und habe keine Einwände.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Sparkasse Berlin,\n\nI acknowledge the updated fee schedule taking effect on 1 April 2026 and have no objection.\n\nKind regards,",
    risk_flags: [
      "The new monthly fee amount was printed in a small font and partly obscured by a fold in the letter — confirm the exact figure directly with your branch.",
    ],
  },
  {
    sender: "DHL Paket",
    sender_category: "delivery",
    summary:
      "A parcel delivery attempt failed while you were out. It's being held at a local DHL pickup point for 7 days.",
    deadlines: [{ date: "2026-02-06", description: "Collect parcel from DHL pickup point" }],
    payments: [],
    appointments: [],
    key_facts: [
      { label: "Pickup deadline", value: "6. Februar 2026", source_quote: "Abholung bis 06.02.2026 möglich" },
    ],
    action_required: true,
    reply_draft:
      "Für dieses Schreiben ist keine Antwort erforderlich. Bringen Sie die Abholkarte und einen Ausweis bis zum 6. Februar 2026 zur DHL-Packstation.",
    reply_draft_translation:
      "No reply needed — this is a pickup notice. Bring the card and ID to the DHL pickup point before 6 February 2026.",
    risk_flags: [],
  },
  {
    sender: "Grundschule am Rathaus",
    sender_category: "school",
    summary:
      "Your child's school is informing you about the upcoming parent-teacher conference and asking you to confirm a time slot.",
    deadlines: [{ date: "2026-02-12", description: "Confirm parent-teacher conference time slot" }],
    payments: [],
    appointments: [],
    key_facts: [
      { label: "Confirmation deadline", value: "12. Februar 2026", source_quote: "Bitte bestätigen Sie bis zum 12.02.2026" },
    ],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Einladung zum Elternsprechtag. Ich möchte hiermit meine Teilnahme bestätigen und bitte um einen passenden Termin bis zum 12. Februar 2026.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Grundschule am Rathaus,\n\nThank you for the invitation to the parent-teacher conference. I would like to confirm my attendance and request a suitable time slot before 12 February 2026.\n\nKind regards,",
    risk_flags: [],
  },
  {
    sender: "HUK-COBURG Kfz-Versicherung",
    sender_category: "insurer",
    summary:
      "Your car insurance renewal notice — the annual premium is increasing slightly due to a regional rate adjustment.",
    deadlines: [{ date: "2026-03-15", description: "Renewal takes effect, new premium applies" }],
    payments: [
      { description: "New annual premium", amount: "412,50 €", source_quote: "neue Jahresprämie: 412,50 €" },
    ],
    appointments: [],
    key_facts: [
      { label: "Renewal date", value: "15. März 2026", source_quote: "Verlängerung zum 15.03.2026" },
    ],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nich nehme die neue Prämie für die Vertragsverlängerung ab dem 15. März 2026 zur Kenntnis und werde den bestehenden Tarif fortführen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear HUK-COBURG,\n\nI acknowledge the updated premium for my policy renewal effective 15 March 2026 and will continue with the existing plan.\n\nBest regards,",
    risk_flags: [],
  },
  {
    sender: "Vodafone Kabel Deutschland",
    sender_category: "utility",
    summary:
      "Your internet provider is notifying you that your promotional discount is ending, and your monthly bill will increase.",
    deadlines: [{ date: "2026-03-01", description: "Standard pricing begins after promotional period ends" }],
    payments: [
      { description: "New monthly price after the promotion ends", amount: "39,99 €", source_quote: "regulärer monatlicher Preis: 39,99 €" },
    ],
    appointments: [],
    key_facts: [
      { label: "Standard pricing starts", value: "1. März 2026", source_quote: "ab dem 01.03.2026" },
    ],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Information, dass der Rabatt auf meinen Internettarif zum 1. März 2026 endet. Bitte teilen Sie mir mit, ob aktuell besondere Angebote zur Vertragsverlängerung verfügbar sind.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Vodafone,\n\nThank you for informing me that the promotional discount on my internet plan ends before 1 March 2026. Please let me know if there are any current retention offers available.\n\nKind regards,",
    risk_flags: [],
  },
  {
    sender: "Handwerker Elektro Meier",
    sender_category: "other",
    summary:
      "An invoice for electrical repair work completed in your apartment last month.",
    deadlines: [{ date: "2026-02-25", description: "Pay invoice for completed electrical work" }],
    payments: [
      { description: "Invoice amount due", amount: "245,80 €", source_quote: "Rechnungsbetrag: 245,80 €" },
    ],
    appointments: [],
    key_facts: [
      { label: "Invoice due", value: "25. Februar 2026", source_quote: "Zahlbar bis 25.02.2026" },
    ],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Durchführung der Reparaturarbeiten. Ich bestätige die Rechnung und werde die Zahlung bis zum 25. Februar 2026 veranlassen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Elektro Meier,\n\nThank you for completing the repair work. I confirm the invoice and will arrange payment before 25 February 2026.\n\nBest regards,",
    risk_flags: [],
  },
  {
    sender: "Stadtreinigung Berlin (BSR)",
    sender_category: "utility",
    summary:
      "Notice of a small increase to your annual waste collection fee, effective with your next invoice.",
    deadlines: [],
    payments: [
      { description: "New annual waste collection fee", amount: "186,00 €", source_quote: "neue Jahresgebühr: 186,00 €" },
    ],
    appointments: [],
    key_facts: [],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nich nehme die neue Gebühr für die Abfallentsorgung zur Kenntnis und habe derzeit keine Rückfragen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear BSR,\n\nI acknowledge the updated waste collection fee and have no questions at this time.\n\nKind regards,",
    risk_flags: [],
  },
  {
    sender: "AOK Nordost",
    sender_category: "insurer",
    summary:
      "Your health insurer is inviting you to a free preventive health checkup available once every two years.",
    deadlines: [],
    payments: [],
    appointments: [],
    key_facts: [],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Einladung zur Vorsorgeuntersuchung. Ich möchte gerne einen Termin nach Verfügbarkeit vereinbaren.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear AOK Nordost,\n\nThank you for the invitation to the preventive health checkup. I would like to schedule an appointment at my convenience.\n\nBest regards,",
    risk_flags: [],
  },
  {
    sender: "Amtsgericht Berlin-Mitte",
    sender_category: "authority",
    summary:
      "You are being asked to appear as a witness in a minor civil case. This is a formal court summons, not a fine or accusation against you.",
    deadlines: [],
    payments: [],
    appointments: [
      { description: "Appear as a witness", date: "2026-03-10", source_quote: "Sie werden geladen für den 10.03.2026" },
    ],
    key_facts: [],
    action_required: true,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nhiermit bestätige ich den Erhalt der Zeugenladung für den 10. März 2026 und werde wie gewünscht erscheinen. Bitte teilen Sie mir mit, falls Unterlagen mitzubringen sind.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Amtsgericht Berlin-Mitte,\n\nI confirm receipt of the witness summons for 10 March 2026 and will attend as requested. Please advise if any documents should be brought.\n\nSincerely,",
    risk_flags: [
      "This is a formal legal summons — the exact courtroom number was hard to read from the photo. Confirm the room number before your appearance date.",
    ],
  },
  {
    sender: "Techem Energy Services",
    sender_category: "utility",
    summary:
      "Your annual heating cost statement from the building's metering company. This is informational and shows your share of the building's heating costs.",
    deadlines: [],
    payments: [
      { description: "Your share of the heating costs", amount: "312,45 €", source_quote: "Ihr Anteil: 312,45 €" },
    ],
    appointments: [],
    key_facts: [],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die jährliche Heizkostenabrechnung. Ich habe die Angaben geprüft und habe keine Rückfragen.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Techem,\n\nThank you for the annual heating cost statement. I have reviewed the figures and have no questions.\n\nKind regards,",
    risk_flags: [],
  },
  {
    sender: "Deutsche Post — Nachsendeauftrag",
    sender_category: "delivery",
    summary:
      "Confirmation that your mail forwarding order to your new address has been set up successfully.",
    deadlines: [],
    payments: [],
    appointments: [],
    key_facts: [],
    action_required: false,
    reply_draft:
      "Sehr geehrte Damen und Herren,\n\nvielen Dank für die Bestätigung meines Nachsendeauftrags. Von meiner Seite ist keine weitere Handlung erforderlich.\n\nMit freundlichen Grüßen,",
    reply_draft_translation:
      "Dear Deutsche Post,\n\nThank you for confirming my mail forwarding order. No further action is needed.\n\nBest regards,",
    risk_flags: [],
  },
];

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (check .env.local)");
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  console.log("Finding or creating demo user...");
  const { data: existingUsers } = await supabase.auth.admin.listUsers();
  let demoUser = existingUsers.users.find((u) => u.email === DEMO_EMAIL);

  if (!demoUser) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: DEMO_EMAIL,
      password: DEMO_PASSWORD,
      email_confirm: true,
    });
    if (error || !data.user) {
      throw new Error(`Failed to create demo user: ${error?.message}`);
    }
    demoUser = data.user;
    console.log(`Created demo user ${DEMO_EMAIL}`);
  } else {
    console.log(`Found existing demo user ${DEMO_EMAIL}`);
  }

  const userId = demoUser.id;

  await supabase.from("profiles").upsert({
    id: userId,
    language: "en",
    has_active_subscription: false,
    trial_letters_used: 1,
  });

  console.log("Clearing existing demo letters...");
  await supabase.from("letters").delete().eq("user_id", userId);

  console.log(`Inserting ${LETTERS.length} realistic letters...`);
  const rows = LETTERS.map((letter, i) => {
    const daysAgo = faker.number.int({ min: i * 2, max: i * 2 + 5 });
    const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const letterId = faker.string.uuid();
    return {
      id: letterId,
      user_id: userId,
      storage_path: `${userId}/${letterId}`,
      raw_ocr_text: null,
      summary: letter.summary,
      sender_name: letter.sender,
      sender_category: letter.sender_category,
      deadlines: letter.deadlines,
      payments: letter.payments,
      appointments: letter.appointments,
      key_facts: letter.key_facts,
      action_required: letter.action_required,
      reply_draft: letter.reply_draft,
      reply_draft_translation: letter.reply_draft_translation,
      detected_language_confirmed: true,
      risk_flags: letter.risk_flags,
      language: "en",
      created_at: createdAt,
    };
  });

  const { error: insertError } = await supabase.from("letters").insert(rows);
  if (insertError) {
    throw new Error(`Failed to insert letters: ${insertError.message}`);
  }

  console.log(`Seed complete. Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
