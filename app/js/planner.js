/* Week planner.

   The core idea: a week of meals is a supply chain, not a list. Batch cooks
   land on your lightest day and their leftovers are deliberately routed to
   your heaviest days. That is the whole trick — the plan survives a 13-hour
   Tuesday because Sunday already fed it. */

import { RECIPES, BY_ID, EFFORT_RANK, AISLES } from './recipes.js';
import { dayType, slotBudget } from './nutrition.js';
import { DAY_NAMES, addDays, weekStart } from './store.js';

const SLOTS = ['breakfast', 'lunch', 'dinner', 'snack'];

/* Small seeded PRNG so "Regenerate" gives a genuinely different week
   while any single generation stays reproducible. */
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

/* An allergy is stated as a category ("shellfish") but recipes list foods
   ("shrimp"). Without this map, "shellfish" silently matches nothing and the
   planner cheerfully serves prawns to someone who is allergic to them. */
const ALLERGEN_SYNONYMS = {
  shellfish: ['shrimp', 'prawn', 'mussel', 'clam', 'crab', 'lobster', 'scallop', 'oyster'],
  seafood:   ['shrimp', 'prawn', 'mussel', 'clam', 'crab', 'lobster', 'scallop', 'fish', 'salmon', 'cod', 'tuna', 'sardine', 'trout', 'haddock', 'anchov'],
  fish:      ['salmon', 'cod', 'tuna', 'sardine', 'trout', 'haddock', 'anchov'],
  nuts:      ['almond', 'walnut', 'pistachio', 'cashew', 'hazelnut', 'pecan', 'pine nut'],
  nut:       ['almond', 'walnut', 'pistachio', 'cashew', 'hazelnut', 'pecan', 'pine nut'],
  'tree nuts': ['almond', 'walnut', 'pistachio', 'cashew', 'hazelnut', 'pecan'],
  peanut:    ['peanut'],
  dairy:     ['yogurt', 'cheese', 'feta', 'ricotta', 'mozzarella', 'halloumi', 'labneh', 'milk', 'cottage'],
  lactose:   ['yogurt', 'cheese', 'feta', 'ricotta', 'mozzarella', 'halloumi', 'labneh', 'milk', 'cottage'],
  gluten:    ['bread', 'pasta', 'orzo', 'farro', 'pita', 'wrap', 'lavash', 'breadcrumb', 'flour', 'spaghetti'],
  wheat:     ['bread', 'pasta', 'orzo', 'farro', 'pita', 'wrap', 'lavash', 'breadcrumb', 'flour', 'spaghetti'],
  egg:       ['egg'],
  eggs:      ['egg'],
  pork:      ['pork', 'bacon', 'ham', 'prosciutto'],
  soy:       ['soy', 'tofu', 'edamame'],
  sesame:    ['tahini', 'sesame', 'za’atar', "za'atar", 'hummus']
};

function tokenize(text) {
  const raw = (text || '')
    .toLowerCase()
    .split(/[,;\n]+/)
    .map(t => t.trim().replace(/^(no |none|nothing|not )/, ''))
    .filter(t => t.length > 2);

  const out = new Set();
  for (const t of raw) {
    out.add(t);
    // Singularise so "olives" also catches "olive", "sardines" catches "sardine".
    if (t.endsWith('s') && t.length > 4) out.add(t.slice(0, -1));
    for (const [cat, foods] of Object.entries(ALLERGEN_SYNONYMS)) {
      if (t.includes(cat)) foods.forEach(f => out.add(f));
    }
  }
  return [...out];
}

const rxEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Does this recipe collide with anything the user won't or can't eat?
    Whole-word matching, so "egg" doesn't wrongly knock out eggplant. */
function blocked(recipe, banned) {
  if (!banned.length) return false;
  const hay = [
    recipe.name,
    ...recipe.ingredients.map(i => i.n),
    ...(recipe.tags || [])
  ].join(' ').toLowerCase()
    // Olive oil is the base fat of the entire cuisine. Someone saying they
    // dislike olives never means the oil — matching it would empty the bank.
    .replace(/extra-virgin olive oil|olive oil/g, 'evoo');

  return banned.some(b => new RegExp(`\\b${rxEsc(b)}s?\\b`).test(hay));
}

