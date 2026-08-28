/* Meal prep, for someone who has never done it.

   The week planner already batch-cooks. This is different, and the
   difference is the whole point: the planner decides for you and buries the
   result in a seven-day grid. This asks what you want to prep, shows you
   what your options actually are, and then tells you how — including the
   parts nobody writes down, like how long it survives in the fridge and
   what to put it in.

   The other job here is stopping you. The way people fail at meal prep is
   not doing too little on the first Sunday, it is doing far too much: four
   different dishes, three hours in the kitchen, eight portions for a
   four-lunch week, half of it thrown out on Friday, and never doing it
   again. So this counts what you have picked and argues with you. */

import { RECIPES } from './recipes.js';
import { tokenize, blocked } from './planner.js';
import { getState } from './store.js';

export const PREP_SLOTS = [
  {
    key: 'lunch', label: 'Lunch', icon: '🥗',
    blurb: 'The big win. Cook once on Sunday, eat it Monday through Thursday.',
    ask: 'How many lunches do you want covered?',
    counts: [3, 4, 5]
  },
  {
    key: 'snack', label: 'Night snacks', icon: '🌙',
    blurb: 'For when you want something at 9pm. Mostly portioning, barely any cooking.',
    ask: 'How many nights do you want something ready?',
    counts: [4, 5, 6]
  },
  {
    key: 'breakfast', label: 'Breakfast', icon: '☀️',
    blurb: 'Stops breakfast being a decision you make at six in the morning.',
    ask: 'How many mornings?',
    counts: [3, 4, 5]
  },
  {
    key: 'dinner', label: 'Dinner', icon: '🍽️',
    blurb: 'Only worth it for the nights you want off from cooking.',
    ask: 'How many dinners?',
    counts: [1, 2, 3]
  }
];

export const SLOT_BY_KEY = Object.fromEntries(PREP_SLOTS.map(s => [s.key, s]));

/** Prep-capable recipes for a slot, minus anything they will not eat. */
export function prepOptions(slot, profile = getState().profile, firstTime = false) {
  const banned = [...tokenize(profile.dislikes), ...tokenize(profile.allergies)];
  const out = RECIPES.filter(r =>
    r.prep && r.meal.includes(slot) && !blocked(r, banned)
  );

  // Easiest first, and on a first attempt put the ones written for a
  // beginner at the very top. Nobody's first meal prep should be the
  // forty-five minute one.
  return out.sort((a, b) => {
    if (firstTime && a.prep.firstTimer !== b.prep.firstTimer) return a.prep.firstTimer ? -1 : 1;
    if ((a.prep.kind === 'portion') !== (b.prep.kind === 'portion')) return a.prep.kind === 'portion' ? -1 : 1;
    return a.prep.activeMin - b.prep.activeMin;
  });
}

/** What a set of picks actually costs you, and produces. */
export function sessionLoad(picks) {
  const load = { cooks: 0, portionJobs: 0, activeMin: 0, portions: 0, items: picks.length };
  for (const r of picks) {
    if (r.prep.kind === 'cook') load.cooks++; else load.portionJobs++;
    load.activeMin += r.prep.activeMin;
    load.portions += r.prep.makes;
  }
  return load;
}

