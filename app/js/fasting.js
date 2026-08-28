/* Eating windows.

   What fasting actually is, stated plainly because the category is full of
   apps that will not say it: putting your meals inside a window does not
   burn fat that the same calories eaten across the whole day would not
   burn. Head-to-head trials against ordinary calorie restriction find much
   the same weight loss. The claims about specific things switching on at
   hour sixteen are extrapolated from cell and animal work and do not
   survive contact with a human eating a late breakfast.

   So why have it here at all? Because "I don't eat after eight" is a rule
   you can follow while tired, and 1,901 calories is a number you have to
   think about. For someone whose failure point is a 9pm raid on the
   kitchen, a closing time is a better tool than arithmetic. That is the
   honest case for it, and it is a good one.

   The honest case against, for this particular user: he is sixty, and this
   whole app exists on the premise that at his age the risk is losing muscle
   rather than fat. Protein is the defence, and 134g inside an eight-hour
   window is harder than 134g across a day. That trade-off gets said out
   loud rather than buried.

   And there is real screening here, not a disclaimer. Fasting interacts
   badly and specifically with some medication — insulin and the older
   diabetes tablets can drop blood sugar dangerously when meals are skipped.
   That is a stop, not a caution. */

import { targets } from './nutrition.js';

export const PROTOCOLS = [
  {
    key: '12:12', fast: 12, eat: 12, name: '12:12',
    label: 'Twelve and twelve',
    blurb: 'Finish dinner, eat breakfast twelve hours later. Most people nearly do this already.',
    who: 'The place to start if you have never done it.'
  },
  {
    key: '14:10', fast: 14, eat: 10, name: '14:10',
    label: 'Fourteen and ten',
    blurb: 'A slightly later breakfast, or a slightly earlier dinner. Barely feels like a rule.',
    who: 'A sensible second step once twelve hours is easy.'
  },
  {
    key: '16:8', fast: 16, eat: 8, name: '16:8',
    label: 'Sixteen and eight',
    blurb: 'The common one. Two solid meals and a snack inside eight hours.',
    who: 'The best balance of "does something" and "you will keep doing it".'
  },
  {
    key: '18:6', fast: 18, eat: 6, name: '18:6',
    label: 'Eighteen and six',
    blurb: 'A tighter window. Two meals, and you have to plan the protein.',
    who: 'Only once 16:8 is genuinely comfortable.'
  },
  {
    key: '20:4', fast: 20, eat: 4, name: '20:4',
    label: 'Twenty and four',
    blurb: 'Everything in four hours. Hard to eat enough protein, easy to under-eat badly.',
    who: 'Not recommended at your age. Listed because you will read about it.'
  }
];

export const BY_PROTOCOL = Object.fromEntries(PROTOCOLS.map(p => [p.key, p]));

export const MODES = [
  {
    key: 'weight', label: 'Losing weight', icon: '⚖️',
    blurb: 'Using a closing time as an easier rule than counting.'
  },
  {
    key: 'visceral', label: 'Belly and visceral fat', icon: '📏',
    blurb: 'Same idea, and worth knowing the evidence here is thinner than the marketing.'
  },
  {
    key: 'medical', label: 'A doctor told me to', icon: '🩺',
    blurb: 'Bloodwork, a scan, a procedure, or something they prescribed. The app just holds the clock.'
  }
];

/* ── screening ─────────────────────────────────────────────────── */

/* Matched against whatever they wrote in the conditions field. Deliberately
   generous with drug names, because people write "I take metformin", not
   "type 2 diabetes mellitus". */
