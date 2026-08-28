/* UI + routing. */

import {
  getState, update, save, resetAll, todayKey, parseKey, getDay, setDay,
  hoursFor, weightSeries, trendWeight, exportJSON, importJSON,
  entriesFor, addEntry, updateEntry, removeEntry, newEntryId, sumEntries,
  referencedPhotoIds,
  DAY_NAMES, DAY_FULL
} from './store.js';
import { targets, dayType, bmr, ACTIVITY, weeklyHours, fmtDate } from './nutrition.js';
import { RECIPES, BY_ID, EFFORT_LABEL, AISLES } from './recipes.js';
import { buildWeek, swapSlot, retuneDay, groceryList, fmtQty, dayTotals, SLOTS, EQUIPMENT } from './planner.js';
import { FOCUS_OPTIONS, SESSIONS, zones, weeklyTarget, sessionBurn, VISCERAL_TRUTH } from './move.js';
import { askCoach, testKey, contextPack, buildContextFile, QUICK_PROMPTS, ApiError } from './ai.js';
import { prepareImage, estimateMeal, guessSlot, VisionError, CONFIDENCE_LABEL } from './vision.js';
import { newPhotoId, putPhoto, photoURL, deletePhoto, prunePhotos } from './photos.js';
import { countedForDay, weekPosition, safetyFloor, MACRO_KEYS } from './intake.js';
import {
  PREP_SLOTS, SLOT_BY_KEY, prepOptions, sessionLoad, verdict,
  prepShopping, prepRunOrder
} from './prep.js';

/* ── tiny helpers ──────────────────────────────────────────────── */

const $ = sel => document.querySelector(sel);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

function openSheet(html) {
  $('#sheetBody').innerHTML = `<div class="grabber"></div>${html}`;
  $('#sheet').classList.add('open');
  $('#sheetBody').scrollTop = 0;
}
function closeSheet() { $('#sheet').classList.remove('open'); }
$('#sheet').addEventListener('click', e => { if (e.target.id === 'sheet') closeSheet(); });

const SLOT_LABEL = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' };

function num(v, fallback = 0) {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : fallback;
}

/* ── routing ───────────────────────────────────────────────────── */

let currentTab = 'today';

function show(tab) {
  currentTab = tab;
  closeSheet();               // never leave a sheet covering the view you moved to
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $(`#view-${tab}`).classList.add('active');
  document.querySelectorAll('.tabbar button').forEach(b =>
    b.classList.toggle('active', b.dataset.tab === tab));
  window.scrollTo(0, 0);
  RENDER[tab]?.();
}

$('#tabbar').addEventListener('click', e => {
  const btn = e.target.closest('button[data-tab]');
  if (btn) show(btn.dataset.tab);
});

function header(title, sub, right = '') {
  $('#hdrTitle').textContent = title;
  $('#hdrSub').textContent = sub || '';
  $('#hdrRight').innerHTML = right;
}

/* ═══════════════════════════ ONBOARDING ═══════════════════════ */

let obStep = 0;
const OB_STEPS = 6;

