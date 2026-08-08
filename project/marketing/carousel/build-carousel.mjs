import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FONTS = fs.readFileSync(path.join(__dirname, 'fonts.css'), 'utf8');

/* ---------- lucide icons (stroke, currentColor) ---------- */
const ic = {
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<path d="M21.801 10A10 10 0 1 1 17 3.335"/><path d="m9 11 3 3L22 4"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  arrowDown: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  sparkles: '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .962 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.962 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
  fileText: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  languages: '<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  helpCircle: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>',
  send: '<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',
};
const icon = (name, size = 24, sw = 2) =>
  `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ic[name]}</svg>`;

/* Papkram wordmark: sticker square mark + grotesque wordmark */
const wordmark = (onDark = false) => `
  <div class="wm">
    <span class="wm-mark">${icon('mail', 26, 2.4)}</span>
    <span class="wm-text">Papkram</span>
  </div>`;

const counter = (i, n) => `<span class="counter">${String(i).padStart(2, '0')}<span class="counter-sep">/</span>${String(n).padStart(2, '0')}</span>`;

const dots = (i, n) =>
  `<div class="dots">${Array.from({ length: n }, (_, k) => `<span class="dot${k === i - 1 ? ' on' : ''}"></span>`).join('')}</div>`;

const swipe = (last) =>
  last
    ? `<div class="swipe end">${icon('sparkles', 22, 2.2)}<span>link in bio</span></div>`
    : `<div class="swipe"><span>swipe</span>${icon('arrowRight', 22, 2.4)}</div>`;

const kicker = (t) => `<span class="kicker">${t}</span>`;

/* ---------- slide bodies ---------- */
const SLIDES = [];

/* 1 — HOOK / the moment */
SLIDES.push({ variant: 'cream', body: `
  ${kicker('The moment')}
  <h1 class="h1">You got a letter<br>from the <span class="hl">Jobcenter.</span></h1>
  <p class="lead">You don't know if it's urgent.<br>You don't know if you're in trouble.<br>You don't know what happens if you ignore it.</p>
  <div class="letter" aria-hidden="true">
    <div class="lt-head">
      <span class="lt-emblem">${icon('mail',26,2.4)}</span>
      <div><div class="lt-agency">Jobcenter</div><div class="lt-sub">Bundesagentur für Arbeit</div></div>
    </div>
    <div class="lt-lines"><span></span><span></span><span></span><span></span></div>
    <div class="lt-stamp">Frist?</div>
  </div>
  <p class="punch">So it sits on the table. <span class="hl-ink">For days.</span></p>
`});

/* 2 — Google Translate fails */
SLIDES.push({ variant: 'cream', body: `
  ${kicker('You already tried')}
  <h1 class="h1">You ran it through<br><span class="hl">Google Translate.</span></h1>
  <div class="gt">
    <div class="gt-col">
      <div class="gt-label">${icon('languages',18,2.2)} German</div>
      <p class="gt-src">„Bitte legen Sie die angeforderten Unterlagen zur Wahrung Ihrer Mitwirkungspflicht fristgerecht vor."</p>
    </div>
    <div class="gt-arrow">${icon('arrowDown',26,2.6)}</div>
    <div class="gt-col out">
      <div class="gt-label">${icon('helpCircle',18,2.2)} Translated</div>
      <p class="gt-out">"Please submit the requested documents in due time to preserve your obligation to cooperate."</p>
      <div class="gt-tag">…and you still have no idea what to actually do.</div>
    </div>
  </div>
  <p class="punch">That's not a language problem.<br><span class="hl-ink">That's something else entirely.</span></p>
`});

/* 3 — written in code (DARK) */
SLIDES.push({ variant: 'ink', body: `
  ${kicker('Here\'s what nobody tells you')}
  <h1 class="h1">Jobcenter letters<br>aren't just German.</h1>
  <p class="lead">They're written in a completely different <span class="hl">code</span> — one that even fluent German speakers sometimes struggle to crack.</p>
  <div class="code-card">
    <div class="code-row"><span class="code-de">Mitwirkungspflicht</span> <span class="code-eq">=</span> <span class="code-en">do this or your money stops</span></div>
    <div class="code-row"><span class="code-de">Rechtsbehelfsbelehrung</span> <span class="code-eq">=</span> <span class="code-en">how to appeal — and by when</span></div>
    <div class="code-row"><span class="code-de">Eingliederungsvereinbarung</span> <span class="code-eq">=</span> <span class="code-en">rules you're now bound to</span></div>
  </div>
  <p class="punch">Translation gives you the words.<br><span class="hl">It doesn't give you the meaning.</span></p>
`});