const RED = [
  {
    re: /\binsulin\b|sulfonylurea|glipizide|glyburide|glibenclamide|gliclazide|glimepiride/i,
    level: 'stop',
    say: 'You have mentioned insulin or a sulfonylurea. Skipping meals on these can drop your blood sugar dangerously low, and it can happen fast. Do not start a fasting schedule without talking to whoever prescribes it — your doses would very likely need changing first.'
  },
  {
    re: /diabet|metformin|jardiance|empagliflozin|ozempic|semaglutide|mounjaro|tirzepatide/i,
    level: 'stop',
    say: 'You have mentioned diabetes or a diabetes medication. Fasting changes blood sugar and several of these drugs change it too — together they need supervising. Talk to your doctor or pharmacist before you start, not after.'
  },
  {
    re: /eating disorder|anorexi|bulimi|binge eating/i,
    level: 'stop',
    say: 'You have mentioned a history of disordered eating. Structured fasting is not recommended in that case — the rules and the restriction tend to make things worse rather than better. This one is worth talking through with someone who knows your history.'
  },
  {
    re: /pregnan|breastfeed|nursing/i,
    level: 'stop',
    say: 'Fasting is not appropriate while pregnant or breastfeeding.'
  },
  {
    re: /blood pressure|hypertension|lisinopril|amlodipine|losartan|ramipril|bisoprolol|atenolol|beta.?block|diuretic|bendroflumethiazide/i,
    level: 'care',
    say: 'You have mentioned blood-pressure medication. Losing weight and fasting both tend to lower blood pressure, which sounds good until the dose you are on becomes too strong for you. Watch for dizziness when you stand up, and ask your doctor whether the dose should be reviewed as you lose weight.'
  },
  {
    re: /kidney|renal|gout|liver|epilep|seizure/i,
    level: 'care',
    say: 'You have mentioned a condition that can be affected by long gaps without food or fluid. Worth a quick word with your doctor before you start.'
  }
];

/**
 * Should this person be doing this at all?
 * Returns a verdict plus the reasoning, because a bare yes/no about your own
 * body is not worth much.
 */
export function screen(profile, { nightSnacking = false, hittingProtein = true, onTrack = null } = {}) {
  const conditions = profile.conditions || '';
  const flags = RED.filter(r => r.re.test(conditions));
  const stops = flags.filter(f => f.level === 'stop');
  const cares = flags.filter(f => f.level === 'care');

  const t = targets(profile);
  const bmi = (profile.currentWeight / 2.20462) / Math.pow(profile.heightIn * 0.0254, 2);
  const reasons = [];

  if (stops.length) {
    return {
      verdict: 'stop',
      headline: 'Not without talking to your doctor first',
      // Most specific only — insulin already implies the diabetes warning,
      // and two overlapping paragraphs read as boilerplate rather than
      // something written about you.
      stops: [stops[0].say],
      cares: cares.map(f => f.say),
      reasons: [],
      canProceed: false
    };
  }

  if (bmi < 20) {
    return {
      verdict: 'stop',
      headline: 'You are not carrying enough weight for this',
      stops: [`Your BMI is about ${bmi.toFixed(1)}. Fasting on top of a deficit at that weight risks taking muscle rather than fat.`],
      cares: [], reasons: [], canProceed: false
    };
  }

  // The genuinely useful part: is this the right tool for THIS problem?
  if (nightSnacking) {
    reasons.push({
      good: true,
      say: `You have told us the evening is where it goes wrong. A closing time is a direct answer to that — "the kitchen shuts at eight" is a rule you can follow while tired, which ${t.kcal.toLocaleString()} calories is not.`
    });
  }
  if (!hittingProtein) {
    reasons.push({
      good: false,
      say: `You are already falling short on protein. Squeezing the same ${t.protein}g into a shorter window makes that harder, and at sixty protein is the thing standing between losing fat and losing muscle. Fix the protein first, then consider this.`
    });
  }
  if (onTrack === true) {
    reasons.push({
      good: false,
      say: 'You are already losing at about the rate you planned. Adding another rule to a plan that is working is how a plan stops being followed. There is nothing here you need.'
    });
  }
  if (onTrack === false) {
    reasons.push({
      good: true,
      say: 'The weight is not moving the way it should. A closing time removes a chunk of the day where calories tend to arrive unrecorded, which is the usual culprit.'
    });
  }
  reasons.push({
    good: null,
    say: 'Either way, it is the calories that do the work. Fasting is a way of eating fewer of them without counting, not a separate mechanism. Anyone who tells you otherwise is selling something.'
  });

  /* Protein is not one consideration among several here — it is the premise
     the whole plan rests on. A shortfall gates rather than gets outvoted,
     because "you are already short on protein, and this makes that harder"
     is not something a tally of pros should be able to overrule. */
  if (!hittingProtein) {
    return {
      verdict: 'fixfirst',
      headline: 'Fix the protein first',
      stops: [],
      cares: cares.map(f => f.say),
      reasons,
      canProceed: true
    };
  }

  const against = reasons.filter(r => r.good === false).length;
  const forIt = reasons.filter(r => r.good === true).length;

  return {
    verdict: cares.length ? 'care' : (against > forIt ? 'unnecessary' : 'reasonable'),
    headline: cares.length
      ? 'Probably fine, with one thing to check'
      : against > forIt
        ? 'You do not need this'
        : 'Reasonable — and it fits your particular problem',
    stops: [],
    cares: cares.map(f => f.say),
    reasons,
    canProceed: true
  };
}