/**
 * @param profile        state.profile
 * @param kcal           daily calorie target
 * @param seed           changes the week
 * @param proteinTarget  daily protein goal, used for the protein rescue pass
 * @returns { weekStart, days: [{date, dow, hours, type, slots:{slot:{recipeId, leftover, kcal}}, totals}] }
 */
export function buildWeek(profile, kcal, seed = 1, proteinTarget = 0) {
  const rand = rng(seed);
  const banned = [...tokenize(profile.dislikes), ...tokenize(profile.allergies)];
  const pool = RECIPES.filter(r => !blocked(r, banned));

  const start = weekStart(new Date());
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = addDays(start, i);
    const dow = date.getDay();
    const hours = Number(profile.workHours[dow]) || 0;
    days.push({
      date: keyOf(date), dow, dayName: DAY_NAMES[dow], hours,
      type: dayType(hours), budget: slotBudget(kcal, hours),
      slots: {}, batchDay: false
    });
  }

  // 1. Pick the batch-cook day: fewest work hours, earliest wins ties.
  const batchIdx = days
    .map((d, i) => ({ i, h: d.hours }))
    .sort((a, b) => a.h - b.h || a.i - b.i)[0].i;
  days[batchIdx].batchDay = true;

  // 2. Budget for real cooking nights. Beyond this count, dinners get downgraded.
  let cookNightsLeft = Math.max(0, Number(profile.cookNights) ?? 3);

  // 3. Leftover pool, filled by batch cooks, drained by later days.
  //    { recipeId, meals: ['lunch','dinner'], portions, fromDay }
  const leftovers = [];

  const used = [];  // recipeIds in assignment order, for variety scoring

  // 3a. Seed the batch day with a dinner batch and a lunch batch.
  const batchDay = days[batchIdx];
  const dinnerBatch = pickBatch(pool, 'dinner', batchDay, banned, rand, used);
  if (dinnerBatch) {
    assign(batchDay, 'dinner', dinnerBatch, false);
    leftovers.push({ recipeId: dinnerBatch.id, meals: dinnerBatch.meal, portions: dinnerBatch.servings - 1, from: batchIdx });
  }
  const lunchBatch = pickBatch(pool, 'lunch', batchDay, banned, rand, used);
  if (lunchBatch) {
    assign(batchDay, 'lunch', lunchBatch, false);
    leftovers.push({ recipeId: lunchBatch.id, meals: lunchBatch.meal, portions: lunchBatch.servings - 1, from: batchIdx });
  }

  // 4. Fill every remaining slot, hardest days first so they get first claim
  //    on the leftovers — the whole point of cooking ahead.
  const order = days
    .map((d, i) => ({ i, h: d.hours }))
    .sort((a, b) => b.h - a.h || a.i - b.i)
    .map(x => x.i);

  for (const slot of SLOTS) {
    for (const di of order) {
      const day = days[di];
      if (day.slots[slot]) continue;

      const budget = day.budget[slot];
      const maxRank = EFFORT_RANK[day.type.maxEffort];

      // Leftovers first on hard days — that is what they exist for.
      if (slot !== 'breakfast' && day.type.key !== 'off' && day.type.key !== 'light') {
        const lo = leftovers.find(l => l.portions >= 0.75 && l.from < di && l.meals.includes(slot));
        if (lo) {
          const rec = BY_ID[lo.recipeId];
          // Take as much of the batch as this day's budget actually calls for,
          // and draw that much down from the pool so the maths stays honest.
          const want = Math.min(2, fitPortions(rec.kcal, budget, slot, rec));
          const take = Math.min(want, lo.portions);
          lo.portions -= take;
          assign(day, slot, rec, true, take);
          continue;
        }
      }

      // Dinner on a spent cook-night budget drops to assembly-only.
      let effectiveRank = maxRank;
      if (slot === 'dinner') {
        if (cookNightsLeft <= 0) effectiveRank = Math.min(effectiveRank, EFFORT_RANK.quick);
      }
      if (slot === 'breakfast') effectiveRank = Math.min(effectiveRank, EFFORT_RANK.standard);
      if (slot === 'snack') effectiveRank = EFFORT_RANK.zero;

      const got = choose(pool, slot, budget, effectiveRank, used, rand, day);
      if (got) {
        const pick = got.recipe;
        const n = pick.batch ? 1 : fitPortions(pick.kcal, budget, slot, pick);
        assign(day, slot, pick, false, n, got.compromised);
        if (slot === 'dinner' && EFFORT_RANK[pick.effort] >= EFFORT_RANK.standard) cookNightsLeft -= 1;
        if (pick.batch && pick.servings > 1) {
          leftovers.push({ recipeId: pick.id, meals: pick.meal, portions: pick.servings - 1, from: di });
        }
      }
    }
  }

  days.forEach(d => { balanceDay(d); boostProtein(d, proteinTarget, pool); });

  return { weekStart: keyOf(start), generated: new Date().toISOString(), seed, days };

  function assign(day, slot, recipe, isLeftover, portions = 1, compromised = false) {
    day.slots[slot] = { recipeId: recipe.id, leftover: isLeftover, portions, compromised };
    used.push(recipe.id);
  }
}