function renderOnboard() {
  const p = getState().profile;
  const dots = Array.from({ length: OB_STEPS }, (_, i) =>
    `<i class="${i === obStep ? 'on' : ''}"></i>`).join('');

  const hourInputs = DAY_FULL.map((d, i) => `
    <div class="field" style="margin-bottom:8px">
      <label>${d}</label>
      <input type="number" min="0" max="24" step="0.5" inputmode="decimal"
             data-wh="${i}" value="${p.workHours[i]}">
    </div>`).join('');

  $('#onboardHost').innerHTML = `
  <div class="card">
    <div class="onboard-step ${obStep === 0 ? 'active' : ''}">
      <h1>Let's set this up properly</h1>
      <p>This app builds a Mediterranean eating plan around <strong>the hours you actually work</strong> — not around a fantasy version of your week.</p>
      <p class="muted small">Six short screens. Everything stays on this phone. You can change all of it later.</p>
      <div class="note">The Mediterranean pattern is the most consistently evidenced way of eating for heart health and sustainable weight loss in people over fifty. It is also the only one that tastes like food.</div>
    </div>

    <div class="onboard-step ${obStep === 1 ? 'active' : ''}">
      <h2>About you</h2>
      <div class="field"><label>First name</label>
        <input id="ob-name" value="${esc(p.name)}" placeholder="Optional" autocomplete="given-name"></div>
      <div class="grid2">
        <div class="field"><label>Age</label>
          <input id="ob-age" type="number" inputmode="numeric" min="18" max="100" value="${p.age}"></div>
        <div class="field"><label>Sex at birth</label>
          <select id="ob-sex">
            <option value="male" ${p.sex === 'male' ? 'selected' : ''}>Male</option>
            <option value="female" ${p.sex === 'female' ? 'selected' : ''}>Female</option>
          </select></div>
      </div>
      <div class="field"><label>Height</label>
        <div class="grid2">
          <input id="ob-ft" type="number" inputmode="numeric" min="4" max="7" value="${Math.floor(p.heightIn / 12)}" aria-label="feet">
          <input id="ob-in" type="number" inputmode="numeric" min="0" max="11" value="${p.heightIn % 12}" aria-label="inches">
        </div>
        <div class="hint">Feet and inches. Used for your metabolic rate.</div>
      </div>
    </div>

    <div class="onboard-step ${obStep === 2 ? 'active' : ''}">
      <h2>Weight</h2>
      <div class="grid2">
        <div class="field"><label>Right now (lb)</label>
          <input id="ob-cur" type="number" inputmode="decimal" step="0.1" value="${p.currentWeight}"></div>
        <div class="field"><label>Goal (lb)</label>
          <input id="ob-goal" type="number" inputmode="decimal" step="0.1" value="${p.goalWeight}"></div>
      </div>
      <div class="field"><label>How fast?</label>
        <select id="ob-rate">
          <option value="0.75" ${p.rate == 0.75 ? 'selected' : ''}>Gentle — 0.75 lb a week</option>
          <option value="1" ${p.rate == 1 ? 'selected' : ''}>Steady — 1 lb a week (recommended)</option>
          <option value="1.25" ${p.rate == 1.25 ? 'selected' : ''}>Brisk — 1.25 lb a week</option>
        </select>
        <div class="hint">Faster is not better. Past fifty, an aggressive deficit costs you muscle, and muscle is what keeps your metabolism up.</div>
      </div>
    </div>

    <div class="onboard-step ${obStep === 3 ? 'active' : ''}">
      <h2>How much do you work?</h2>
      <p class="small muted">This is the part most diet apps skip, and it is the reason most plans fail by Wednesday. Give your typical week — hours per day including commute.</p>
      ${hourInputs}
      <div class="field"><label>Activity outside work</label>
        <select id="ob-act">
          ${Object.entries(ACTIVITY).map(([k, v]) =>
            `<option value="${k}" ${p.activity === k ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}
        </select>
      </div>
    </div>

    <div class="onboard-step ${obStep === 4 ? 'active' : ''}">
      <h2>Cooking, honestly</h2>
      <div class="field"><label>Nights a week you will genuinely cook</label>
        <select id="ob-nights">
          ${[0, 1, 2, 3, 4, 5, 6, 7].map(n =>
            `<option value="${n}" ${p.cookNights == n ? 'selected' : ''}>${n} night${n === 1 ? '' : 's'}</option>`).join('')}
        </select>
        <div class="hint">Answer with what you actually do, not what you intend. The plan is built from this number.</div>
      </div>
      <div class="field"><label>Confidence in the kitchen</label>
        <select id="ob-skill">
          <option value="none" ${p.cookSkill === 'none' ? 'selected' : ''}>I barely cook</option>
          <option value="ok" ${p.cookSkill === 'ok' ? 'selected' : ''}>I can follow a recipe</option>
          <option value="confident" ${p.cookSkill === 'confident' ? 'selected' : ''}>I'm comfortable improvising</option>
        </select>
      </div>
      <div class="field"><label>Anything you won't eat</label>
        <input id="ob-dislikes" value="${esc(p.dislikes)}" placeholder="e.g. olives, sardines, eggplant">
        <div class="hint">Comma separated. Recipes containing these get filtered out.</div>
      </div>
      <div class="field"><label>Allergies</label>
        <input id="ob-allergies" value="${esc(p.allergies)}" placeholder="e.g. shellfish, walnuts">
      </div>
      <div class="field"><label>Health conditions or medications worth knowing</label>
        <input id="ob-cond" value="${esc(p.conditions)}" placeholder="e.g. blood pressure medication, type 2 diabetes">
        <div class="hint">Shared with the AI coach so it can flag things. Never leaves your phone otherwise.</div>
      </div>
    </div>

    <div class="onboard-step ${obStep === 5 ? 'active' : ''}">
      <h2>The AI coach (optional)</h2>
      <p class="small">Everything in this app — targets, the weekly plan, the recipes, the grocery list — works without any of this. The coach adds a chat that already knows your full situation and can improvise around it.</p>
      <div class="field"><label>Anthropic API key</label>
        <input id="ob-key" type="password" value="${esc(getState().settings.apiKey)}" placeholder="sk-ant-..." autocomplete="off" spellcheck="false">
        <div class="hint">From <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener">console.anthropic.com</a>. Stored only on this phone and sent only to Anthropic. Typical cost is a dollar or two a month.</div>
      </div>
      <div class="warn"><strong>Before you start.</strong> This app gives general nutrition guidance, not medical advice. If you take medication for blood pressure or diabetes, losing weight can genuinely change what you need — tell your doctor you're doing this.</div>
    </div>

    <div class="dots">${dots}</div>
    <div class="btn-row" style="margin-top:12px">
      ${obStep > 0 ? '<button id="obBack" class="ghost">Back</button>' : ''}
      <button id="obNext" class="primary">${obStep === OB_STEPS - 1 ? 'Build my plan' : 'Continue'}</button>
    </div>
    ${obStep === OB_STEPS - 1 ? '<button id="obSkip" class="ghost" style="width:100%;margin-top:8px">Skip — set it up later</button>' : ''}
  </div>`;

  $('#obNext').onclick = () => { if (captureStep()) { obStep++; obStep >= OB_STEPS ? finishOnboard() : renderOnboard(); } };
  const back = $('#obBack'); if (back) back.onclick = () => { captureStep(); obStep--; renderOnboard(); };
  const skip = $('#obSkip'); if (skip) skip.onclick = () => finishOnboard();
}

function captureStep() {
  const s = getState();
  const p = s.profile;
  const v = id => $(id)?.value;

  if (obStep === 1) {
    p.name = v('#ob-name') ?? p.name;
    p.age = Math.max(18, Math.min(100, num(v('#ob-age'), p.age)));
    p.sex = v('#ob-sex') ?? p.sex;
    p.heightIn = Math.max(48, Math.min(84, num(v('#ob-ft'), 5) * 12 + num(v('#ob-in'), 10)));
  }
  if (obStep === 2) {
    const cur = num(v('#ob-cur'), p.currentWeight);
    const goal = num(v('#ob-goal'), p.goalWeight);
    if (goal >= cur) { toast('Your goal needs to be below your current weight.'); return false; }
    if (cur < 80 || cur > 600) { toast('That current weight looks wrong.'); return false; }
    p.currentWeight = cur;
    if (!s.onboarded) p.startWeight = cur;
    p.goalWeight = goal;
    p.rate = num(v('#ob-rate'), 1);
  }
  if (obStep === 3) {
    document.querySelectorAll('[data-wh]').forEach(inp => {
      p.workHours[Number(inp.dataset.wh)] = Math.max(0, Math.min(24, num(inp.value, 0)));
    });
    p.activity = v('#ob-act') ?? p.activity;
  }
  if (obStep === 4) {
    p.cookNights = num(v('#ob-nights'), p.cookNights);
    p.cookSkill = v('#ob-skill') ?? p.cookSkill;
    p.dislikes = v('#ob-dislikes') ?? p.dislikes;
    p.allergies = v('#ob-allergies') ?? p.allergies;
    p.conditions = v('#ob-cond') ?? p.conditions;
  }
  if (obStep === 5) {
    s.settings.apiKey = (v('#ob-key') ?? '').trim();
  }
  save();
  return true;
}

function finishOnboard() {
  update(s => {
    s.onboarded = true;
    const t = targets(s.profile);
    s.plan = buildWeek(s.profile, t.kcal, Date.now() & 0xffff, t.protein);
    s.grocery = { checked: [], generatedFor: s.plan.weekStart };
    const k = todayKey();
    if (!s.log[k]) s.log[k] = { weight: s.profile.currentWeight, hoursWorked: null, done: [], note: '' };
  });
  $('#tabbar').hidden = false;
  show('today');
  toast('Plan built. Start with today.');
}

/* ═══════════════════════════ TODAY ════════════════════════════ */

function planDayIndex(key) {
  const s = getState();
  if (!s.plan) return -1;
  return s.plan.days.findIndex(d => d.date === key);
}

function renderToday() {
  const s = getState();
  const p = s.profile;
  const t = targets(p);
  const key = todayKey();
  const day = getDay(key);
  const hrs = hoursFor(key);
  const type = dayType(hrs);
  const di = planDayIndex(key);
  const pd = di >= 0 ? s.plan.days[di] : null;
  const done = day.done || [];

  header(p.name ? `Hello, ${esc(p.name)}` : 'Today',
    new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));

  /* Two things count towards the day: planned meals you ticked off, and
     meals you photographed. Ticking says "I ate the plan"; a photo says
     "here is what I actually ate". Both are real, so both are added. */
  const logged = entriesFor(key);
  const fromPhotos = sumEntries(logged);
  const ate = countedForDay(key);
  const wk = weekPosition();
  const eaten = ate.kcal;
  const protein = ate.protein;
  const left = t.kcal - eaten;
  const pct = Math.min(100, Math.round((eaten / t.kcal) * 100));

  const macroBar = (label, have, want) => {
    const w = want ? Math.min(100, Math.round((have / want) * 100)) : 0;
    return `<div class="hm">
      <b>${have}<span style="font-size:11px;opacity:.75">/${want}g</span></b>
      <span>${label}</span>
      <div class="bar"><i style="width:${w}%"></i></div>
    </div>`;
  };

  const plannedHours = pd ? pd.hours : null;
  const mismatch = plannedHours !== null && Math.abs(plannedHours - hrs) >= 2;

  const meals = pd ? SLOTS.map(slot => {
    const sl = pd.slots[slot];
    if (!sl) return '';
    const r = BY_ID[sl.recipeId];
    if (!r) return '';
    const isDone = done.includes(slot);
    const n = sl.portions || 1;
    return `
    <div class="meal ${isDone ? 'done' : ''}" data-slot="${slot}" data-recipe="${r.id}">
      <button class="tick" data-tick="${slot}" aria-label="Mark ${slot} eaten">✓</button>
      <div class="m-body">
        <span class="m-slot">${SLOT_LABEL[slot]}</span>
        <span class="m-name">${esc(r.name)}${n !== 1 ? ` <span class="muted">× ${n}</span>` : ''}</span>
        <span class="m-meta">
          ${sl.leftover
            ? '<span class="badge leftover">♻️ Leftovers</span><span>3 min</span>'
            : `<span class="badge ${r.effort}">${EFFORT_LABEL[r.effort]}</span><span>${r.minutes} min</span>`}
          <span>${Math.round(r.protein * n)}g protein</span>
          ${sl.compromised ? '<span class="badge project">⚠︎ stretched</span>' : ''}
        </span>
      </div>
      <span class="m-kcal">${Math.round(r.kcal * n)}</span>
    </div>`;
  }).join('') : '<div style="padding:16px" class="muted">No plan for today. Generate one on the Week tab.</div>';

  $('#todayHost').innerHTML = `
  <div class="card hero">
    <div class="spread">
      <div>
        <div class="big">${left > 0 ? left : 0}<span class="unit"> kcal left</span></div>
        <div class="small" style="opacity:.85;margin-top:4px">
          ${left < 0 ? `${n0(-left)} over · ` : ''}keep under ${n0(t.kcal)} today · ${n0(eaten)} eaten</div>
      </div>
      <div style="text-align:right">
        <div style="font-size:26px;font-weight:700">${protein}<span style="font-size:13px;opacity:.8">g</span></div>
        <div class="small" style="opacity:.85">protein of ${t.protein}</div>
      </div>
    </div>
    <div class="bar" style="background:rgba(255,255,255,.25)">
      <i style="width:${pct}%;background:${left < 0 ? '#FFD9C6' : '#fff'}"></i>
    </div>
    <div class="hero-macros">
      ${macroBar('Protein', ate.protein, t.protein)}
      ${macroBar('Carbs', ate.carbs, t.carbs)}
      ${macroBar('Fat', ate.fat, t.fat)}
      ${macroBar('Fiber', ate.fiber, t.fiber)}
    </div>
    <button class="shoot" id="snapBtn">📷 Photograph what I ate</button>
    <input type="file" id="snapFile" accept="image/*" capture="environment" hidden>
  </div>

  <div class="card flush" id="loggedCard">
    <div class="card-title" style="padding:14px 16px 0;margin-bottom:6px">
      <h3>Eaten today</h3>
      <span class="small muted">${fromPhotos.count
        ? `${fromPhotos.count} logged · ${fromPhotos.kcal} kcal`
        : 'nothing logged yet'}</span>
    </div>
    ${logged.length
      ? logged.map(entryRow).join('')
      : `<div style="padding:4px 16px 16px" class="small muted">
           Take a picture of anything you eat and it lands here with calories and protein worked out.
           The coach reads this, so it stops guessing what kind of day you have had.
         </div>`}
  </div>

  <div class="card">
    <div class="card-title">
      <h3>This week</h3>
      <button class="tiny" id="whyNum">Why ${n0(t.kcal)}?</button>
    </div>
    <div class="spread small muted">
      <span><strong style="color:var(--ink);font-size:15px">${n0(wk.usedTotal)}</strong> used</span>
      <span>of ${n0(wk.budget)} this week</span>
    </div>
    <div class="bar ${wk.usedTotal > wk.budget ? 'over' : 'olive'}">
      <i style="width:${Math.min(100, Math.round((wk.usedTotal / wk.budget) * 100))}%"></i>
    </div>
    ${weekStrip(wk)}
    <div class="note" style="margin-bottom:0">${esc(weekAdvice(wk))}</div>
  </div>

  <div class="card">
    <div class="card-title">
      <h3>Hours worked today</h3>
      <span class="daytype ${type.key}">${type.label}</span>
    </div>
    <div class="btn-row" style="align-items:center;gap:10px">
      <button class="tiny" id="hMinus" aria-label="fewer hours">−</button>
      <div style="flex:1;text-align:center;font-size:30px;font-weight:700">${hrs}<span style="font-size:15px;color:var(--muted)">h</span></div>
      <button class="tiny" id="hPlus" aria-label="more hours">+</button>
    </div>
    <div class="note" style="margin-bottom:0">${esc(type.advice)}</div>
    ${mismatch ? `
      <div class="warn">
        You planned for ${plannedHours}h and worked ${hrs}h. Your remaining meals were built for a different kind of day.
        <div style="margin-top:9px"><button class="tiny" id="retune">Re-tune today's meals</button></div>
      </div>` : ''}
  </div>

  <div class="card flush">${meals}</div>

  <div class="card">
    <div class="card-title"><h3>Weigh in</h3><span class="small muted">morning, after the bathroom, before eating</span></div>
    <div class="btn-row">
      <input id="wIn" type="number" inputmode="decimal" step="0.1" placeholder="${p.currentWeight}"
             value="${day.weight ?? ''}" style="flex:2 1 140px">
      <button class="primary" id="wSave" style="flex:1 1 100px">Log</button>
    </div>
    ${weightSeries().length > 1 ? `<div class="small muted" style="margin-top:10px">
      7-day trend <strong>${trendWeight().toFixed(1)} lb</strong> ·
      ${(p.startWeight - trendWeight()).toFixed(1)} lb down since you started
    </div>` : '<div class="small muted" style="margin-top:10px">Log a few days and the trend line will start telling you the truth the daily number can\'t.</div>'}
  </div>

  <div class="card">
    <div class="card-title"><h3>Ask the coach</h3></div>
    <p class="small muted" style="margin-bottom:10px">It already knows you worked ${hrs} hours today and what's left in your budget.</p>
    <button class="primary" style="width:100%" id="goCoach">What should I eat tonight?</button>
  </div>`;

  /* The file input is reset each time: picking the same photo twice in a row
     fires no change event otherwise, which reads as the button being broken. */
  $('#snapBtn').onclick = () => $('#snapFile').click();
  $('#snapFile').onchange = e => {
    const file = e.target.files[0];
    e.target.value = '';
    if (file) startCapture(file);
  };
  $('#loggedCard').querySelectorAll('[data-entry]').forEach(row => {
    row.onclick = () => openEntry(key, row.dataset.entry);
  });
  paintThumbs();

  $('#whyNum').onclick = showNumberExplainer;

  $('#hMinus').onclick = () => bumpHours(-1);
  $('#hPlus').onclick = () => bumpHours(1);
  $('#wSave').onclick = () => {
    const w = num($('#wIn').value, 0);
    if (w < 60 || w > 700) { toast('That weight looks off.'); return; }
    setDay(key, { weight: w });
    update(st => { st.profile.currentWeight = w; });
    toast('Logged.');
    renderToday();
  };
  $('#goCoach').onclick = () => {
    show('coach');
    setTimeout(() => sendMessage(QUICK_PROMPTS[0].text), 60);
  };
  const rt = $('#retune');
  if (rt) rt.onclick = () => {
    const changed = retuneDay(getState().plan, di, hrs, p, done);
    save();
    renderToday();
    toast(changed.length ? `Swapped ${changed.length} meal${changed.length > 1 ? 's' : ''}.` : 'Today already works as planned.');
  };

  $('#todayHost').querySelectorAll('.meal').forEach(m => {
    m.addEventListener('click', e => {
      const slot = m.dataset.slot;
      if (e.target.closest('[data-tick]')) {
        const cur = getDay(key).done || [];
        setDay(key, { done: cur.includes(slot) ? cur.filter(x => x !== slot) : [...cur, slot] });
        renderToday();
      } else {
        showRecipe(m.dataset.recipe, { slot, dayIndex: di, portions: pd?.slots[slot]?.portions });
      }
    });
  });
}

function bumpHours(delta) {
  const key = todayKey();
  const next = Math.max(0, Math.min(24, hoursFor(key) + delta));
  setDay(key, { hoursWorked: next });
  renderToday();
}

/* ═══════════════════════════ WALKING ══════════════════════════ */

function showMovement() {
  const p = getState().profile;
  const z = zones(p.age);
  const target = weeklyTarget(p.focus || 'weight');
  const visceral = (p.focus || 'weight') === 'visceral';
  const flagged = /heart|blood pressure|bp |diabet|angina|statin|beta.?block/i.test(p.conditions || '');

  const table = s => `
    <table class="tread">
      <thead><tr><th>Min</th><th>Speed</th><th>Incline</th><th>What</th></tr></thead>
      <tbody>
        ${s.blocks.map(b => `<tr class="e-${b.effort}">
          <td>${b.from}–${b.to}</td>
          <td>${b.speed.toFixed(1)}</td>
          <td>${b.incline}%</td>
          <td>${esc(b.say)}</td>
        </tr>`).join('')}
      </tbody>
    </table>`;

  openSheet(`
    <h2>Walking, mostly uphill</h2>
    <p class="small muted">Speeds are in miles per hour. Incline is the dial — if a session feels too easy or too hard, change the incline and leave the speed alone.</p>

    <div class="card">
      <div class="card-title"><h3>Your heart rate</h3><span class="small muted">age ${p.age}</span></div>
      <div class="small stack">
        <div class="spread"><span class="muted">Estimated maximum</span><strong>${z.max} bpm</strong></div>
        <div class="spread"><span class="muted">Moderate</span><strong>${z.moderate.lo}–${z.moderate.hi}</strong></div>
        <div class="spread"><span class="muted">Hard</span><strong>${z.hard.lo}–${z.hard.hi}</strong></div>
      </div>
      <div class="note" style="margin-bottom:0">No monitor? Use your breathing. <strong>Moderate</strong> is short sentences, not paragraphs. <strong>Hard</strong> is a few words at a time. If you can sing, you are not working; if you cannot speak at all, ease off.</div>
    </div>

    ${flagged ? `
      <div class="warn">
        <strong>You have noted a heart or blood-pressure condition.</strong> Talk to your doctor before starting these, and ask specifically about the harder blocks — some blood-pressure medication blunts your heart rate, which makes the numbers above misleading for you. Go by breathing instead.
      </div>` : ''}

    ${SESSIONS.map(s => `
      <div class="card">
        <div class="card-title"><h3>${esc(s.name)}</h3>
          <span class="badge quick">≈${sessionBurn(s, p.currentWeight)} kcal</span></div>
        <p class="small muted">${esc(s.when)}</p>
        ${table(s)}
        <div class="note" style="margin-bottom:0">${esc(s.note)}</div>
      </div>`).join('')}

    <div class="card">
      <div class="card-title"><h3>How often</h3></div>
      <p style="margin-bottom:0">${esc(target.line)}</p>
    </div>

    ${visceral ? `
      <div class="card">
        <div class="card-title"><h3>What actually shifts visceral fat</h3></div>
        <p class="small muted">In order of how much it matters.</p>
        <ol class="steps">
          ${VISCERAL_TRUTH.map(v => `<li><strong>${esc(v.head)}</strong><div class="small muted">${esc(v.body)}</div></li>`).join('')}
        </ol>
      </div>` : `
      <div class="note">Set your focus to belly and visceral fat in Me and this page adds a plain account of what actually shifts it — and what does not.</div>`}

    <div class="warn">
      <strong>Stop and speak to a doctor</strong> if you get chest pain or pressure, unusual breathlessness, dizziness, or an irregular heartbeat — during a session or after one. None of that is something to push through, and none of it is something this app can assess.
    </div>
    <p class="small muted center">General fitness guidance, not a prescription. If you have not exercised in a while, start with the ten-minute session and stay there for a fortnight.</p>
    <button class="primary" id="mvClose" style="width:100%;margin-top:6px">Got it</button>`);

  $('#mvClose').onclick = closeSheet;
}

/* ═══════════════════════════ PREP ═════════════════════════════ */

/* Four screens: which meal, how many, what to make, how to make it.

   The third screen is the one that matters. It shows what the picks
   actually cost — time, separate cooks, portions — and argues back when
   that adds up to a Sunday nobody would repeat. Meal prep does not fail
   because people do too little on the first attempt. */

let prepStep = 0;          // 0 which meal · 1 how many · 2 pick · 3 the plan
let prepSlot = null;
let prepWanted = 0;
let prepPicks = [];        // recipe ids

function hasPreppedBefore() {
  return (getState().prepStock || []).length > 0 || !!getState().prepEverDone;
}

function renderPrep() {
  header('Meal prep', ['What do you want to prep?', 'How many?', 'Pick what to make', 'Your prep session'][prepStep]);
  [renderPrepSlot, renderPrepCount, renderPrepPick, renderPrepPlan][prepStep]();
}

function prepBack() {
  prepStep = Math.max(0, prepStep - 1);
  if (prepStep < 2) prepPicks = [];
  renderPrep();
}

function backBar(label = 'Back') {
  return `<div class="center" style="margin-top:14px"><button class="tiny ghost" id="prepBack">← ${label}</button></div>`;
}
function wireBack() {
  const b = $('#prepBack');
  if (b) b.onclick = prepBack;
}

/* ── 1. which meal ── */
function renderPrepSlot() {
  const stock = getState().prepStock || [];
  const first = !hasPreppedBefore();
  const p = getState().profile;
  const who = p.whoCooks || {};

  $('#prepHost').innerHTML = `
    ${stock.length ? `
      <div class="card">
        <div class="card-title"><h3>In your fridge now</h3>
          <button class="tiny" id="prepClear">Clear</button></div>
        ${stock.map(s => {
          const r = BY_ID[s.recipeId];
          const days = Math.max(0, s.keepsDays - Math.floor((Date.now() - new Date(s.madeOn)) / 86400000));
          return `<div class="spread stockrow${days <= 0 ? ' gone' : ''}">
            <div><strong>${esc(r ? r.name : s.recipeId)}</strong>
              <div class="small muted">${s.left} left · ${days > 0 ? `good for ${days} more day${days > 1 ? 's' : ''}` : 'past its best — bin it'}</div></div>
            <button class="tiny" data-ate="${esc(s.id)}">Ate one</button>
          </div>`;
        }).join('')}
      </div>` : ''}

    ${first ? `
      <div class="card">
        <h2>You have not done this before</h2>
        <p>That is fine, and it is simpler than it sounds. Meal prep is just cooking one thing on a quiet day and putting it in boxes.</p>
        <p class="small muted" style="margin-bottom:0">Start with lunch. One recipe, four boxes, and Monday to Thursday stops being a decision.</p>
      </div>` : ''}

    <div class="card">
      <div class="card-title"><h3>What do you want to prep?</h3></div>
      ${PREP_SLOTS.map(s => {
        const handled = (who[s.key] || 'me') !== 'me';
        return `<button class="prep-slot" data-slot="${s.key}">
          <span class="ps-ico">${s.icon}</span>
          <span class="ps-body">
            <strong>${s.label}</strong>
            <span class="small muted">${esc(s.blurb)}</span>
            ${handled ? '<span class="small muted">You have this set to someone else cooking — prepping it is still fine.</span>' : ''}
          </span>
          <span class="ps-go">›</span>
        </button>`;
      }).join('')}
    </div>

    <div class="note">Not sure? Snacks take about ten minutes and no cooking, and they are the thing that stops the 9pm raid on the kitchen.</div>`;

  $('#prepHost').querySelectorAll('[data-slot]').forEach(b => {
    b.onclick = () => { prepSlot = b.dataset.slot; prepPicks = []; prepStep = 1; renderPrep(); };
  });
  $('#prepHost').querySelectorAll('[data-ate]').forEach(b => {
    b.onclick = () => { eatFromStock(b.dataset.ate); };
  });
  const c = $('#prepClear');
  if (c) c.onclick = () => {
    if (!confirm('Clear everything from the fridge list?')) return;
    update(s => { s.prepStock = []; });
    renderPrep();
  };
}

/* ── 2. how many ── */
function renderPrepCount() {
  const s = SLOT_BY_KEY[prepSlot];
  $('#prepHost').innerHTML = `
    <div class="card">
      <div class="card-title"><h3>${s.icon} ${s.label}</h3></div>
      <p>${esc(s.ask)}</p>
      <div class="grid3">
        ${s.counts.map(n => `<button class="bigpick" data-n="${n}">${n}</button>`).join('')}
      </div>
      <div class="hint">You can change your mind on the next screen. This just tells me how much food to aim at, so I can stop you making eight lunches for a four-lunch week.</div>
    </div>
    ${backBar('Pick a different meal')}`;

  $('#prepHost').querySelectorAll('[data-n]').forEach(b => {
    b.onclick = () => { prepWanted = Number(b.dataset.n); prepStep = 2; renderPrep(); };
  });
  wireBack();
}

/* ── 3. pick what to make ── */
function renderPrepPick() {
  const first = !hasPreppedBefore();
  const opts = prepOptions(prepSlot, getState().profile, first);
  const picks = prepPicks.map(id => BY_ID[id]).filter(Boolean);
  const v = verdict(picks, prepWanted, prepSlot, first);
  const load = sessionLoad(picks);
  const s = SLOT_BY_KEY[prepSlot];

  $('#prepHost').innerHTML = `
    <div class="card">
      <div class="card-title"><h3>${s.icon} ${prepWanted} ${prepSlot === 'snack' ? 'nights' : prepSlot === 'breakfast' ? 'mornings' : 'days'}</h3>
        <button class="tiny" id="prepChangeN">Change</button></div>
      <p class="small muted" style="margin-bottom:0">Tap what you fancy making. I will tell you if it is too much.</p>
    </div>

    <div class="card flush">
      ${opts.map(r => {
        const on = prepPicks.includes(r.id);
        return `<div class="prep-opt${on ? ' on' : ''}" data-pick="${r.id}">
          <span class="po-tick">✓</span>
          <div class="po-body">
            <strong>${esc(r.name)}</strong>
            <div class="po-meta">
              <span class="badge ${r.prep.kind === 'portion' ? 'zero' : 'quick'}">${r.prep.kind === 'portion' ? 'No cooking' : 'Cook'}</span>
              <span>${r.prep.activeMin} min</span>
              <span>makes ${r.prep.makes}</span>
              <span>${r.kcal} kcal · ${r.protein}g protein</span>
            </div>
            <div class="small muted" style="margin-top:4px">${esc(r.prep.keeps)}</div>
          </div>
        </div>`;
      }).join('')}
    </div>

    <div class="card ${v.level}">
      <strong>${esc(v.headline)}</strong>
      <p class="small" style="margin:6px 0 0">${esc(v.body)}</p>
      ${picks.length ? `<div class="macro-row" style="margin-top:12px">
        <div class="macro"><b>${load.items}</b>thing${load.items > 1 ? 's' : ''}</div>
        <div class="macro"><b>${load.cooks}</b>to cook</div>
        <div class="macro"><b>${load.activeMin}m</b>hands on</div>
        <div class="macro"><b>${load.portions}</b>portions</div>
      </div>` : ''}
    </div>

    <button class="primary" id="prepGo" style="width:100%" ${picks.length ? '' : 'disabled'}>
      ${v.level === 'toomuch' ? 'Show me how anyway' : 'Show me how'}
    </button>
    ${backBar('Back')}`;

  $('#prepHost').querySelectorAll('[data-pick]').forEach(b => {
    b.onclick = () => {
      const id = b.dataset.pick;
      prepPicks = prepPicks.includes(id) ? prepPicks.filter(x => x !== id) : [...prepPicks, id];
      renderPrep();
    };
  });
  $('#prepChangeN').onclick = () => { prepStep = 1; renderPrep(); };
  $('#prepGo').onclick = () => { prepStep = 3; renderPrep(); };
  wireBack();
}

/* ── 4. the plan ── */
function renderPrepPlan() {
  const picks = prepPicks.map(id => BY_ID[id]).filter(Boolean);
  const load = sessionLoad(picks);
  const shopping = prepShopping(picks);
  const order = prepRunOrder(picks);

  $('#prepHost').innerHTML = `
    <div class="card hero">
      <div class="big">${load.activeMin}<span class="unit"> minutes</span></div>
      <div class="small" style="opacity:.85;margin-top:4px">
        ${load.cooks ? `${load.cooks} to cook` : 'nothing to cook'}${load.portionJobs ? ` · ${load.portionJobs} to portion` : ''} · ${load.portions} portions
      </div>
    </div>

    <div class="card">
      <div class="card-title"><h3>Buy this</h3>
        <button class="tiny" id="prepCopyShop">Copy</button></div>
      ${AISLES.filter(a => shopping[a]).map(a => `
        <div class="aisle-head">${a}</div>
        ${shopping[a].map(i => `<div class="grocery-item"><span>${esc(fmtQty(i))}</span></div>`).join('')}
      `).join('')}
    </div>

    <div class="card">
      <div class="card-title"><h3>Do it in this order</h3></div>
      <ol class="steps">
        ${order.map(st => `<li><strong>${esc(st.title)}</strong><div class="small muted">${esc(st.detail)}</div></li>`).join('')}
      </ol>
    </div>

    ${picks.map(r => `
      <div class="card">
        <div class="card-title"><h3>${esc(r.name)}</h3>
          <span class="badge ${r.prep.kind === 'portion' ? 'zero' : 'quick'}">${r.prep.makes} portions</span></div>
        <ol class="steps">${r.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <div class="divider"></div>
        <div class="small stack">
          <div class="spread"><span class="muted">Put it in</span><strong style="text-align:right">${esc(r.prep.containers)}</strong></div>
          <div class="spread"><span class="muted">Keeps</span><strong style="text-align:right">${esc(r.prep.keeps)}</strong></div>
          <div class="spread"><span class="muted">Freezes</span><strong>${r.prep.freezes ? 'Yes' : 'No'}</strong></div>
          <div class="spread"><span class="muted">To eat it</span><strong style="text-align:right">${esc(r.prep.reheat)}</strong></div>
        </div>
      </div>`).join('')}

    <button class="primary" id="prepDone" style="width:100%">I made it — put it in my fridge list</button>
    ${backBar('Change what I am making')}
    <p class="small muted center" style="margin:14px 0 20px">Once you tick this off, the app knows what is in your fridge and how long it has left.</p>`;

  $('#prepCopyShop').onclick = () => {
    const lines = AISLES.filter(a => shopping[a])
      .map(a => `${a.toUpperCase()}\n` + shopping[a].map(i => `  ${fmtQty(i)}`).join('\n'))
      .join('\n\n');
    copy(lines, 'Shopping list copied.');
  };
  $('#prepDone').onclick = () => {
    update(st => {
      st.prepEverDone = true;
      for (const r of picks) {
        st.prepStock.push({
          id: newEntryId(), recipeId: r.id, madeOn: new Date().toISOString(),
          left: r.prep.makes, keepsDays: r.prep.keepsDays, slot: prepSlot
        });
      }
    });
    prepStep = 0; prepPicks = [];
    renderPrep();
    toast('In the fridge. Nicely done.');
  };
  wireBack();
}

function eatFromStock(id) {
  update(s => {
    const item = (s.prepStock || []).find(x => x.id === id);
    if (!item) return;
    item.left -= 1;
    if (item.left <= 0) s.prepStock = s.prepStock.filter(x => x.id !== id);
  });
  renderPrep();
  toast('Logged.');
}

/* ═══════════════════════ THE NUMBER ═══════════════════════════ */

/* One daily limit, and a weekly total sitting behind it.

   The daily number never moves — there is exactly one figure to remember,
   and it is the answer to "what am I keeping under today". But the number
   that decides whether the weight actually comes off is the weekly one,
   because a body cannot tell it is Tuesday. Showing both is what stops a
   twelve-hour day where you went over from reading as a failed week: it
   was 400 calories, and Sunday is a day off.

   The one rule this must never break: never advise eating below the safety
   floor to claw back a bad week. When the arithmetic would demand that, it
   says so and tells them to let the week land short instead. */

const n0 = v => Math.round(v).toLocaleString();

function weekAdvice(w) {
  const p = getState().profile;
  const floor = safetyFloor(p);
  const drift = Math.round(w.drift);

  if (w.todayIdx === 0) return `Fresh week. ${n0(w.budget)} to spend across it — today sets the tone.`;
  if (Math.abs(drift) < 250) return `Right on track. Stick to ${n0(w.t.kcal)} a day and the week lands where it should.`;

  if (drift < 0) {
    return `You are ${n0(-drift)} under for the week so far. That is banked — you could eat about ${n0(w.perDay)} a day for the rest of it and still be exactly on target.`;
  }
  if (w.perDay >= floor) {
    return `You are ${n0(drift)} over for the week so far. Aim nearer ${n0(w.perDay)} a day for the rest of it and it evens out.`;
  }
  // Clawing this back would mean eating under the floor. Don't ask for that.
  const short = Math.max(0.1, drift / 3500).toFixed(1);
  return `You are ${n0(drift)} over for the week. Do not try to claw that back — eating under ${n0(floor)} is not safe and it does not work. Hold at ${n0(w.t.kcal)}, let this week land about ${short} lb behind, and start Sunday clean.`;
}

function weekStrip(w) {
  const ceiling = w.t.kcal * 1.4;
  return `<div class="wk">${w.days.map(d => {
    const h = d.kcal == null ? 0 : Math.min(100, Math.round((d.kcal / ceiling) * 100));
    const cls = d.future ? 'future' : (d.kcal > w.t.kcal ? 'over' : 'under');
    const title = d.future ? `${d.name}: still to come` : `${d.name}: ${n0(d.kcal)} kcal`;
    return `<div class="wk-d ${cls}${d.isToday ? ' now' : ''}" title="${esc(title)}">
      <div class="wk-bar"><i style="height:${h}%"></i></div>
      <span>${d.name[0]}</span>
    </div>`;
  }).join('')}</div>`;
}

/** The whole calculation, in order, in plain English. */
function showNumberExplainer() {
  const p = getState().profile;
  const t = targets(p);
  const base = bmr(p);
  const act = ACTIVITY[p.activity] || ACTIVITY.light;
  const ft = Math.floor(p.heightIn / 12);
  const inch = p.heightIn % 12;
  const floor = safetyFloor(p);
  const lo = Math.round(t.kcal * 0.9 / 10) * 10;
  const hi = Math.round(t.kcal * 1.1 / 10) * 10;

  openSheet(`
    <h2>Where ${n0(t.kcal)} comes from</h2>
    <p class="small muted">Nobody sticks to a number they don't understand. Here is the whole calculation, in order.</p>

    <ol class="steps">
      <li><strong>${n0(base)} a day just to exist.</strong>
        That is what your body burns keeping you alive — heartbeat, breathing, staying warm — before you move at all. It comes from your age (${p.age}), height (${ft}′${inch}″), weight (${p.currentWeight} lb) and sex.</li>
      <li><strong>${n0(t.maintenance)} once you add moving about.</strong>
        You told us: ${esc(act.label.toLowerCase())}. That multiplies the first figure by ${act.mult}. This is what you would eat to stay exactly the weight you are — no loss, no gain.</li>
      <li><strong>Take off ${n0(t.deficit)} a day to actually lose.</strong>
        A pound of fat is roughly 3,500 calories, so shifting ${t.ratePerWeek} lb a week means running about ${n0(t.deficit)} short every day.</li>
      <li><strong>${n0(t.maintenance)} − ${n0(t.deficit)} = ${n0(t.kcal)}.</strong>
        That is your number. Keep under it and the weight comes off at roughly ${t.ratePerWeek} lb a week.</li>
    </ol>

    ${t.floored ? `<div class="warn">The rate you picked would have pushed this below a safe floor, so it was raised to ${n0(t.kcal)}. Weight will come off a little slower. That is the right trade.</div>` : ''}

    <div class="note">
      <strong>The week is what counts, not the day.</strong>
      Your body cannot tell it is Tuesday. <strong>${n0(t.kcal * 7)} across the week</strong> is what decides whether the weight moves — so a twelve-hour day where you go over is genuinely cancelled out by a Sunday where you don't. Aim at the week and the days take care of themselves.
    </div>

    <h3>Why not go lower</h3>
    <p>You could lose faster by eating less. You should not, and this is the one place your age changes the answer. Past about fifty-five, a hard deficit takes muscle along with the fat, and muscle is what keeps your metabolism up. Lose it now and in a year you are heavier, hungrier, and burning less than when you started. So the cut here is capped at a quarter of what you burn, and floored at ${n0(floor)} calories whatever else you ask for.</p>

    <h3>What this number is not</h3>
    <ul>
      <li><strong>It is not exact.</strong> Metabolism estimates land within about 10% for most people, so read ${n0(t.kcal)} as somewhere around ${n0(lo)}–${n0(hi)}. If the scale has not moved after three or four honest weeks, the estimate is wrong for you — drop it by 150 and watch another fortnight.</li>
      <li><strong>It is not a pass or fail line.</strong> Over on a Tuesday is not failure. Over every Tuesday is a pattern worth a look.</li>
    </ul>

    <h3>What changes it</h3>
    <p>Your weight — it recalculates every time you weigh in, so the number drifts down as you do. Your activity level, and how fast you want to lose, both under Me → Profile. Nothing else moves it.</p>

    <div class="divider"></div>
    <div class="spread"><span class="muted">On track for ${p.goalWeight} lb</span><strong>${fmtDate(t.goalDate)}</strong></div>
    <button class="primary" id="xClose" style="width:100%;margin-top:16px">Got it</button>`);

  $('#xClose').onclick = closeSheet;
}

/* ═════════════════════ LOGGING WHAT YOU ATE ═══════════════════ */

/* The estimate is a first draft, never a fact. It goes into `draft`, gets
   shown with every number editable, and only becomes a log entry when the
   person presses Save. That review step is the whole feature — an app that
   silently banks a wrong calorie count is an app you stop believing, and an
   app you stop believing is one you stop opening. */

let draft = null;
let captureCtl = null;

function blankItem() {
  return { name: '', portion: '', kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
}

function itemTotals(items) {
  const out = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  for (const it of items || []) {
    for (const m of MACRO_KEYS) out[m] += Math.round(Number(it[m]) || 0);
  }
  return out;
}

function entryRow(e) {
  const when = new Date(e.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  return `
  <div class="entry" data-entry="${esc(e.id)}">
    ${e.photoId
      ? `<img class="thumb" data-photo="${esc(e.photoId)}" alt="">`
      : '<div class="thumb">🍽️</div>'}
    <div class="e-body">
      <span class="e-name">${esc(e.label)}</span>
      <span class="e-meta">
        <span>${SLOT_LABEL[e.slot] || esc(e.slot)} · ${when}</span>
        <span>${e.protein}g protein</span>
        ${e.confidence === 'low' ? '<span class="conf low">Rough</span>' : ''}
      </span>
    </div>
    <span class="e-kcal">${e.kcal}</span>
  </div>`;
}

/* Thumbnails come out of IndexedDB, so they arrive after the row is painted. */
async function paintThumbs() {
  for (const img of document.querySelectorAll('img[data-photo]')) {
    const url = await photoURL(img.dataset.photo);
    if (url) { img.src = url; continue; }
    const fallback = document.createElement('div');
    fallback.className = 'thumb';
    fallback.textContent = '🍽️';
    img.replaceWith(fallback);
  }
}

/* ── capture ───────────────────────────────────────────────────── */

async function startCapture(file) {
  const key = todayKey();
  captureCtl?.abort();
  captureCtl = new AbortController();
  const signal = captureCtl.signal;

  openSheet(`<h2>Reading the plate</h2>
    <div class="analyzing"><div class="spinner"></div>
      <div class="small muted">Shrinking the picture…</div></div>`);

  let prepared;
  try {
    prepared = await prepareImage(file);
  } catch (e) {
    closeSheet();
    toast(e instanceof VisionError ? e.message : 'That picture could not be used.');
    return;
  }
  if (signal.aborted) return;

  const url = URL.createObjectURL(prepared.blob);
  const base = {
    key, entryId: null, at: new Date().toISOString(),
    blob: prepared.blob, photoId: newPhotoId(), url, ownsUrl: true,
    slot: guessSlot(), note: '', label: '', items: [],
    confidence: 'low', uncertain: '', ruleFlag: '', coachNote: ''
  };

  // No key, no estimate — but the photo and the log still work by hand.
  if (!getState().settings.apiKey) {
    draft = { ...base, items: [blankItem()] };
    renderReview('No API key saved, so nothing was estimated. Type it in — or add a key in Me → AI coach and next time the numbers fill themselves in.');
    return;
  }

  openSheet(`<h2>Reading the plate</h2>
    <img class="shot" src="${url}" alt="The meal you photographed">
    <div class="analyzing"><div class="spinner"></div>
      <div class="small muted">Working out what is on it…</div></div>
    <button id="capCancel" style="width:100%">Cancel</button>`);
  $('#capCancel').onclick = () => {
    captureCtl?.abort();
    URL.revokeObjectURL(url);
    closeSheet();
  };

  try {
    const est = await estimateMeal(prepared, signal);
    if (signal.aborted) return;
    draft = { ...base, ...est };
    if (!draft.items.length) draft.items = [blankItem()];
    renderReview();
  } catch (e) {
    if (e.name === 'AbortError') return;
    // A failed estimate must never cost them the photo. Fall through to
    // typing it in rather than throwing the whole capture away.
    draft = { ...base, items: [blankItem()] };
    renderReview(e instanceof VisionError ? e.message : 'That estimate failed. Type it in instead.');
  }
}

/** Reopen a saved entry for editing. */
async function openEntry(key, id) {
  const entry = entriesFor(key).find(e => e.id === id);
  if (!entry) return;
  draft = {
    key,
    entryId: entry.id,
    at: entry.at,
    blob: null,
    photoId: entry.photoId || null,
    url: entry.photoId ? await photoURL(entry.photoId) : null,
    ownsUrl: false,                     // this URL is cached and shared
    slot: entry.slot,
    note: entry.note || '',
    label: entry.label,
    items: (entry.items || []).map(i => ({ ...i })),
    confidence: entry.confidence || 'low',
    uncertain: '', ruleFlag: '', coachNote: ''
  };
  if (!draft.items.length) draft.items = [blankItem()];
  renderReview();
}

/* ── the review sheet ──────────────────────────────────────────── */

function renderReview(warning = '') {
  if (!draft) return;
  const isEdit = !!draft.entryId;

  const rows = draft.items.map((it, i) => `
    <div class="item-row" data-i="${i}">
      <div class="ir-head">
        <input data-f="name" value="${esc(it.name)}" placeholder="What is it" aria-label="Food">
        <button class="ir-del" data-del="${i}" aria-label="Remove this">✕</button>
      </div>
      <input data-f="portion" value="${esc(it.portion)}" placeholder="How much — e.g. one thigh, about a cup"
             style="margin-top:8px" aria-label="Portion">
      <div class="nums">
        <div><label>kcal</label><input type="number" inputmode="numeric" min="0" data-f="kcal" value="${it.kcal}"></div>
        <div><label>Protein</label><input type="number" inputmode="numeric" min="0" data-f="protein" value="${it.protein}"></div>
        <div><label>Carbs</label><input type="number" inputmode="numeric" min="0" data-f="carbs" value="${it.carbs}"></div>
        <div><label>Fat</label><input type="number" inputmode="numeric" min="0" data-f="fat" value="${it.fat}"></div>
      </div>
    </div>`).join('');

  openSheet(`
    <h2>${isEdit ? 'Edit this meal' : 'Does this look right?'}</h2>
    ${draft.url ? `<img class="shot" src="${draft.url}" alt="The meal you photographed">` : ''}
    ${warning ? `<div class="warn">${esc(warning)}</div>` : ''}
    ${!warning && !isEdit ? `
      <div class="spread" style="margin:12px 0 4px">
        <span class="small muted">Estimated from the picture</span>
        <span class="conf ${draft.confidence}">${CONFIDENCE_LABEL[draft.confidence] || 'Rough guess'}</span>
      </div>` : ''}
    ${draft.uncertain ? `<div class="note"><strong>Couldn't tell:</strong> ${esc(draft.uncertain)}</div>` : ''}
    ${draft.ruleFlag ? `<div class="warn">${esc(draft.ruleFlag)}</div>` : ''}

    <div class="field" style="margin-top:14px">
      <label>What was it</label>
      <input id="dLabel" value="${esc(draft.label)}" placeholder="e.g. Chicken and salad">
    </div>

    <label>What's in it — correct anything that looks wrong</label>
    ${rows}
    <button class="tiny" id="dAdd" style="margin-bottom:14px">+ Add something it missed</button>

    <label>Ate more or less than that?</label>
    <div class="scaler">
      <button data-scale="0.25">¼</button>
      <button data-scale="0.5">Half</button>
      <button data-scale="0.75">¾</button>
      <button data-scale="1.5">1½×</button>
      <button data-scale="2">Double</button>
    </div>
    <div class="hint" style="margin:6px 0 14px">Scales every number above at once. Fiber scales with it too.</div>

    <div class="grid2">
      <div class="field"><label>Which meal</label>
        <select id="dSlot">
          ${SLOTS.map(s => `<option value="${s}" ${draft.slot === s ? 'selected' : ''}>${SLOT_LABEL[s]}</option>`).join('')}
        </select></div>
      <div class="field"><label>Note</label>
        <input id="dNote" value="${esc(draft.note)}" placeholder="e.g. lots of oil"></div>
    </div>

    <div class="card" id="dTotals" style="margin-bottom:14px"></div>
    ${draft.coachNote ? `<div class="note">${esc(draft.coachNote)}</div>` : ''}

    <div class="btn-row">
      <button class="primary" id="dSave" style="flex:2 1 60%">${isEdit ? 'Save changes' : 'Log it'}</button>
      <button id="dCancel" style="flex:1 1 30%">${isEdit ? 'Cancel' : 'Discard'}</button>
    </div>
    ${isEdit ? '<div class="center" style="margin-top:12px"><button class="tiny ghost danger" id="dDelete">Delete this meal</button></div>' : ''}
    <p class="small muted center" style="margin-top:14px">Estimates from a photograph, not laboratory values. Close enough to steer by, not exact.</p>`);

  paintTotals();

  $('#dLabel').addEventListener('input', e => { draft.label = e.target.value; });
  $('#dNote').addEventListener('input', e => { draft.note = e.target.value; });
  $('#dSlot').addEventListener('change', e => { draft.slot = e.target.value; });

  $('#sheetBody').querySelectorAll('.item-row').forEach(row => {
    const i = Number(row.dataset.i);
    row.querySelectorAll('[data-f]').forEach(inp => {
      inp.addEventListener('input', () => {
        const f = inp.dataset.f;
        draft.items[i][f] = (f === 'name' || f === 'portion')
          ? inp.value
          : Math.max(0, Math.round(num(inp.value, 0)));
        paintTotals();
      });
    });
    row.querySelector('[data-del]').onclick = () => {
      draft.items.splice(i, 1);
      if (!draft.items.length) draft.items = [blankItem()];
      renderReview(warning);
    };
  });

  $('#dAdd').onclick = () => { draft.items.push(blankItem()); renderReview(warning); };

  $('#sheetBody').querySelectorAll('[data-scale]').forEach(b => {
    b.onclick = () => {
      const k = Number(b.dataset.scale);
      draft.items = draft.items.map(it => {
        const out = { ...it };
        for (const m of MACRO_KEYS) out[m] = Math.max(0, Math.round((Number(it[m]) || 0) * k));
        return out;
      });
      renderReview(warning);
    };
  });

  $('#dSave').onclick = saveDraft;
  $('#dCancel').onclick = () => { discardDraft(); closeSheet(); };
  const del = $('#dDelete');
  if (del) del.onclick = deleteDraftEntry;
}

function paintTotals() {
  const box = $('#dTotals');
  if (!box || !draft) return;
  const tot = itemTotals(draft.items);
  const t = targets(getState().profile);
  const others = countedForDay(draft.key, draft.entryId);
  const after = others.kcal + tot.kcal;
  const proteinAfter = others.protein + tot.protein;
  const over = after > t.kcal;

  box.innerHTML = `
    <div class="spread"><strong>This meal</strong>
      <strong>${tot.kcal} kcal</strong></div>
    <div class="macro-row" style="margin-top:8px">
      <div class="macro"><b>${tot.protein}g</b>protein</div>
      <div class="macro"><b>${tot.carbs}g</b>carbs</div>
      <div class="macro"><b>${tot.fat}g</b>fat</div>
      <div class="macro"><b>${tot.fiber}g</b>fiber</div>
    </div>
    <div class="divider"></div>
    <div class="small ${over ? '' : 'muted'}">
      Puts you at <strong>${after}</strong> of ${t.kcal} kcal today
      and <strong>${proteinAfter}</strong> of ${t.protein} g protein.
      ${over ? `That is ${after - t.kcal} over. One meal is noise — log it anyway.`
             : `${t.kcal - after} kcal still to spend.`}
    </div>`;
}

async function saveDraft() {
  if (!draft) return;
  const d = draft;
  const items = d.items.filter(i => (i.name || '').trim() || i.kcal > 0);
  if (!items.length) { toast('Add at least one thing before saving.'); return; }

  // If they never named the plate, name it after what is on it — a log row
  // reading "Meal" tells them nothing three days later.
  const typed = (d.label || '').trim();
  const fromItems = items.map(i => (i.name || '').trim()).filter(Boolean).slice(0, 2).join(' and ');

  const entry = {
    id: d.entryId || newEntryId(),
    at: d.at,
    slot: d.slot,
    label: typed || fromItems || 'Meal',
    items,
    ...itemTotals(items),
    photoId: d.photoId || null,
    confidence: d.confidence,
    note: (d.note || '').trim(),
    source: d.photoId ? 'photo' : 'manual'
  };

  // The photo is only written once the entry is real, so a discarded
  // capture never leaves an orphan blob behind.
  if (d.blob && d.photoId) await putPhoto(d.photoId, d.blob);

  if (d.entryId) updateEntry(d.key, d.entryId, entry);
  else addEntry(d.key, entry);

  const wasEdit = !!d.entryId;
  discardDraft();
  closeSheet();
  renderToday();
  toast(wasEdit ? 'Updated.' : `Logged — ${entry.kcal} kcal.`);
}

async function deleteDraftEntry() {
  if (!draft?.entryId) return;
  if (!confirm('Delete this meal from today?')) return;
  const { key, entryId, photoId } = draft;
  removeEntry(key, entryId);
  if (photoId) await deletePhoto(photoId);
  discardDraft();
  closeSheet();
  renderToday();
  toast('Deleted.');
}

function discardDraft() {
  if (draft?.ownsUrl && draft.url) URL.revokeObjectURL(draft.url);
  draft = null;
}

/* ═══════════════════════════ WEEK ═════════════════════════════ */

function renderPlan() {
  const s = getState();
  const t = targets(s.profile);
  header('Your week', s.plan ? `Week of ${fmtDate(parseKey(s.plan.weekStart))}` : '');

  if (!s.plan) {
    $('#planHost').innerHTML = `<div class="card center">
      <p>No plan yet.</p><button class="primary" id="gen">Build my week</button></div>`;
    $('#gen').onclick = regenerate;
    return;
  }

  const tk = todayKey();
  const cards = s.plan.days.map((d, i) => {
    const rows = SLOTS.map(slot => {
      const sl = d.slots[slot];
      if (!sl) return '';
      const r = BY_ID[sl.recipeId];
      if (!r) return '';
      const n = sl.portions || 1;
      return `
      <div class="meal" data-recipe="${r.id}" data-day="${i}" data-slot="${slot}">
        <div class="m-body">
          <span class="m-slot">${SLOT_LABEL[slot]}</span>
          <span class="m-name">${esc(r.name)}${n !== 1 ? ` <span class="muted">× ${n}</span>` : ''}</span>
          <span class="m-meta">
            ${sl.leftover ? '<span class="badge leftover">♻️ leftovers</span>'
                          : `<span class="badge ${r.effort}">${EFFORT_LABEL[r.effort]}</span><span>${r.minutes} min</span>`}
            ${sl.compromised ? '<span class="badge project">⚠︎ stretched</span>' : ''}
          </span>
        </div>
        <span class="m-kcal">${Math.round(r.kcal * n)}</span>
      </div>`;
    }).join('');

    return `
    <div class="card flush day-card ${d.date === tk ? 'today' : ''}">
      <div class="day-head">
        <div>
          <span class="d-name">${DAY_FULL[d.dow]}${d.date === tk ? ' · today' : ''}</span>
          <div class="d-meta">${d.hours}h work · ${d.totals.kcal} kcal · ${d.totals.protein}g protein · ${d.totals.minutes} min cook</div>
        </div>
        <div style="text-align:right">
          <span class="daytype ${d.type.key}">${d.type.label}</span>
          ${d.batchDay ? '<div class="batch-flag">batch day</div>' : ''}
        </div>
      </div>
      ${rows}
    </div>`;
  }).join('');

  const weekKcal = s.plan.days.reduce((a, d) => a + d.totals.kcal, 0);
  const weekCook = s.plan.days.reduce((a, d) => a + d.totals.minutes, 0);
  const compromised = s.plan.days.reduce(
    (a, d) => a + Object.values(d.slots).filter(x => x.compromised).length, 0);

  $('#planHost').innerHTML = `
  <div class="card">
    <div class="spread">
      <div><b style="font-size:19px">${Math.round(weekKcal / 7)}</b><div class="small muted">avg kcal/day · target ${t.kcal}</div></div>
      <div style="text-align:right"><b style="font-size:19px">${Math.round(weekCook / 60 * 10) / 10}h</b><div class="small muted">total cooking this week</div></div>
    </div>
    <div class="btn-row" style="margin-top:14px">
      <button id="grocery" class="primary">🛒 Grocery list</button>
      <button id="regen" class="ghost">↻ Rebuild week</button>
    </div>
  </div>
  ${compromised ? `<div class="warn">Your allergies and dislikes rule out enough of the recipe bank that ${compromised} meal${compromised > 1 ? 's' : ''} had to stretch a rule — taking longer to make than the day really allows. They are marked below. Loosening one dislike would fix it.</div>` : ''}
  <p class="small muted">Tap any meal to see the recipe or swap it. Leftovers are routed to your heaviest days on purpose.</p>
  ${cards}`;

  $('#regen').onclick = regenerate;
  $('#grocery').onclick = showGrocery;
  $('#planHost').querySelectorAll('.meal').forEach(m => {
    m.onclick = () => showRecipe(m.dataset.recipe, { slot: m.dataset.slot, dayIndex: Number(m.dataset.day) });
  });
}

function regenerate() {
  update(s => {
    const t = targets(s.profile);
    s.plan = buildWeek(s.profile, t.kcal, (Date.now() + Math.floor(Math.random() * 9999)) & 0xffff, t.protein);
    s.grocery = { checked: [], generatedFor: s.plan.weekStart };
  });
  renderPlan();
  toast('New week built.');
}

function showGrocery() {
  const s = getState();
  const list = groceryList(s.plan);
  const checked = new Set(s.grocery.checked);
  const total = Object.values(list).reduce((a, arr) => a + arr.length, 0);

  const body = Object.entries(list).map(([aisle, items]) => `
    <div class="aisle-head">${aisle}</div>
    ${items.map(it => {
      const id = `${it.n}||${it.u}`;
      return `<label class="grocery-item ${checked.has(id) ? 'checked' : ''}">
        <input type="checkbox" data-g="${esc(id)}" ${checked.has(id) ? 'checked' : ''}>
        <span>${esc(it.n)} <span class="muted small">— ${esc(fmtQty(it))}</span></span>
      </label>`;
    }).join('')}`).join('');

  openSheet(`
    <div class="spread"><h2>Grocery list</h2><span class="small muted">${total} items</span></div>
    <p class="small muted">Everything the week's cooking needs, grouped by aisle. Leftover meals aren't listed twice.</p>
    <div class="btn-row" style="margin-bottom:6px">
      <button class="tiny" id="gCopy">Copy as text</button>
      <button class="tiny ghost" id="gClear">Uncheck all</button>
    </div>
    ${body}
    <button class="primary" style="width:100%;margin-top:18px" onclick="document.getElementById('sheet').classList.remove('open')">Done</button>`);

  $('#sheetBody').querySelectorAll('[data-g]').forEach(cb => {
    cb.onchange = () => {
      update(st => {
        const set = new Set(st.grocery.checked);
        cb.checked ? set.add(cb.dataset.g) : set.delete(cb.dataset.g);
        st.grocery.checked = [...set];
      });
      cb.closest('.grocery-item').classList.toggle('checked', cb.checked);
    };
  });
  $('#gClear').onclick = () => { update(st => { st.grocery.checked = []; }); showGrocery(); };
  $('#gCopy').onclick = () => {
    const text = Object.entries(list).map(([aisle, items]) =>
      `${aisle.toUpperCase()}\n` + items.map(i => `- ${i.n} — ${fmtQty(i)}`).join('\n')).join('\n\n');
    copy(text, 'Grocery list copied.');
  };
}

/* ═══════════════════════════ RECIPES ══════════════════════════ */

let recipeFilter = 'all';

function renderRecipes() {
  header('Recipes', `${RECIPES.length} everyday recipes`);
  const filters = [
    ['all', 'All'], ['breakfast', 'Breakfast'], ['lunch', 'Lunch'], ['dinner', 'Dinner'],
    ['snack', 'Snacks'], ['zero', 'No cook'], ['batch', 'Batch cook'], ['high-protein', 'High protein']
  ];

  const list = RECIPES.filter(r => {
    if (recipeFilter === 'all') return true;
    if (recipeFilter === 'zero') return r.effort === 'zero';
    if (recipeFilter === 'batch') return !!r.batch;
    if (recipeFilter === 'high-protein') return r.protein >= 28;
    return r.meal.includes(recipeFilter);
  }).sort((a, b) => a.minutes - b.minutes);

  $('#recipesHost').innerHTML = `
    <div class="filters">
      ${filters.map(([k, l]) => `<button data-f="${k}" class="${recipeFilter === k ? 'on' : ''}">${l}</button>`).join('')}
    </div>
    <div class="card flush">
      ${list.map(r => `
        <div class="meal" data-recipe="${r.id}">
          <div class="m-body">
            <span class="m-name">${esc(r.name)}</span>
            <span class="m-meta">
              <span class="badge ${r.effort}">${EFFORT_LABEL[r.effort]}</span>
              <span>${r.minutes} min</span><span>${r.protein}g protein</span>
              ${r.batch ? `<span class="badge project">makes ${r.servings}</span>` : ''}
            </span>
          </div>
          <span class="m-kcal">${r.kcal}</span>
        </div>`).join('')}
    </div>`;

  $('#recipesHost').querySelectorAll('[data-f]').forEach(b =>
    b.onclick = () => { recipeFilter = b.dataset.f; renderRecipes(); });
  $('#recipesHost').querySelectorAll('.meal').forEach(m =>
    m.onclick = () => showRecipe(m.dataset.recipe));
}

function showRecipe(id, ctx = {}) {
  const r = BY_ID[id];
  if (!r) return;
  const canSwap = ctx.dayIndex !== undefined && ctx.dayIndex >= 0 && ctx.slot;

  openSheet(`
    <h2>${esc(r.name)}</h2>
    <div class="m-meta" style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">
      <span class="badge ${r.effort}">${EFFORT_LABEL[r.effort]}</span>
      <span class="badge">${r.minutes} min</span>
      <span class="badge">makes ${r.servings}</span>
      ${(r.tags || []).slice(0, 3).map(t => `<span class="badge">${esc(t)}</span>`).join('')}
    </div>

    <div class="card" style="margin-bottom:16px">
      <div class="macro-row" style="margin-top:0">
        <div class="macro"><b>${r.kcal}</b>calories</div>
        <div class="macro"><b>${r.protein}g</b>protein</div>
        <div class="macro"><b>${r.carbs}g</b>carbs</div>
        <div class="macro"><b>${r.fat}g</b>fat</div>
      </div>
      <div class="small muted" style="margin-top:10px">Per serving · ${r.fiber}g fiber</div>
    </div>
    ${ctx.portions && ctx.portions !== 1 ? `<div class="note">Your plan puts you down for <strong>${ctx.portions} servings</strong> of this — about ${Math.round(r.kcal * ctx.portions)} calories. Scale the ingredients below by ${ctx.portions}.</div>` : ''}

    ${r.note ? `<div class="note">${esc(r.note)}</div>` : ''}

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i =>
      `<li>${esc(i.n)}${i.q !== null && i.q !== undefined ? ` — <strong>${esc(fmtQty(i))}</strong>` : ` — ${esc(i.u)}`}</li>`).join('')}</ul>

    <h3>Method</h3>
    <ol class="steps">${r.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>

    <div class="btn-row" style="margin-top:20px">
      ${canSwap ? '<button id="rSwap">Swap this meal</button>' : ''}
      <button id="rAsk">Ask the coach about it</button>
    </div>
    <button class="ghost" style="width:100%;margin-top:8px" id="rClose">Close</button>`);

  $('#rClose').onclick = closeSheet;
  const sw = $('#rSwap');
  if (sw) sw.onclick = () => {
    update(s => swapSlot(s.plan, ctx.dayIndex, ctx.slot, s.profile));
    closeSheet();
    currentTab === 'today' ? renderToday() : renderPlan();
    toast('Swapped.');
  };
  $('#rAsk').onclick = () => {
    closeSheet();
    show('coach');
    setTimeout(() => sendMessage(`Tell me about "${r.name}" — how do I make it work for my targets, and what can I swap if I'm missing something?`), 60);
  };
}