/* 4 — the three things */
SLIDES.push({ variant: 'cream', body: `
  ${kicker('What actually matters')}
  <h1 class="h1">Buried in the legal<br>language, <span class="hl">three things.</span></h1>
  <div class="three">
    <div class="tri"><span class="tri-ic ink">${icon('checkCircle',30,2.2)}</span><div><b>What they're asking you to do</b><i>the actual action, in plain words</i></div></div>
    <div class="tri"><span class="tri-ic acc">${icon('clock',30,2.2)}</span><div><b>The exact deadline to do it by</b><i>the date that changes everything</i></div></div>
    <div class="tri"><span class="tri-ic warn">${icon('alert',30,2.2)}</span><div><b>What happens if you miss it</b><i>the consequence nobody spells out</i></div></div>
  </div>
  <p class="punch">A translator shows you sentences.<br><span class="hl-ink">It doesn't show you those three things.</span></p>
`});

/* 5 — the stakes */
SLIDES.push({ variant: 'cream', body: `
  ${kicker('Why the deadline matters')}
  <h1 class="h1">Missing one deadline<br>isn't just <span class="hl">stressful.</span></h1>
  <div class="ladder">
    <div class="rung"><span class="rung-n">01</span> It can trigger a formal warning.</div>
    <div class="rung"><span class="rung-n">02</span> It can pause your benefits.</div>
    <div class="rung"><span class="rung-n">03</span> It can start a process you didn't know was happening.</div>
  </div>
  <p class="punch">Not because you ignored the letter.<br>Because you genuinely couldn't read it.</p>
  <p class="reassure"><span class="hl-ink">That's not fair. And it's not your fault.</span></p>
`});

/* 6 — the real enemy (PURPLE) */
SLIDES.push({ variant: 'purple', body: `
  ${kicker('The real enemy')}
  <h1 class="h1">It isn't German.<br>It's <span class="hl-on-purple">the gap.</span></h1>
  <div class="gap">
    <div class="gap-side"><span class="gap-lbl">what the letter says</span><span class="gap-val">formal · legal · dense</span></div>
    <div class="gap-mid"><span class="gap-line"></span><span class="gap-word">gap</span><span class="gap-line"></span></div>
    <div class="gap-side"><span class="gap-lbl">what it actually means</span><span class="gap-val">what to do · by when · how to reply</span></div>
  </div>
  <p class="punch on-purple">That gap is what causes the dread.<br><span class="hl-on-purple">Close it, and the letter loses its power.</span></p>
`});

/* 7 — the reveal (product) */
SLIDES.push({ variant: 'cream', body: `
  ${kicker('The fix')}
  <h1 class="h1">Papkram was built<br>for exactly <span class="hl">this.</span></h1>
  <div class="app">
    <div class="app-top"><span class="app-chip">${icon('scan',18,2.2)} Letter uploaded</span><span class="app-time">0:47</span></div>
    <div class="app-sec">
      <span class="app-lbl">Summary · your language</span>
      <p class="app-sum">They need your updated rental contract by <b>22 Aug</b> to keep your benefits running. No payment, no fine — just one document.</p>
    </div>
    <div class="app-sec">
      <span class="app-lbl">Deadline</span>
      <div class="app-deadline">${icon('clock',20,2.4)} Reply by Fri, 22 Aug 2026</div>
    </div>
    <div class="app-sec">
      <span class="app-lbl">German reply · ready to send</span>
      <p class="app-reply">Sehr geehrte Damen und Herren, anbei übersende ich fristgerecht den angeforderten Mietvertrag …</p>
      <span class="app-sent">${icon('checkCircle',18,2.2)} Ready to send</span>
    </div>
  </div>
  <p class="punch">You don't write a single word of German.<br><span class="hl-ink">The letter is handled. Done.</span></p>
`});

/* 8 — CTA (PURPLE) */
SLIDES.push({ variant: 'purple', last: true, body: `
  ${kicker('One more thing')}
  <h1 class="h1 big">The next letter<br>doesn't have to<br>feel like <span class="hl-on-purple">that.</span></h1>
  <ul class="nomore">
    <li>${icon('check',22,2.6)} No more days of dread on the table.</li>
    <li>${icon('check',22,2.6)} No more calling a friend to translate.</li>
    <li>${icon('check',22,2.6)} No more guessing whether you got it right.</li>
  </ul>
  <div class="cta-row">
    <span class="cta-btn">Try Papkram — free ${icon('arrowRight',22,2.6)}</span>
    <span class="cta-sub">Just clarity. In 60 seconds.</span>
  </div>
`});