/* ── portions ──────────────────────────────────────────────────────
   The recipe bank is written in single standard servings. A 210 lb man
   eating 1,900 kcal needs bigger plates than a 140 lb woman eating 1,300,
   and inventing separate recipes for each would be absurd. So the planner
   scales servings to the slot's calorie budget instead. */

const P_MIN = 0.75, P_MAX = 3;

/* Per-slot portion limits. Snacks and breakfast stay modest on purpose:
   trebling a snack to soak up spare calories gives you six squares of
   chocolate, and nobody eats two and a quarter jars of overnight oats.
   Lunch and dinner are the slots that can honestly carry a big appetite. */
const SLOT_RANGE = {
  breakfast: [0.75, 2],
  lunch:     [P_MIN, P_MAX],
  dinner:    [P_MIN, P_MAX],
  snack:     [0.5, 2]
};

function portionRange(slot, recipe) {
  let [lo, hi] = SLOT_RANGE[slot] || [P_MIN, P_MAX];
  if (recipe && recipe.maxPortion) hi = Math.min(hi, recipe.maxPortion);
  return [lo, hi];
}

function fitPortions(kcal, budget, slot, recipe) {
  if (!kcal) return 1;
  const [lo, hi] = portionRange(slot, recipe);
  return Math.min(hi, Math.max(lo, Math.round((budget / kcal) * 4) / 4));
}

/** Nudge a finished day onto its calorie target without silly portions. */
function balanceDay(day) {
  const target = Object.values(day.budget).reduce((a, b) => a + b, 0);
  const order = ['dinner', 'lunch', 'breakfast', 'snack'];   // a bigger plate beats a bigger snack
  let cursor = 0;

  for (let pass = 0; pass < 40; pass++) {
    const total = dayTotals(day).kcal;
    const gap = target - total;
    if (Math.abs(gap) <= target * 0.05) break;

    // Round-robin rather than greedy: stepping through the slots in turn
    // spreads the adjustment across the day instead of inflating one meal
    // to its ceiling before touching the next.
    let moved = false;
    for (let k = 0; k < order.length; k++) {
      const slot = order[(cursor + k) % order.length];
      const sl = day.slots[slot];
      if (!sl) continue;
      const r = BY_ID[sl.recipeId];
      if (!r) continue;
      let [lo, hi] = portionRange(slot, r);
      // A leftover portion is drawn from a finite batch, and a batch recipe
      // eaten fresh has the rest of the pot already promised to later days.
      // Neither may grow here, or the week eats the same food twice.
      if (sl.leftover || r.batch) hi = sl.portions || 1;
      const next = (sl.portions || 1) + (gap > 0 ? 0.25 : -0.25);
      if (next < lo || next > hi) continue;
      sl.portions = next;
      moved = true;
      cursor = (cursor + k + 1) % order.length;
      break;
    }
    if (!moved) break;                            // everything is already maxed
  }
  day.totals = dayTotals(day);
  return day;
}

