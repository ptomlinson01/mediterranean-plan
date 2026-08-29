/* What counts as eaten.

   Two things add up against a day: planned meals you ticked off, and meals
   you photographed. Ticking says "I ate the plan"; a photo says "here is
   what I actually ate". Both are real.

   This lives in its own module because two very different callers need the
   same answer — the Today screen and the AI coach — and if they ever
   disagreed, the app would be telling you one number on screen and quietly
   briefing the coach with another. */

import { getState, getDay, entriesFor, todayKey, weekStart, addDays, DAY_NAMES } from './store.js';
import { BY_ID } from './recipes.js';
import { targets } from './nutrition.js';

export const MACRO_KEYS = ['kcal', 'protein', 'carbs', 'fat', 'fiber'];

/** The safety floor below which no advice may ever recommend eating. */
export function safetyFloor(p = getState().profile) {
  return p.sex === 'female' ? 1250 : 1500;
}

function planDayFor(key) {
  const plan = getState().plan;
  if (!plan) return null;
  return plan.days.find(d => d.date === key) || null;
}

/**
 * Everything counted against one day.
 * @param exceptEntryId skip one logged entry — used while editing it, so the
 *                      "puts you at" figure doesn't count the meal twice.
 */
export function countedForDay(key = todayKey(), exceptEntryId = null) {
  const out = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  const pd = planDayFor(key);
  const done = getDay(key).done || [];

  if (pd) for (const slot of done) {
    const sl = pd.slots[slot];
    const r = BY_ID[sl?.recipeId];
    if (!r) continue;
    const n = sl.portions || 1;
    for (const m of MACRO_KEYS) out[m] += Math.round((r[m] || 0) * n);
  }
  for (const e of entriesFor(key)) {
    if (e.id === exceptEntryId) continue;
    for (const m of MACRO_KEYS) out[m] += Math.round(Number(e[m]) || 0);
  }
  return out;
}

/**
 * Where the week stands. The daily target never moves — this is the total
 * behind it, which is the figure that actually decides whether weight comes
 * off, because a body cannot tell it is Tuesday.
 */
export function weekPosition(now = new Date()) {
  const t = targets(getState().profile);
  const start = weekStart(now);
  const todayIdx = now.getDay();
  const budget = t.kcal * 7;

  /* A day with nothing in it means "I did not log", not "I did not eat".
     Treating the two as the same told a fresh install it was eleven thousand
     calories under and could eat thirteen thousand today — arithmetically
     consistent and completely wrong. Unlogged past days are assumed to have
     landed on target, which is the neutral assumption, and the count of them
     is reported so the advice can admit what it does not know. */
  const days = [];
  let usedBefore = 0;
  let daysLogged = 0;
  let daysBlank = 0;
  for (let i = 0; i < 7; i++) {
    const key = todayKey(addDays(start, i));
    const seen = i <= todayIdx;
    const kcal = seen ? countedForDay(key).kcal : null;
    if (i < todayIdx) {
      if (kcal > 0) { usedBefore += kcal; daysLogged++; } else { daysBlank++; }
    }
    days.push({ key, name: DAY_NAMES[i], isToday: i === todayIdx, future: !seen, kcal });
  }

  const daysLeft = 7 - todayIdx;                  // today included
  const assumed = t.kcal * daysBlank;             // blank days treated as on-target
  const remaining = budget - usedBefore - assumed;

  return {
    t,
    budget,
    days,
    todayIdx,
    daysLeft,
    usedBefore,
    /** Past days with something recorded, and past days with nothing. */
    daysLogged,
    daysBlank,
    usedTotal: usedBefore + (days[todayIdx].kcal || 0),
    remaining,
    /** What each remaining day could be, to land the week on target. */
    perDay: Math.round(remaining / daysLeft),
    /** Over/under across the days actually recorded. Null when there are none. */
    drift: daysLogged ? usedBefore - t.kcal * daysLogged : null
  };
}