/* ---------- assemble ---------- */
const N = SLIDES.length;
const slidesHtml = SLIDES.map((s, k) => {
  const i = k + 1;
  return `
  <section class="slide ${s.variant}" id="s${i}">
    <div class="topbar">${wordmark(s.variant !== 'cream')}${counter(i, N)}</div>
    <div class="content">${s.body}</div>
    <div class="botbar">${dots(i, N)}${swipe(!!s.last)}</div>
    <span class="corner-sticker" aria-hidden="true">Papkram</span>
  </section>`;
}).join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
:root{
  --bg:#fff7ed; --fg:#1a0a2e; --primary:#7c3aed; --pfg:#ffffff;
  --accent:#fb923c; --muted:#fef3c7; --mutedfg:#6b21a8; --card:#ffffff;
  --shadow:#1a0a2e;
}
*{margin:0;padding:0;box-sizing:border-box}
body{background:#c9b8a0;font-family:'Inter',sans-serif}
.sheet{display:flex;flex-wrap:wrap;gap:40px;padding:40px}
.slide{
  width:1080px;height:1350px;position:relative;overflow:hidden;
  padding:92px 88px;display:flex;flex-direction:column;
  background:var(--bg);color:var(--fg);
}
.slide.ink{background:var(--fg);color:var(--bg)}
.slide.purple{background:var(--primary);color:var(--pfg)}

/* decorative background grain / blobs */
.slide::before{content:"";position:absolute;inset:0;pointer-events:none;
  background-image:radial-gradient(circle at 88% 8%, rgba(251,146,60,.16), transparent 42%),
                  radial-gradient(circle at 6% 96%, rgba(124,58,237,.10), transparent 40%);}
.slide.ink::before{background-image:radial-gradient(circle at 90% 10%, rgba(251,146,60,.20), transparent 45%),radial-gradient(circle at 4% 92%, rgba(124,58,237,.30), transparent 45%);}
.slide.purple::before{background-image:radial-gradient(circle at 88% 6%, rgba(251,146,60,.28), transparent 44%),radial-gradient(circle at 8% 98%, rgba(255,255,255,.10), transparent 42%);}

/* top / bottom bars */
.topbar,.botbar{display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}
.content{flex:1;display:flex;flex-direction:column;justify-content:center;gap:34px;position:relative;z-index:2;padding:20px 0}
.wm{display:flex;align-items:center;gap:16px}
.wm-mark{display:grid;place-items:center;width:58px;height:58px;border-radius:16px;
  background:var(--accent);color:var(--fg);border:3px solid var(--fg);
  box-shadow:5px 5px 0 0 var(--fg);transform:rotate(-3deg)}
.slide.ink .wm-mark,.slide.purple .wm-mark{box-shadow:5px 5px 0 0 rgba(0,0,0,.35)}
.wm-text{font-family:'Bricolage Grotesque';font-weight:800;font-size:38px;letter-spacing:-.02em}
.counter{font-family:'Bricolage Grotesque';font-weight:700;font-size:30px;letter-spacing:.02em;opacity:.75}
.counter-sep{margin:0 4px;opacity:.5}

.kicker{display:inline-flex;align-self:flex-start;align-items:center;
  font-weight:800;font-size:22px;letter-spacing:.14em;text-transform:uppercase;
  padding:12px 22px;border-radius:999px;border:3px solid var(--fg);
  background:var(--muted);color:var(--mutedfg);box-shadow:4px 4px 0 0 var(--fg)}
.slide.ink .kicker{background:transparent;color:var(--accent);border-color:var(--accent);box-shadow:4px 4px 0 0 var(--accent)}
.slide.purple .kicker{background:var(--accent);color:var(--fg);border-color:var(--fg);box-shadow:4px 4px 0 0 rgba(0,0,0,.35)}

.h1{font-family:'Bricolage Grotesque';font-weight:800;font-size:92px;line-height:.98;letter-spacing:-.03em}
.h1.big{font-size:100px}
.hl{color:var(--primary)}
.slide.ink .hl{color:var(--accent)}
.hl-ink{color:var(--fg);text-decoration:underline;text-decoration-color:var(--accent);text-decoration-thickness:8px;text-underline-offset:6px}
.hl-on-purple{color:var(--accent)}
.lead{font-size:38px;line-height:1.4;font-weight:500;max-width:none;opacity:.92}
.punch{font-family:'Bricolage Grotesque';font-weight:700;font-size:46px;line-height:1.14;letter-spacing:-.01em;margin-top:6px}
.punch.on-purple{color:#fff}
.reassure{font-size:36px;font-weight:600}

/* slide 1 letter */
.letter{position:relative;align-self:flex-start;width:540px;transform:rotate(-3.5deg);margin:10px 0 4px;
  background:var(--card);border:3px solid var(--fg);border-radius:20px;box-shadow:14px 14px 0 0 var(--fg);padding:34px 36px 40px}
.lt-head{display:flex;align-items:center;gap:18px;padding-bottom:22px;border-bottom:3px solid var(--fg)}
.lt-emblem{display:grid;place-items:center;width:64px;height:64px;flex:none;border-radius:14px;background:var(--muted);color:var(--mutedfg);border:3px solid var(--fg)}
.lt-agency{font-family:'Bricolage Grotesque';font-weight:800;font-size:36px;color:var(--mutedfg);line-height:1}
.lt-sub{font-size:20px;font-weight:600;color:#8a7a9e;margin-top:4px;letter-spacing:.02em}
.lt-lines{display:flex;flex-direction:column;gap:14px;margin-top:26px}
.lt-lines span{height:13px;border-radius:7px;background:#e9dcc4}
.lt-lines span:nth-child(1){width:82%}.lt-lines span:nth-child(2){width:94%}.lt-lines span:nth-child(3){width:88%}.lt-lines span:nth-child(4){width:60%}
.lt-stamp{position:absolute;right:-24px;bottom:-28px;transform:rotate(-9deg);
  font-family:'Bricolage Grotesque';font-weight:800;font-size:32px;color:#dc2626;
  border:4px solid #dc2626;border-radius:14px;padding:8px 20px;background:#fff;letter-spacing:.05em;box-shadow:5px 5px 0 0 rgba(220,38,38,.25)}

/* slide 2 google translate */
.gt{display:flex;flex-direction:column;gap:20px;align-self:stretch}
.gt-col{background:var(--card);border:3px solid var(--fg);border-radius:22px;padding:30px 32px;box-shadow:8px 8px 0 0 var(--fg)}
.gt-col.out{background:var(--muted)}
.gt-label{display:flex;align-items:center;gap:10px;font-weight:800;font-size:22px;letter-spacing:.06em;text-transform:uppercase;color:var(--mutedfg);margin-bottom:14px}
.gt-src{font-size:30px;line-height:1.35;font-weight:500;color:#4a3a5e}
.gt-out{font-size:30px;line-height:1.35;font-weight:500}
.gt-tag{margin-top:16px;font-family:'Bricolage Grotesque';font-weight:700;font-size:26px;color:var(--primary)}
.gt-arrow{align-self:center;color:var(--accent)}

/* slide 3 code card */
.code-card{background:rgba(255,255,255,.06);border:3px solid var(--accent);border-radius:22px;padding:34px 36px;display:flex;flex-direction:column;gap:22px;box-shadow:8px 8px 0 0 var(--accent)}
.code-row{display:flex;align-items:baseline;gap:16px;flex-wrap:wrap}
.code-de{font-family:'JetBrains Mono','Inter',monospace;font-weight:600;font-size:30px;color:var(--accent)}
.code-eq{font-size:30px;opacity:.5}
.code-en{font-size:30px;font-weight:600}

/* slide 4 three things */
.three{display:flex;flex-direction:column;gap:22px}
.tri{display:flex;align-items:center;gap:26px;background:var(--card);border:3px solid var(--fg);border-radius:22px;padding:28px 32px;box-shadow:8px 8px 0 0 var(--fg)}
.tri-ic{display:grid;place-items:center;width:80px;height:80px;border-radius:18px;border:3px solid var(--fg);flex:none}
.tri-ic.ink{background:var(--muted);color:var(--mutedfg)}
.tri-ic.acc{background:var(--accent);color:var(--fg)}
.tri-ic.warn{background:#fee2e2;color:#dc2626}
.tri b{display:block;font-family:'Bricolage Grotesque';font-weight:700;font-size:34px;line-height:1.1;letter-spacing:-.01em}
.tri i{display:block;font-style:normal;font-size:25px;font-weight:500;color:#6b5a7e;margin-top:6px}

/* slide 5 ladder */
.ladder{display:flex;flex-direction:column;gap:18px}
.rung{display:flex;align-items:center;gap:24px;font-size:34px;font-weight:600;line-height:1.2;
  background:var(--card);border:3px solid var(--fg);border-left:14px solid var(--accent);
  border-radius:18px;padding:26px 30px;box-shadow:7px 7px 0 0 var(--fg)}
.rung:nth-child(2){border-left-color:#f97316}
.rung:nth-child(3){border-left-color:#dc2626}
.rung-n{font-family:'Bricolage Grotesque';font-weight:800;font-size:38px;color:var(--accent);flex:none}
.rung:nth-child(3) .rung-n{color:#dc2626}

/* slide 6 gap */
.gap{display:flex;flex-direction:column;gap:0;align-self:stretch}
.gap-side{background:rgba(255,255,255,.10);border:3px solid #fff;border-radius:22px;padding:28px 34px;box-shadow:8px 8px 0 0 rgba(0,0,0,.25)}
.gap-lbl{display:block;font-weight:800;font-size:22px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)}
.gap-val{display:block;font-family:'Bricolage Grotesque';font-weight:700;font-size:38px;margin-top:8px;color:#fff}
.gap-mid{display:flex;align-items:center;gap:20px;padding:22px 8px}
.gap-line{height:4px;flex:1;background:repeating-linear-gradient(90deg,var(--accent) 0 18px,transparent 18px 34px)}
.gap-word{font-family:'Bricolage Grotesque';font-weight:800;font-size:30px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}

/* slide 7 app */
.app{background:var(--card);border:3px solid var(--fg);border-radius:30px;box-shadow:14px 14px 0 0 var(--fg);padding:34px 36px;display:flex;flex-direction:column;gap:22px}
.app-top{display:flex;align-items:center;justify-content:space-between}
.app-chip{display:inline-flex;align-items:center;gap:10px;font-weight:800;font-size:22px;letter-spacing:.04em;text-transform:uppercase;
  background:var(--primary);color:#fff;border:3px solid var(--fg);border-radius:999px;padding:12px 22px;box-shadow:4px 4px 0 0 var(--fg)}
.app-time{font-family:'JetBrains Mono','Inter',monospace;font-weight:600;font-size:26px;color:#6b5a7e}
.app-sec{display:flex;flex-direction:column;gap:10px;border-top:2px dashed #e5d9c3;padding-top:20px}
.app-sec:first-of-type{border-top:none;padding-top:0}
.app-lbl{font-weight:800;font-size:19px;letter-spacing:.1em;text-transform:uppercase;color:var(--mutedfg)}
.app-sum{font-size:29px;line-height:1.34;font-weight:500}
.app-sum b{color:var(--primary)}
.app-deadline{display:inline-flex;align-items:center;gap:12px;align-self:flex-start;font-family:'Bricolage Grotesque';font-weight:700;font-size:30px;
  background:var(--accent);color:var(--fg);border:3px solid var(--fg);border-radius:14px;padding:12px 22px;box-shadow:5px 5px 0 0 var(--fg)}
.app-reply{font-size:27px;line-height:1.32;font-weight:500;color:#4a3a5e;background:var(--muted);border-radius:14px;padding:20px 22px}
.app-sent{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:24px;color:#16a34a}

/* slide 8 cta */
.nomore{list-style:none;display:flex;flex-direction:column;gap:18px}
.nomore li{display:flex;align-items:center;gap:18px;font-size:36px;font-weight:600;color:#fff}
.nomore li svg{flex:none;background:var(--accent);color:var(--fg);border-radius:10px;padding:6px;border:2px solid var(--fg)}
.cta-row{display:flex;flex-direction:column;gap:20px;margin-top:10px}
.cta-btn{display:inline-flex;align-self:flex-start;align-items:center;gap:16px;
  font-family:'Bricolage Grotesque';font-weight:800;font-size:46px;letter-spacing:-.01em;
  background:var(--accent);color:var(--fg);border:4px solid var(--fg);border-radius:20px;padding:24px 40px;box-shadow:9px 9px 0 0 var(--fg)}
.cta-sub{font-family:'Bricolage Grotesque';font-weight:700;font-size:34px;color:#fff;opacity:.92}

/* bottom bar */
.dots{display:flex;gap:14px}
.dot{width:16px;height:16px;border-radius:999px;border:3px solid currentColor;opacity:.4}
.dot.on{opacity:1;background:var(--accent);border-color:var(--accent);width:44px}
.swipe{display:flex;align-items:center;gap:10px;font-family:'Bricolage Grotesque';font-weight:700;font-size:28px;letter-spacing:.04em;opacity:.85}
.swipe svg{color:var(--accent)}
.swipe.end{color:var(--accent);opacity:1}

.corner-sticker{position:absolute;right:-70px;bottom:150px;transform:rotate(90deg);
  font-family:'Bricolage Grotesque';font-weight:800;font-size:26px;letter-spacing:.4em;text-transform:uppercase;opacity:.12}
</style></head>
<body><div class="sheet">${slidesHtml}</div></body></html>`;

fs.writeFileSync(path.join(__dirname, 'carousel.html'), html);
console.log('wrote carousel.html', (html.length / 1024).toFixed(0), 'KB,', N, 'slides');