/* ═══════════════════════════ COACH ════════════════════════════ */

let streaming = false;
let abortCtl = null;

function renderCoach() {
  const s = getState();
  header('Coach', s.settings.apiKey ? 'Knows your plan, your targets and today' : 'No API key yet');

  $('#coachHost').innerHTML = `
    ${!s.settings.apiKey ? `
      <div class="card">
        <h3>Add an API key to chat</h3>
        <p class="small">The coach runs on Claude and needs your own Anthropic API key. Everything else in the app works without it.</p>
        <div class="btn-row">
          <button class="primary" id="cSettings">Add a key</button>
          <button id="cCopy">Copy my context instead</button>
        </div>
        <div class="hint" style="margin-top:8px">"Copy my context" puts your full profile and plan on the clipboard so you can paste it into the Claude app and get the same answers by hand.</div>
      </div>` : ''}

    <div class="quick-grid" id="quick">
      ${QUICK_PROMPTS.map((q, i) => `<button data-q="${i}"><span class="q-ico">${q.icon}</span>${esc(q.label)}</button>`).join('')}
    </div>

    <div id="chatScroll"></div>

    <div class="composer">
      <textarea id="chatIn" rows="1" placeholder="Ask anything…" enterkeyhint="send"></textarea>
      <button class="primary" id="chatSend" aria-label="Send">↑</button>
    </div>
    <div class="center" style="margin-top:10px">
      <button class="tiny ghost" id="chatClear">Clear conversation</button>
    </div>`;

  drawChat();

  const set = $('#cSettings'); if (set) set.onclick = () => { show('me'); setTimeout(() => $('#apiKey')?.focus(), 120); };
  const cc = $('#cCopy'); if (cc) cc.onclick = () => copy(contextPack(), 'Context copied — paste it into Claude.');

  $('#quick').querySelectorAll('[data-q]').forEach(b =>
    b.onclick = () => sendMessage(QUICK_PROMPTS[Number(b.dataset.q)].text));

  const input = $('#chatIn');
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(132, input.scrollHeight) + 'px';
  });
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#chatSend').click(); }
  });
  $('#chatSend').onclick = () => {
    const text = input.value.trim();
    if (!text) return;
    input.value = ''; input.style.height = 'auto';
    sendMessage(text);
  };
  $('#chatClear').onclick = () => {
    update(s2 => { s2.chat = []; });
    drawChat();
  };
}