function keyOf(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** A batch cook only gets scheduled if the day can genuinely absorb it.
    Someone working long hours seven days a week gets no batch day — and the
    plan correctly falls back to assembly meals rather than lying to them. */
function pickBatch(pool, slot, day, banned, rand, used) {
  const cands = pool.filter(r =>
    r.batch && r.meal.includes(slot) && !used.includes(r.id) &&
    EFFORT_RANK[r.effort] <= EFFORT_RANK[day.type.maxEffort] &&
    r.minutes <= day.type.cookMinutes
  );
  if (!cands.length) return null;
  return cands[Math.floor(rand() * cands.length)];
}

/**
 * Score by calorie fit, then protein, with a hard penalty for recent repeats.
 *
 * Relaxes in stages if the pool is thin — someone avoiding nuts, olives and
 * shellfish can otherwise exhaust the no-cook options for a slot entirely, and
 * an empty dinner slot is a far worse outcome than a dinner that takes twenty
 * minutes instead of eight. Allergies and dislikes are never relaxed.
 */
function choose(pool, slot, budget, maxRank, used, rand, day) {
  const recent = used.slice(-8);

  const stages = [
    r => r.meal.includes(slot) && EFFORT_RANK[r.effort] <= maxRank && r.minutes <= day.type.cookMinutes,
    r => r.meal.includes(slot) && EFFORT_RANK[r.effort] <= maxRank + 1 && r.minutes <= day.type.cookMinutes * 2,
    r => r.meal.includes(slot),
    r => slot === 'snack' ? r.kcal <= 320 : r.meal.some(m => m !== 'snack')
  ];

  let cands = [], stage = 0;
  for (; stage < stages.length; stage++) {
    cands = pool.filter(stages[stage]);
    if (cands.length) break;
  }
  if (!cands.length) { cands = pool.slice(); stage = stages.length; }
  if (!cands.length) return null;               // only if everything is banned

  const scored = cands.map(r => {
    // Portions can stretch a small recipe, so calorie fit matters less than it
    // looks. Protein density can't be faked by serving more — that just adds
    // calories too — so it carries real weight here.
    const fit = Math.abs(r.kcal - budget) / Math.max(budget, 1) * 0.5;
    const repeat = recent.includes(r.id) ? 1.2 : 0;
    const everUsed = used.includes(r.id) ? 0.35 : 0;
    const density = r.protein / (r.kcal / 100);            // g protein per 100 kcal
    const proteinBonus = -Math.min(density, 12) * 0.075;
    const jitter = rand() * 0.18;
    return { r, score: fit + repeat + everUsed + proteinBonus + jitter };
  }).sort((a, b) => a.score - b.score);

  // stage > 0 means a rule had to be stretched to fill this slot at all.
  return { recipe: scored[0].r, compromised: stage > 0 };
}

/**
 * Protein rescue. Under-eating protein in a deficit past fifty means losing
 * muscle instead of fat, which is the exact failure this plan exists to avoid.
 * If a day lands short, upgrade its least protein-dense slots.
 */
function boostProtein(day, proteinTarget, pool) {
  if (!proteinTarget) return;

  for (let pass = 0; pass < 3; pass++) {
    if (day.totals.protein >= proteinTarget * 0.9) return;

    // Weakest slot first, leftovers excluded — they're already cooked.
    const candidates = SLOTS
      .filter(s => day.slots[s] && !day.slots[s].leftover && BY_ID[day.slots[s].recipeId])
      .map(s => ({ slot: s, r: BY_ID[day.slots[s].recipeId] }))
      .sort((a, b) => (a.r.protein / (a.r.kcal / 100)) - (b.r.protein / (b.r.kcal / 100)));

    let improved = false;
    for (const { slot, r: current } of candidates) {
      const alts = pool.filter(r =>
        r.meal.includes(slot) &&
        EFFORT_RANK[r.effort] <= EFFORT_RANK[day.type.maxEffort] &&
        r.minutes <= day.type.cookMinutes &&
        r.protein / (r.kcal / 100) > current.protein / (current.kcal / 100) + 1
      ).sort((a, b) => (b.protein / (b.kcal / 100)) - (a.protein / (a.kcal / 100)));

      if (!alts.length) continue;
      const pick = alts[0];
      day.slots[slot] = {
        recipeId: pick.id, leftover: false,
        portions: fitPortions(pick.kcal, day.budget[slot], slot, pick)
      };
      balanceDay(day);
      improved = true;
      break;
    }
    if (!improved) return;
  }
}

export function dayTotals(day) {
  const t = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, minutes: 0 };
  for (const slot of SLOTS) {
    const s = day.slots[slot];
    if (!s) continue;
    const r = BY_ID[s.recipeId];
    if (!r) continue;
    const n = s.portions || 1;
    t.kcal += r.kcal * n; t.protein += r.protein * n; t.carbs += r.carbs * n;
    t.fat += r.fat * n; t.fiber += r.fiber * n;
    t.minutes += s.leftover ? 3 : r.minutes;    // a bigger plate is not a longer cook
  }
  for (const k of Object.keys(t)) t[k] = Math.round(t[k]);
  return t;
}

