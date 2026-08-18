/* Energy + macro targets, and the work-hours model that drives the plan.
   Mifflin-St Jeor BMR, activity multiplier, capped deficit, protein floored
   high on purpose: past ~55 the risk of a diet is losing muscle, not fat. */

export const ACTIVITY = {
  sedentary: { mult: 1.20, label: 'Sedentary — desk job, little walking' },
  light:     { mult: 1.375, label: 'Light — some walking, 1–2 workouts a week' },
  moderate:  { mult: 1.55, label: 'Moderate — on your feet, 3–4 workouts' },
  active:    { mult: 1.725, label: 'Active — physical job or 5+ workouts' }
};

const LB_PER_KG = 2.20462;
const KCAL_PER_LB = 3500;

export function bmr({ sex, age, heightIn, currentWeight }) {
  const kg = currentWeight / LB_PER_KG;
  const cm = heightIn * 2.54;
  const base = 10 * kg + 6.25 * cm - 5 * age;
  return Math.round(sex === 'female' ? base - 161 : base + 5);
}

export function tdee(p) {
  return Math.round(bmr(p) * (ACTIVITY[p.activity]?.mult ?? 1.375));
}

/**
 * Daily targets. Returns the numbers AND why they are what they are —
 * a target you don't understand is a target you abandon in week three.
 */
export function targets(p) {
  const maintenance = tdee(p);
  const wanted = (p.rate || 1) * KCAL_PER_LB / 7;        // requested daily deficit
  const capped = Math.min(wanted, maintenance * 0.25);   // never cut more than 25%
  const floor = p.sex === 'female' ? 1250 : 1500;

  let kcal = Math.round(maintenance - capped);
  let floored = false;
  if (kcal < floor) { kcal = floor; floored = true; }

  const actualDeficit = maintenance - kcal;
  const actualRate = (actualDeficit * 7) / KCAL_PER_LB;

  // Protein: 1.6 g per kg of GOAL weight — preserves lean mass in a deficit.
  const goalKg = p.goalWeight / LB_PER_KG;
  const protein = Math.round(Math.min(goalKg * 1.6, (kcal * 0.35) / 4));
  // Fat: 35% of calories. Mediterranean runs on olive oil; do not cut this.
  const fat = Math.round((kcal * 0.35) / 9);
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4));
  const fiber = p.sex === 'female' ? 28 : 34;

  const toLose = Math.max(0, p.currentWeight - p.goalWeight);
  const weeksToGoal = actualRate > 0 ? Math.ceil(toLose / actualRate) : null;

  return {
    maintenance, kcal, protein, carbs, fat, fiber,
    deficit: Math.round(actualDeficit),
    ratePerWeek: Math.round(actualRate * 100) / 100,
    floored, toLose, weeksToGoal,
    goalDate: weeksToGoal ? addWeeks(new Date(), weeksToGoal) : null
  };
}

function addWeeks(d, w) {
  const x = new Date(d);
  x.setDate(x.getDate() + w * 7);
  return x;
}

/* ── the work-hours model ──────────────────────────────────────── */

/**
 * Day archetypes. Hours worked is the single best predictor of whether a
 * dinner plan survives contact with reality, so it drives everything:
 * which recipes are even eligible, and how the day's calories are split.
 */
export const DAY_TYPES = {
  off: {
    key: 'off', label: 'Day off', max: 0,
    maxEffort: 'project', cookMinutes: 90,
    split: { breakfast: 0.25, lunch: 0.30, dinner: 0.35, snack: 0.10 },
    advice: 'Your batch-cook window. One hour here buys back three weeknights.'
  },
  light: {
    key: 'light', label: 'Light day', max: 7,
    maxEffort: 'project', cookMinutes: 60,
    split: { breakfast: 0.25, lunch: 0.30, dinner: 0.35, snack: 0.10 },
    advice: 'Enough slack to cook properly. Make extra — tomorrow will not be this kind.'
  },
  normal: {
    key: 'normal', label: 'Normal day', max: 9,
    maxEffort: 'standard', cookMinutes: 35,
    split: { breakfast: 0.25, lunch: 0.32, dinner: 0.33, snack: 0.10 },
    advice: 'A 30-minute dinner is realistic tonight. Anything longer is optimism.'
  },
  long: {
    key: 'long', label: 'Long day', max: 11,
    maxEffort: 'quick', cookMinutes: 20,
    split: { breakfast: 0.24, lunch: 0.36, dinner: 0.28, snack: 0.12 },
    advice: 'Bigger lunch, lighter dinner, and eat the planned snack around hour 9 — that is the one that stops the drive-home binge.'
  },
  brutal: {
    key: 'brutal', label: 'Brutal day', max: 99,
    maxEffort: 'zero', cookMinutes: 8,
    split: { breakfast: 0.22, lunch: 0.38, dinner: 0.26, snack: 0.14 },
    advice: 'No cooking tonight. Assembly only. The goal today is not a great dinner — it is not derailing.'
  }
};

export function dayType(hours) {
  const h = Number(hours) || 0;
  if (h <= 0) return DAY_TYPES.off;
  if (h <= 7) return DAY_TYPES.light;
  if (h <= 9) return DAY_TYPES.normal;
  if (h <= 11) return DAY_TYPES.long;
  return DAY_TYPES.brutal;
}

/** Calorie budget per meal slot for a given day. */
export function slotBudget(kcalTarget, hours) {
  const t = dayType(hours);
  const out = {};
  for (const [slot, frac] of Object.entries(t.split)) {
    out[slot] = Math.round((kcalTarget * frac) / 5) * 5;
  }
  return out;
}

/** Total hours in the profile's normal week — used for coaching context. */
export function weeklyHours(workHours) {
  return (workHours || []).reduce((a, b) => a + (Number(b) || 0), 0);
}

export function fmtDate(d) {
  return d ? d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : '—';
}