/** Minimal markdown → HTML. Escapes first, so this is safe. */
function md(text) {
  let h = esc(text);
  h = h.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  h = h.replace(/(^|\n)#{1,4}\s*(.+)/g, '$1<strong>$2</strong>');
  h = h.replace(/(^|\n)[-*•]\s+/g, '$1• ');
  return h;
}

function drawChat(pendingText = null) {
  const box = $('#chatScroll');
  if (!box) return;
  const s = getState();
  box.innerHTML = s.chat.map(m =>
    `<div class="msg ${m.role === 'user' ? 'user' : m.role === 'error' ? 'err' : 'bot'}">${md(m.content)}</div>`
  ).join('') + (pendingText !== null
    ? `<div class="msg bot">${md(pendingText)}<span class="cursor">▍</span></div>` : '');
  box.scrollIntoView({ block: 'end' });
  window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
}

async function sendMessage(text) {
  if (streaming) { toast('Still answering — one moment.'); return; }
  const s = getState();

  update(st => { st.chat.push({ role: 'user', content: text }); });
  drawChat('');

  if (!s.settings.apiKey) {
    update(st => {
      st.chat.push({
        role: 'error',
        content: 'No API key saved. Add one in Me → AI coach, or tap "Copy my context" and paste it into the Claude app.'
      });
    });
    drawChat();
    return;
  }

  streaming = true;
  abortCtl = new AbortController();
  const history = getState().chat.filter(m => m.role !== 'error');
  let acc = '';

  try {
    const full = await askCoach(history, chunk => { acc += chunk; drawChat(acc); }, abortCtl.signal);
    update(st => { st.chat.push({ role: 'assistant', content: full }); });
  } catch (e) {
    if (e.name === 'AbortError') {
      if (acc.trim()) update(st => { st.chat.push({ role: 'assistant', content: acc }); });
    } else {
      const msg = e instanceof ApiError ? e.message : 'Something went wrong talking to the API.';
      update(st => { st.chat.push({ role: 'error', content: msg }); });
    }
  } finally {
    streaming = false;
    abortCtl = null;
    drawChat();
  }
}

/* ═══════════════════════════ ME ═══════════════════════════════ */

function renderMe() {
  const s = getState();
  const p = s.profile;
  const t = targets(p);
  header('Me', 'Profile, targets and settings');

  $('#meHost').innerHTML = `
  <div class="card">
    <div class="card-title"><h3>Your numbers</h3>
      <button class="tiny" id="whyNum2">Where from?</button></div>
    <p style="margin-bottom:14px">Keep under <strong>${n0(t.kcal)} calories</strong> a day — which is
      <strong>${n0(t.kcal * 7)} across the week</strong>, and the week is the total that actually
      decides whether the weight moves. At that rate you reach ${p.goalWeight} lb around
      ${fmtDate(t.goalDate)}.</p>
    <div class="macro-row" style="margin-top:0">
      <div class="macro"><b>${t.kcal}</b>kcal/day</div>
      <div class="macro"><b>${t.protein}g</b>protein</div>
      <div class="macro"><b>${t.carbs}g</b>carbs</div>
      <div class="macro"><b>${t.fat}g</b>fat</div>
    </div>
    <div class="divider"></div>
    <div class="small stack">
      <div class="spread"><span class="muted">Maintenance (TDEE)</span><strong>${t.maintenance} kcal</strong></div>
      <div class="spread"><span class="muted">Daily deficit</span><strong>${t.deficit} kcal</strong></div>
      <div class="spread"><span class="muted">Expected rate</span><strong>${t.ratePerWeek} lb/week</strong></div>
      <div class="spread"><span class="muted">Left to lose</span><strong>${Math.round(t.toLose * 10) / 10} lb</strong></div>
      <div class="spread"><span class="muted">On track for</span><strong>${fmtDate(t.goalDate)}</strong></div>
      <div class="spread"><span class="muted">Working</span><strong>${weeklyHours(p.workHours)} h/week</strong></div>
    </div>
    ${t.floored ? '<div class="warn">Your requested rate would have pushed calories below a safe floor, so the target was raised. Weight will come off slightly slower — that is the right trade.</div>' : ''}
  </div>

  <div class="card">
    <div class="card-title"><h3>Weight</h3><span class="small muted">7-day trend</span></div>
    ${weightChart()}
  </div>

  <div class="card">
    <div class="card-title"><h3>Context file</h3>
      <button class="tiny" id="ctxCopy">Copy</button></div>
    <p class="small muted">This is what the AI coach is given on every single message. It is the whole method: the model isn't guessing about you, it's reading this.</p>
    <div class="ctx">${esc(buildContextFile())}</div>
    <div class="field" style="margin-top:14px">
      <label>Anything else the coach should know</label>
      <textarea id="pNotes" placeholder="e.g. I travel every other week. My wife does the shopping on Saturdays. I hate cooking after 8pm.">${esc(p.notes)}</textarea>
      <div class="hint">Free text. Gets appended to the context file above.</div>
    </div>
    <button class="tiny" id="saveNotes">Save notes</button>
  </div>

  <div class="card">
    <div class="card-title"><h3>AI coach</h3></div>
    <div class="field">
      <label>Anthropic API key</label>
      <input id="apiKey" type="password" value="${esc(s.settings.apiKey)}" placeholder="sk-ant-..." autocomplete="off" spellcheck="false">
      <div class="hint">Stored on this device only. Get one at console.anthropic.com.</div>
    </div>
    <div class="grid2">
      <div class="field"><label>Model</label>
        <select id="model">
          <option value="claude-opus-5" ${s.settings.model === 'claude-opus-5' ? 'selected' : ''}>Opus 5 — best</option>
          <option value="claude-sonnet-5" ${s.settings.model === 'claude-sonnet-5' ? 'selected' : ''}>Sonnet 5 — cheaper</option>
          <option value="claude-haiku-4-5" ${s.settings.model === 'claude-haiku-4-5' ? 'selected' : ''}>Haiku 4.5 — cheapest</option>
        </select></div>
      <div class="field"><label>Answer depth</label>
        <select id="effort">
          <option value="low" ${(s.settings.effort || 'low') === 'low' ? 'selected' : ''}>Fast</option>
          <option value="medium" ${s.settings.effort === 'medium' ? 'selected' : ''}>Balanced</option>
          <option value="high" ${s.settings.effort === 'high' ? 'selected' : ''}>Thorough</option>
        </select></div>
    </div>
    <div class="btn-row">
      <button class="primary" id="saveKey">Save</button>
      <button id="testK">Test key</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><h3>Profile</h3></div>
    <div class="grid2">
      <div class="field"><label>Current weight (lb)</label>
        <input id="mCur" type="number" step="0.1" inputmode="decimal" value="${p.currentWeight}"></div>
      <div class="field"><label>Goal weight (lb)</label>
        <input id="mGoal" type="number" step="0.1" inputmode="decimal" value="${p.goalWeight}"></div>
    </div>
    <div class="grid2">
      <div class="field"><label>Age</label><input id="mAge" type="number" inputmode="numeric" value="${p.age}"></div>
      <div class="field"><label>Rate (lb/week)</label>
        <select id="mRate">
          <option value="0.75" ${p.rate == 0.75 ? 'selected' : ''}>0.75</option>
          <option value="1" ${p.rate == 1 ? 'selected' : ''}>1.0</option>
          <option value="1.25" ${p.rate == 1.25 ? 'selected' : ''}>1.25</option>
        </select></div>
    </div>
    <div class="field"><label>Activity outside work</label>
      <select id="mAct">${Object.entries(ACTIVITY).map(([k, v]) =>
        `<option value="${k}" ${p.activity === k ? 'selected' : ''}>${esc(v.label)}</option>`).join('')}</select></div>
    <div class="field"><label>Cooking nights a week</label>
      <select id="mNights">${[0,1,2,3,4,5,6,7].map(n =>
        `<option value="${n}" ${p.cookNights == n ? 'selected' : ''}>${n}</option>`).join('')}</select></div>
    <div class="field"><label>Won't eat</label><input id="mDis" value="${esc(p.dislikes)}"></div>
    <div class="field"><label>Allergies</label><input id="mAll" value="${esc(p.allergies)}"></div>
    <div class="field"><label>Conditions / medications</label><input id="mCond" value="${esc(p.conditions)}"></div>
    <button class="primary" id="saveProfile" style="width:100%">Save profile</button>
  </div>

  <div class="card">
    <div class="card-title"><h3>What are you going for?</h3></div>
    <p class="small muted">This changes the emphasis and the walking, not the calorie maths — that stays the same whichever you pick.</p>
    ${FOCUS_OPTIONS.map(f => `
      <button class="prep-slot${(p.focus || 'weight') === f.key ? ' on' : ''}" data-focus="${f.key}">
        <span class="ps-ico">${f.icon}</span>
        <span class="ps-body"><strong>${esc(f.label)}</strong>
          <span class="small muted">${esc(f.blurb)}</span></span>
        <span class="ps-go">${(p.focus || 'weight') === f.key ? '✓' : '›'}</span>
      </button>`).join('')}
  </div>

  <div class="card">
    <div class="card-title"><h3>Your kitchen</h3></div>
    <p class="small muted">Owning an oven and being willing to switch it on at nine at night after a twelve-hour day are different questions. The second one is what decides whether a plan survives.</p>
    ${EQUIPMENT.map(e => `
      <div class="spread" style="margin-bottom:10px">
        <label style="margin:0;flex:1">${esc(e.label)}</label>
        <select data-equip="${e.key}" style="width:172px">
          <option value="ask"   ${!['yes','light','no'].includes(p.equipment?.[e.key]) ? 'selected' : ''}>— not said —</option>
          <option value="yes"   ${p.equipment?.[e.key] === 'yes' ? 'selected' : ''}>Happy to use it</option>
          <option value="light" ${p.equipment?.[e.key] === 'light' ? 'selected' : ''}>Not on a work night</option>
          <option value="no"    ${p.equipment?.[e.key] === 'no' ? 'selected' : ''}>Don't have one</option>
        </select>
      </div>`).join('')}
    <button class="primary" id="saveEquip" style="width:100%;margin-top:6px">Save & rebuild week</button>
    <div class="hint">Anything left unanswered stays unanswered — the coach is told it doesn't know, rather than guessing.</div>
  </div>

  <div class="card">
    <div class="card-title"><h3>Foods you actually like</h3></div>
    <p class="small muted">The coach reaches for these first when it improvises, and the planner leans towards recipes that use them.</p>
    <div class="chips" id="favChips">
      ${(p.favorites || []).length
        ? p.favorites.map((f, i) => `<span class="chip">${esc(f)}<button data-favdel="${i}" aria-label="Remove ${esc(f)}">✕</button></span>`).join('')
        : '<span class="small muted">Nothing added yet.</span>'}
    </div>
    <div class="btn-row" style="margin-top:12px">
      <input id="favIn" placeholder="e.g. rotisserie chicken" style="flex:2 1 60%">
      <button id="favAdd" style="flex:1 1 30%">Add</button>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><h3>Walking</h3>
      <button class="tiny" id="showMove">The sessions</button></div>
    <p class="small muted" style="margin-bottom:10px">${esc(weeklyTarget(p.focus || 'weight').line)}</p>
    <div class="macro-row" style="margin-top:0">
      <div class="macro"><b>${zones(p.age).max}</b>max heart rate</div>
      <div class="macro"><b>${zones(p.age).moderate.lo}–${zones(p.age).moderate.hi}</b>moderate</div>
      <div class="macro"><b>${zones(p.age).hard.lo}–${zones(p.age).hard.hi}</b>hard</div>
      <div class="macro"><b>${weeklyTarget(p.focus || 'weight').sessions}</b>a week</div>
    </div>
  </div>

  <div class="card">
    <div class="card-title"><h3>Who cooks what</h3></div>
    <p class="small muted">If someone else makes dinner, the app should not be planning one. Set it here and those meals stop cluttering your week.</p>
    ${SLOTS.map(sl => `
      <div class="spread" style="margin-bottom:10px">
        <label style="margin:0;flex:1">${SLOT_LABEL[sl]}</label>
        <select data-who="${sl}" style="width:150px">
          <option value="me" ${(p.whoCooks?.[sl] || 'me') === 'me' ? 'selected' : ''}>I handle it</option>
          <option value="other" ${p.whoCooks?.[sl] === 'other' ? 'selected' : ''}>Someone else</option>
          <option value="skip" ${p.whoCooks?.[sl] === 'skip' ? 'selected' : ''}>I skip it</option>
        </select>
      </div>`).join('')}
    <button class="primary" id="saveWho" style="width:100%;margin-top:6px">Save & rebuild week</button>
  </div>

  <div class="card">
    <div class="card-title"><h3>Typical work week</h3></div>
    <p class="small muted">Change these and rebuild the week — the whole plan reshapes around them.</p>
    ${DAY_FULL.map((d, i) => `
      <div class="spread" style="margin-bottom:9px">
        <label style="margin:0;flex:1">${d}</label>
        <input type="number" min="0" max="24" step="0.5" inputmode="decimal"
               data-mwh="${i}" value="${p.workHours[i]}" style="width:96px">
      </div>`).join('')}
    <button class="primary" id="saveHours" style="width:100%;margin-top:6px">Save & rebuild week</button>
  </div>

  <div class="card">
    <div class="card-title"><h3>Your data</h3></div>
    <p class="small muted">Everything lives in this browser. Back it up before you clear site data or change phone.</p>
    <div class="btn-row">
      <button id="expBtn">Export backup</button>
      <button id="impBtn">Import</button>
    </div>
    <input type="file" id="impFile" accept="application/json" hidden>
    <div class="divider"></div>
    <button class="danger" id="resetBtn" style="width:100%">Erase everything and start over</button>
  </div>

  <div class="warn">
    <strong>Not medical advice.</strong> This is general nutrition guidance built from your own numbers. It does not know your bloodwork. If you take medication — especially for blood pressure, diabetes, or blood thinning — talk to your doctor before and during a weight-loss push, because losing 25 lb genuinely changes what your body needs.
  </div>
  <p class="small muted center" style="padding-bottom:20px">Calorie and macro figures are good-faith estimates, not laboratory values.</p>`;

  $('#whyNum2').onclick = showNumberExplainer;
  $('#ctxCopy').onclick = () => copy(buildContextFile(), 'Context file copied.');
  $('#saveNotes').onclick = () => { update(st => { st.profile.notes = $('#pNotes').value; }); toast('Saved.'); renderMe(); };

  $('#saveKey').onclick = () => {
    update(st => {
      st.settings.apiKey = $('#apiKey').value.trim();
      st.settings.model = $('#model').value;
      st.settings.effort = $('#effort').value;
    });
    toast('Saved.');
  };
  $('#testK').onclick = async () => {
    const btn = $('#testK');
    btn.disabled = true; btn.textContent = 'Testing…';
    const r = await testKey($('#apiKey').value, $('#model').value);
    btn.disabled = false; btn.textContent = 'Test key';
    toast(r.ok ? 'Key works.' : `Failed (${r.status}): ${r.detail || 'check the key'}`);
  };

  $('#saveProfile').onclick = () => {
    update(st => {
      const q = st.profile;
      q.currentWeight = num($('#mCur').value, q.currentWeight);
      q.goalWeight = num($('#mGoal').value, q.goalWeight);
      q.age = num($('#mAge').value, q.age);
      q.rate = num($('#mRate').value, q.rate);
      q.activity = $('#mAct').value;
      q.cookNights = num($('#mNights').value, q.cookNights);
      q.dislikes = $('#mDis').value;
      q.allergies = $('#mAll').value;
      q.conditions = $('#mCond').value;
    });
    toast('Profile saved.');
    renderMe();
  };

  $('#meHost').querySelectorAll('[data-focus]').forEach(b => {
    b.onclick = () => {
      update(st => { st.profile.focus = b.dataset.focus; });
      renderMe();
      toast('Saved.');
    };
  });

  $('#saveEquip').onclick = () => {
    update(st => {
      st.profile.equipment = st.profile.equipment || {};
      document.querySelectorAll('[data-equip]').forEach(sel => {
        st.profile.equipment[sel.dataset.equip] = sel.value;
      });
      const t2 = targets(st.profile);
      st.plan = buildWeek(st.profile, t2.kcal, Date.now() & 0xffff, t2.protein);
      st.grocery = { checked: [], generatedFor: st.plan.weekStart };
    });
    toast('Week rebuilt around your kitchen.');
    show('plan');
  };

  const addFav = () => {
    const v = $('#favIn').value.trim();
    if (!v) return;
    update(st => {
      st.profile.favorites = st.profile.favorites || [];
      if (!st.profile.favorites.some(f => f.toLowerCase() === v.toLowerCase())) st.profile.favorites.push(v);
    });
    renderMe();
  };
  $('#favAdd').onclick = addFav;
  $('#favIn').addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addFav(); } });
  $('#favChips').querySelectorAll('[data-favdel]').forEach(b => {
    b.onclick = () => {
      update(st => { st.profile.favorites.splice(Number(b.dataset.favdel), 1); });
      renderMe();
    };
  });

  $('#showMove').onclick = showMovement;

  $('#saveWho').onclick = () => {
    update(st => {
      st.profile.whoCooks = st.profile.whoCooks || {};
      document.querySelectorAll('[data-who]').forEach(sel => {
        st.profile.whoCooks[sel.dataset.who] = sel.value;
      });
      const t2 = targets(st.profile);
      st.plan = buildWeek(st.profile, t2.kcal, Date.now() & 0xffff, t2.protein);
      st.grocery = { checked: [], generatedFor: st.plan.weekStart };
    });
    toast('Week rebuilt around who cooks.');
    show('plan');
  };

  $('#saveHours').onclick = () => {
    update(st => {
      document.querySelectorAll('[data-mwh]').forEach(inp => {
        st.profile.workHours[Number(inp.dataset.mwh)] = Math.max(0, Math.min(24, num(inp.value, 0)));
      });
      const t2 = targets(st.profile);
      st.plan = buildWeek(st.profile, t2.kcal, Date.now() & 0xffff, t2.protein);
      st.grocery = { checked: [], generatedFor: st.plan.weekStart };
    });
    toast('Week rebuilt around your new hours.');
    show('plan');
  };

  $('#expBtn').onclick = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `mediterranean-plan-${todayKey()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#impBtn').onclick = () => $('#impFile').click();
  $('#impFile').onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try { importJSON(await f.text()); toast('Restored.'); renderMe(); }
    catch { toast('That file could not be read.'); }
  };
  $('#resetBtn').onclick = () => {
    if (!confirm('Erase your profile, plan, weight history and chat? This cannot be undone.')) return;
    resetAll();
    location.reload();
  };
}

function weightChart() {
  const s = weightSeries();
  const p = getState().profile;
  if (s.length < 2) {
    return '<p class="small muted">Two weigh-ins and a chart appears here. Weigh at the same time each morning — the daily number bounces 2–3 lb on water alone, and the trend line is what actually matters.</p>';
  }
  const W = 320, H = 130, pad = 8;
  const vals = s.map(x => x.weight);
  const lo = Math.min(...vals, p.goalWeight) - 2;
  const hi = Math.max(...vals) + 2;
  const span = Math.max(1, hi - lo);
  const x = i => pad + (i / (s.length - 1)) * (W - pad * 2);
  const y = v => pad + (1 - (v - lo) / span) * (H - pad * 2);

  const pts = s.map((d, i) => `${x(i).toFixed(1)},${y(d.weight).toFixed(1)}`).join(' ');

  // 7-point trailing average — the honest line
  const trend = s.map((_, i) => {
    const w = s.slice(Math.max(0, i - 6), i + 1);
    return w.reduce((a, b) => a + b.weight, 0) / w.length;
  });
  const tpts = trend.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  const gy = y(p.goalWeight).toFixed(1);

  return `
  <svg class="chart" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img" aria-label="Weight over time">
    <line x1="${pad}" y1="${gy}" x2="${W - pad}" y2="${gy}" stroke="var(--olive)" stroke-width="1.5" stroke-dasharray="5 4" opacity=".8"/>
    <polyline points="${pts}" fill="none" stroke="var(--border)" stroke-width="1.5"/>
    <polyline points="${tpts}" fill="none" stroke="var(--sea)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <div class="spread small muted" style="margin-top:6px">
    <span>${s[0].date.slice(5)}</span>
    <span style="color:var(--olive)">— goal ${p.goalWeight} lb</span>
    <span>${s[s.length - 1].weight} lb</span>
  </div>`;
}

/* ── clipboard ─────────────────────────────────────────────────── */

async function copy(text, msg) {
  try {
    await navigator.clipboard.writeText(text);
    toast(msg || 'Copied.');
  } catch {
    // iOS refuses clipboard writes outside a direct gesture in some contexts.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); toast(msg || 'Copied.'); }
    catch { toast('Could not copy — select the text manually.'); }
    ta.remove();
  }
}

/* ── boot ──────────────────────────────────────────────────────── */

const RENDER = {
  today: renderToday, plan: renderPlan, prep: renderPrep, recipes: renderRecipes,
  coach: renderCoach, me: renderMe, onboard: renderOnboard
};

function boot() {
  const s = getState();
  if (!s.onboarded) {
    $('#tabbar').hidden = true;
    header('Mediterranean Plan', 'Setup');
    show('onboard');
    return;
  }
  $('#tabbar').hidden = false;

  // A new week rolls over: rebuild the plan so the days line up with reality.
  const wk = buildWeek.length && s.plan ? s.plan.weekStart : null;
  const nowWeek = (() => {
    const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - d.getDay());
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  })();
  if (!s.plan || wk !== nowWeek) {
    update(st => {
      const t = targets(st.profile);
      st.plan = buildWeek(st.profile, t.kcal, Date.now() & 0xffff, t.protein);
      st.grocery = { checked: [], generatedFor: st.plan.weekStart };
    });
  }
  // Drop photo blobs the log no longer points at — a deleted meal should not
  // keep its picture on the phone forever.
  prunePhotos(referencedPhotoIds());

  show('today');
}

boot();