export function fmtMins(m) {
  if (m < 60) return `${m} minutes`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} hour${h > 1 ? 's' : ''} ${r}` : `${h} hour${h > 1 ? 's' : ''}`;
}

/**
 * The argument. Returns a level and something to say.
 *
 *   ok      — go and do it
 *   stretch — doable, but say what it costs
 *   toomuch — talk them down, and say exactly what to drop
 *
 * `wanted` is how many portions of this meal they asked to cover, which is
 * what catches the real beginner mistake: eight lunches made for a week
 * that has four in it.
 */
export function verdict(picks, wanted, slot, firstTime = false) {
  const load = sessionLoad(picks);

  if (!picks.length) {
    return { level: 'none', headline: 'Nothing picked yet.', body: 'Choose one to start. One is a perfectly good first prep.' };
  }

  if (firstTime && load.cooks > 1) {
    return {
      level: 'toomuch',
      headline: `That is ${load.cooks} separate things to cook.`,
      body: `For a first prep, do one. Pick the single one you like the look of most and drop the rest — you can add another next Sunday once you know how long it really takes you. Starting with ${load.cooks} cooks is how people do this once and never again.`
    };
  }

  if (load.cooks > 2) {
    return {
      level: 'toomuch',
      headline: `${load.cooks} separate cooks is too many for one session.`,
      body: `That is ${fmtMins(load.activeMin)} on your feet, and every one of them needs its own pan, its own timing and its own washing up. Two cooks is the ceiling that survives contact with a real Sunday. Drop one and add a portioning job instead — those take ten minutes and need no attention.`
    };
  }

  /* Overproduction is only a problem for food with a short life. Six bags of
     nuts beyond what you need is not waste, it is next week — but six extra
     tubs of cottage cheese is something you will bin on Friday. So only the
     perishable portions are counted against what they asked for. */
  const perishable = picks
    .filter(r => r.prep.keepsDays <= 5)
    .reduce((n, r) => n + r.prep.makes, 0);
  const waste = perishable - wanted;
  if (waste > wanted) {
    const freezable = picks.filter(r => r.prep.keepsDays <= 5 && r.prep.freezes);
    return {
      level: 'toomuch',
      headline: `That makes ${perishable} portions that need eating and you asked for ${wanted}.`,
      body: `Food does not keep because you meant well. About ${waste} portions would sit in the fridge until they went off, and throwing out your own cooking on Friday is what makes the whole thing feel like a wasted Sunday. Drop one and you land near ${wanted}.${freezable.length ? ` If you want to keep it, ${freezable[0].name} freezes — but only do that if you will genuinely defrost it.` : ''}`
    };
  }

  if (load.activeMin > 90) {
    return {
      level: 'toomuch',
      headline: `${fmtMins(load.activeMin)} is a long Sunday.`,
      body: `You said you would cook about ${getState().profile.cookNights} nights a week — this is more than that in one afternoon. Cut it back to about an hour and it stays something you will actually do again next week.`
    };
  }

  if (load.items > 3) {
    return {
      level: 'stretch',
      headline: `${load.items} different things is a lot of containers.`,
      body: `Only ${fmtMins(load.activeMin)}, so the time is fine — but that is ${load.items} lots of washing up and a fridge you cannot see into. Three is usually the point where it stops feeling worth it.`
    };
  }

  if (load.activeMin > 55 || load.cooks === 2) {
    return {
      level: 'stretch',
      headline: `About ${fmtMins(load.activeMin)}, ${load.cooks === 2 ? 'two cooks' : 'one cook'}.`,
      body: `That is a proper session but a manageable one. It gives you ${load.portions} portions — ${coverage(load.portions, wanted, slot, picks)}`
    };
  }

  return {
    level: 'ok',
    headline: `${fmtMins(load.activeMin)}, ${load.cooks ? `${load.cooks} cook` : 'no cooking at all'}${load.portionJobs ? ` and ${load.portionJobs} thing${load.portionJobs > 1 ? 's' : ''} to portion` : ''}.`,
    body: `${load.portions} portions — ${coverage(load.portions, wanted, slot, picks)}`
  };
}

function coverage(portions, wanted, slot, picks = []) {
  const noun = slot === 'snack' ? 'night' : slot === 'breakfast' ? 'morning' : 'day';
  if (portions < wanted) {
    return `${wanted - portions} short of the ${wanted} you wanted. Add one more, or accept you are buying lunch on Friday.`;
  }
  const base = `enough for the ${wanted} ${noun}${wanted > 1 ? 's' : ''} you asked for`;
  const spare = portions - wanted;
  if (!spare) return base + '.';

  // Spare food is only a worry if it will not survive the wait. Saying
  // "7 spare" about a bag of nuts reads as waste when it is just next week.
  const keeper = picks.filter(r => r.prep.keepsDays > 5).sort((a, b) => b.prep.keepsDays - a.prep.keepsDays)[0];
  const perishableSpare = picks
    .filter(r => r.prep.keepsDays <= 5)
    .reduce((n, r) => n + r.prep.makes, 0) - wanted;

  if (perishableSpare <= 0 && keeper) {
    return `${base}, with some over — but ${keeper.name} keeps for ${keeper.prep.keepsDays >= 14 ? 'weeks' : 'a week'}, so nothing goes to waste.`;
  }
  return `${base}, with ${spare} spare.`;
}

/* ── the session plan ──────────────────────────────────────────── */

/** Shopping, in aisle order, for exactly what was picked. */
export function prepShopping(picks) {
  const byAisle = {};
  for (const r of picks) {
    for (const ing of r.ingredients) {
      const a = ing.a || 'other';
      (byAisle[a] = byAisle[a] || []).push({ ...ing, from: r.name });
    }
  }
  return byAisle;
}

/**
 * The order to actually do things in. Anything that sits in an oven or a
 * pan goes first, so it cooks while you stand there chopping — which is the
 * single thing that separates a 40-minute session from a 90-minute one.
 */
export function prepRunOrder(picks) {
  const cooks = picks.filter(r => r.prep.kind === 'cook').sort((a, b) => b.minutes - a.minutes);
  const jobs = picks.filter(r => r.prep.kind === 'portion');
  const steps = [];

  if (cooks.length) {
    steps.push({
      title: 'Start the longest thing first',
      detail: `Get ${cooks[0].name} going before anything else. It needs ${cooks[0].minutes} minutes, and most of that is time you can spend on the rest of this list.`
    });
    for (const c of cooks.slice(1)) {
      steps.push({ title: `Then start ${c.name}`, detail: `${c.minutes} minutes.` });
    }
  }
  if (jobs.length) {
    steps.push({
      title: cooks.length ? 'While that cooks, portion the rest' : 'Portion everything',
      detail: jobs.map(j => j.name).join(', ') + '. No heat involved, so this is just chopping and filling containers.'
    });
  }
  steps.push({
    title: 'Divide it up while it is still warm',
    detail: 'Not later. Later means one big tub in the fridge, and one big tub means you serve yourself by eye and the portions stop meaning anything.'
  });
  steps.push({
    title: 'Put the snacks at eye level',
    detail: 'Front of the middle shelf, where you look first. Prepped food at the back of the fridge does not get eaten, it gets discovered.'
  });
  return steps;
}

/** Every container you need, totalled up. */
export function prepContainers(picks) {
  return picks.map(r => ({ name: r.name, need: r.prep.containers }));
}