/** Swap one slot for the next-best alternative the day can actually support. */
export function swapSlot(plan, dayIndex, slot, profile) {
  const day = plan.days[dayIndex];
  const banned = [...tokenize(profile.dislikes), ...tokenize(profile.allergies)];
  const pool = RECIPES.filter(r => !blocked(r, banned));
  const current = day.slots[slot]?.recipeId;
  const used = plan.days.flatMap(d => Object.values(d.slots).map(s => s.recipeId));

  const maxRank = slot === 'snack' ? EFFORT_RANK.zero : EFFORT_RANK[day.type.maxEffort];
  const cands = pool.filter(r =>
    r.meal.includes(slot) && r.id !== current &&
    EFFORT_RANK[r.effort] <= maxRank && r.minutes <= day.type.cookMinutes
  );
  if (!cands.length) return plan;

  const budget = day.budget[slot];
  const scored = cands.map(r => ({
    r, score: Math.abs(r.kcal - budget) / budget + (used.includes(r.id) ? 0.5 : 0) + Math.random() * 0.3
  })).sort((a, b) => a.score - b.score);

  day.slots[slot] = {
    recipeId: scored[0].r.id, leftover: false,
    portions: fitPortions(scored[0].r.kcal, budget, slot, scored[0].r)
  };
  balanceDay(day);
  return plan;
}

/**
 * Reality check. The day you planned for 9 hours turned into 13. Re-tune that
 * day's remaining meals to what is now actually possible, leaving anything
 * already eaten alone.
 */
export function retuneDay(plan, dayIndex, hours, profile, doneSlots = []) {
  const day = plan.days[dayIndex];
  day.hours = hours;
  day.type = dayType(hours);
  const kcalTotal = Object.values(day.budget).reduce((a, b) => a + b, 0);
  day.budget = slotBudget(kcalTotal, hours);

  const banned = [...tokenize(profile.dislikes), ...tokenize(profile.allergies)];
  const pool = RECIPES.filter(r => !blocked(r, banned));
  const used = plan.days.flatMap(d => Object.values(d.slots).map(s => s.recipeId));
  const maxRank = EFFORT_RANK[day.type.maxEffort];
  const changed = [];

  for (const slot of SLOTS) {
    if (doneSlots.includes(slot)) continue;
    const cur = day.slots[slot];
    if (!cur) continue;
    const r = BY_ID[cur.recipeId];
    if (!r) continue;
    // Leftovers cost no effort — they always survive a re-tune.
    if (cur.leftover) continue;
    if (EFFORT_RANK[r.effort] <= maxRank && r.minutes <= day.type.cookMinutes) continue;

    const rank = slot === 'snack' ? EFFORT_RANK.zero : maxRank;
    const got = choose(pool, slot, day.budget[slot], rank, used, Math.random, day);
    if (got) {
      const pick = got.recipe;
      day.slots[slot] = {
        recipeId: pick.id, leftover: false,
        portions: fitPortions(pick.kcal, day.budget[slot], slot, pick),
        compromised: got.compromised
      };
      changed.push(`${slot}: ${pick.name}`);
    }
  }

  balanceDay(day);
  return changed;
}