/** Which protocol to suggest, and why that one. */
export function recommend(profile, mode = 'weight') {
  if (mode === 'medical') {
    return {
      protocol: null,
      say: 'Follow exactly what you were told, including anything about water, and ignore any suggestion this app would otherwise make. Use the timer below to hold the clock, nothing more.'
    };
  }
  const experienced = !!profile.fastingEverDone;
  const key = experienced ? '16:8' : '12:12';
  return {
    protocol: BY_PROTOCOL[key],
    say: experienced
      ? 'Sixteen and eight is the one worth settling on. Long enough to change when you eat, short enough that two meals and a snack still fit — which is what keeps your protein where it needs to be.'
      : 'Start at twelve and twelve. It is close to what you already do, so the first week costs you nothing, and you find out whether the idea suits you before it asks anything of you.'
  };
}

/**
 * Where to actually put the window, given the hours they work.
 * A window that ends at 6pm is useless to someone who gets home at 7 — and
 * this is the one thing a general fasting app cannot do, because it does not
 * know when you are at work.
 */
export function suggestWindow(profile, protocolKey, workHours) {
  const p = BY_PROTOCOL[protocolKey];
  if (!p) return null;

  const hours = Number(workHours) || 0;

  /* Anchor to when dinner can realistically FINISH, then work backwards.
     Doing it the other way round — start early, add the window — produced
     an 18:6 that closed at 6pm on a twelve-hour day, which is advice for
     somebody who is not at work. */
  const end = hours >= 11 ? 20 : hours >= 8 ? 19 : 18;
  let start = end - p.eat;
  if (start < 6) start = 6;                      // nobody is eating at 5am

  return { start, end, closes: fmtHour(end), opens: fmtHour(start) };
}

export function fmtHour(h) {
  const hh = ((Math.floor(h) % 24) + 24) % 24;
  const mins = Math.round((h - Math.floor(h)) * 60);
  const suffix = hh < 12 ? 'am' : 'pm';
  const disp = hh % 12 === 0 ? 12 : hh % 12;
  return mins ? `${disp}:${String(mins).padStart(2, '0')}${suffix}` : `${disp}${suffix}`;
}

/* ── what is actually happening in there ───────────────────────── */

/* Honest version. No autophagy countdown, because the hour-by-hour claims
   are extrapolated from cells in dishes and mice that were fasted for a
   proportionally far longer time. What is written here is what someone
   actually notices. */
export function phase(hoursIn) {
  if (hoursIn < 4) {
    return { name: 'Still digesting', say: 'Your last meal is still being absorbed. Nothing special is happening yet, and that is fine.' };
  }
  if (hoursIn < 12) {
    return { name: 'Running on breakfast', say: 'Blood sugar has settled back to baseline. Your body is using stored carbohydrate. Most people feel entirely normal here.' };
  }
  if (hoursIn < 16) {
    return { name: 'Switching over', say: 'Stored carbohydrate is getting low and more of your energy is coming from fat. This is where hunger tends to arrive in waves — it passes, and a glass of water and twenty minutes usually settles it.' };
  }
  if (hoursIn < 20) {
    return { name: 'Mostly burning fat', say: 'The switch is largely done. Some people feel clear-headed here, some feel flat. Both are normal, and which one you are is worth knowing before you plan a long fast around a work day.' };
  }
  return { name: 'A long way in', say: 'Past twenty hours there is little extra to gain for weight loss and more risk of under-eating protein. Unless a doctor asked for this, it is time to eat.' };
}

/** Water, salt, and the two things people get wrong. */
export const DURING = [
  'Water, black coffee and plain tea are all fine and none of them break anything meaningful.',
  'Anything with calories ends the fast. That includes milk in tea, and it includes the splash you did not count.',
  'If you feel light-headed, shaky, or unwell, eat something. A fast you push through while feeling ill is not discipline, it is just a bad evening waiting to happen.',
  'Break it with protein and vegetables rather than something sweet. What you eat first sets how the rest of the window goes.'
];