/* ── grocery list ──────────────────────────────────────────────── */

/* Shopping-list normalisation. "Tomato, sliced" and "Tomatoes, halved" are one
   line on a shopping list, and "2 cup" plus "2 cups" is four cups. Without
   this you get the same item three times and buy it twice. */

const UNIT_PLURAL = {
  cup: 'cups', slice: 'slices', clove: 'cloves', stalk: 'stalks', square: 'squares',
  tin: 'tins', can: 'cans', fillet: 'fillets', bulb: 'bulbs', leaf: 'leaves',
  halve: 'halves', leave: 'leaves', pinch: 'pinches', head: 'heads', bunch: 'bunches',
  whole: 'whole', medium: 'medium', large: 'large', small: 'small'
};

function baseName(n) {
  return n.split(/,| \(/)[0].trim();
}

function nameKey(n) {
  const b = baseName(n).toLowerCase();
  if (b.endsWith('oes')) return b.slice(0, -2);   // tomatoes -> tomato
  if (b.endsWith('s')) return b.slice(0, -1);     // olives   -> olive
  return b;
}

function unitKey(u) {
  const t = (u || '').trim().toLowerCase();
  const singular = t.endsWith('s') ? t.slice(0, -1) : t;
  return singular in UNIT_PLURAL ? singular : t;
}

function unitLabel(u, q) {
  const k = unitKey(u);
  if (!(k in UNIT_PLURAL)) return u;
  return q > 1 ? UNIT_PLURAL[k] : k;
}

/** Aggregate ingredients for every meal that is actually COOKED this week
    (leftovers are already paid for by the batch cook that produced them). */
export function groceryList(plan) {
  const counted = new Set();
  const lines = new Map();     // key -> {n, q, u, a}

  for (const day of plan.days) {
    for (const slot of SLOTS) {
      const s = day.slots[slot];
      if (!s || s.leftover) continue;
      const r = BY_ID[s.recipeId];
      if (!r) continue;
      // A batch recipe is shopped for once, however many days it feeds.
      const uniqueKey = r.batch ? r.id : `${r.id}@${day.date}@${slot}`;
      if (counted.has(uniqueKey)) continue;
      counted.add(uniqueKey);

      // A single-serving recipe eaten at 1.5 portions needs 1.5x the shopping.
      // Batch recipes already make 4–6 servings, so their quantities stand.
      const mult = r.batch ? 1 : (s.portions || 1);

      for (const ing of r.ingredients) {
        const key = `${nameKey(ing.n)}||${unitKey(ing.u)}`;
        const q = ing.q === null || ing.q === undefined ? null : ing.q * mult;
        const prev = lines.get(key);
        if (prev) {
          prev.q = prev.q === null || q === null ? null : prev.q + q;
        } else {
          lines.set(key, { ...ing, n: baseName(ing.n), q });
        }
      }
    }
  }

  const byAisle = {};
  for (const aisle of AISLES) byAisle[aisle] = [];
  for (const item of lines.values()) {
    (byAisle[item.a] || byAisle.other).push(item);
  }
  for (const aisle of AISLES) {
    byAisle[aisle].sort((a, b) => a.n.localeCompare(b.n));
    if (!byAisle[aisle].length) delete byAisle[aisle];
  }
  return byAisle;
}

export function fmtQty(item) {
  if (item.q === null || item.q === undefined) return item.u;
  // Portion scaling produces things like 0.9375 cups. Nobody measures that.
  const q = item.q >= 0.5
    ? Math.round(item.q * 4) / 4
    : Math.round(item.q * 100) / 100;
  const frac = { 0.25: '¼', 0.33: '⅓', 0.5: '½', 0.66: '⅔', 0.75: '¾' };
  const whole = Math.floor(q);
  const rem = Math.round((q - whole) * 100) / 100;
  let num = String(q);
  if (frac[rem]) num = (whole ? whole : '') + frac[rem];
  return `${num} ${unitLabel(item.u, q)}`;
}

export { SLOTS };
