/* Walking, mostly uphill.

   This exists because of one question — the best way to shift visceral fat,
   the fat around the organs rather than under the skin. The honest answer
   has two halves, and the app should say both:

   The first half is that diet does most of the work. Visceral fat is the
   fat the body reaches for first in a calorie deficit, which is why waists
   shrink before anything else does. No amount of treadmill undoes eating
   over your number.

   The second half is that aerobic exercise does something extra here that
   it does not do for fat generally — there is decent evidence it reduces
   visceral fat somewhat beyond what the weight loss alone accounts for. So
   it is a real second lever, just not the first one.

   Everything below is brisk incline walking rather than running, because
   for someone in their sixties carrying extra weight, incline gets the
   heart rate up without putting the load through the knees. The incline is
   the dial, not the speed. */

/* Tanaka: 208 − 0.7 × age. More accurate over fifty than the old 220 − age,
   which under-reads by about eight beats at sixty and would have people
   working harder than intended to hit a "correct" number. */
export function maxHeartRate(age) {
  return Math.round(208 - 0.7 * (Number(age) || 60));
}

export function zones(age) {
  const max = maxHeartRate(age);
  const at = pct => Math.round(max * pct);
  return {
    max,
    easy:     { lo: at(0.50), hi: at(0.63), label: 'Easy',     note: 'Comfortable. You could hold a full conversation.' },
    moderate: { lo: at(0.64), hi: at(0.76), label: 'Moderate', note: 'Breathing harder. You can talk in short sentences, not paragraphs.' },
    hard:     { lo: at(0.77), hi: at(0.93), label: 'Hard',     note: 'You can get a few words out. You would not choose to chat.' }
  };
}

/* Speed is held roughly steady and the incline does the work. Three or four
   miles an hour is a brisk walk for most people; the hills are what turn it
   into training. */
export const SESSIONS = [
  {
    minutes: 10,
    name: 'Ten minutes',
    when: 'For a day you were never going to do anything at all.',
    blocks: [
      { from: 0, to: 2,  speed: 3.0, incline: 0, effort: 'easy',     say: 'Warm up. Flat and easy.' },
      { from: 2, to: 4,  speed: 3.4, incline: 4, effort: 'moderate', say: 'Incline up. Settle into it.' },
      { from: 4, to: 5,  speed: 3.4, incline: 8, effort: 'hard',     say: 'Hill. One minute.' },
      { from: 5, to: 7,  speed: 3.4, incline: 4, effort: 'moderate', say: 'Back down. Recover without stopping.' },
      { from: 7, to: 8,  speed: 3.4, incline: 8, effort: 'hard',     say: 'Second hill. Last hard minute.' },
      { from: 8, to: 10, speed: 2.8, incline: 0, effort: 'easy',     say: 'Flat, slow. Let the heart rate come down.' }
    ],
    note: 'Ten minutes is not nothing. Three of these a week beats one thirty-minute session you keep postponing.'
  },
  {
    minutes: 20,
    name: 'Twenty minutes',
    when: 'The one to do most often. Long enough to matter, short enough to actually do after work.',
    blocks: [
      { from: 0,  to: 3,  speed: 3.0, incline: 0,  effort: 'easy',     say: 'Warm up. Do not skip this at sixty.' },
      { from: 3,  to: 8,  speed: 3.4, incline: 6,  effort: 'moderate', say: 'Steady climb. This is the bulk of the work.' },
      { from: 8,  to: 11, speed: 3.4, incline: 10, effort: 'hard',     say: 'Three minutes up the hill. Hold the rail if you need it.' },
      { from: 11, to: 16, speed: 3.4, incline: 6,  effort: 'moderate', say: 'Back to steady. Breathing settles.' },
      { from: 16, to: 20, speed: 2.8, incline: 0,  effort: 'easy',     say: 'Cool down properly. Four minutes, flat.' }
    ],
    note: 'If you only ever do one of these, do this one, three or four times a week.'
  },
  {
    minutes: 30,
    name: 'Thirty minutes',
    when: 'A day off, or a light day. The best single session for visceral fat.',
    blocks: [
      { from: 0,  to: 4,  speed: 3.0, incline: 0, effort: 'easy',     say: 'Warm up.' },
      { from: 4,  to: 12, speed: 3.5, incline: 5, effort: 'moderate', say: 'Eight minutes steady. Find a rhythm you could hold all day.' },
      { from: 12, to: 15, speed: 3.5, incline: 9, effort: 'hard',     say: 'Hill. Three minutes.' },
      { from: 15, to: 23, speed: 3.5, incline: 5, effort: 'moderate', say: 'Steady again.' },
      { from: 23, to: 26, speed: 3.5, incline: 9, effort: 'hard',     say: 'Second hill. Last hard block.' },
      { from: 26, to: 30, speed: 2.8, incline: 0, effort: 'easy',     say: 'Cool down. Four minutes, flat, slow.' }
    ],
    note: 'The mix matters more than the length — steady work with a couple of harder blocks in it beats the same thirty minutes at one unchanging pace.'
  }
];

/** Roughly what a session burns. Deliberately conservative. */
export function sessionBurn(session, weightLb) {
  // METs: brisk walking 3.5mph flat ≈ 4.3; each 1% incline adds roughly 0.35.
  const kg = (Number(weightLb) || 190) / 2.20462;
  let kcal = 0;
  for (const b of session.blocks) {
    const mins = b.to - b.from;
    const mets = 3.6 + (b.speed - 2.8) * 1.2 + b.incline * 0.35;
    kcal += mets * 3.5 * kg / 200 * mins;
  }
  return Math.round(kcal / 5) * 5;
}

/** How many sessions a week, given what they are trying to do. */
export function weeklyTarget(focus) {
  if (focus === 'visceral') {
    return {
      sessions: 4,
      line: 'Four sessions a week. Visceral fat responds to the total amount of aerobic work more than to how hard any one session is, so frequency beats intensity here.'
    };
  }
  if (focus === 'strength') {
    return {
      sessions: 2,
      line: 'Two walking sessions a week, kept easy. If holding on to muscle is the goal, the walking is there to support recovery, not to compete with it.'
    };
  }
  return {
    sessions: 3,
    line: 'Three sessions a week. Enough to matter, few enough that a bad week does not write the whole thing off.'
  };
}

/* What actually shifts visceral fat, in order of how much it matters. */
export const VISCERAL_TRUTH = [
  {
    head: 'The calorie deficit does most of it',
    body: 'Visceral fat is the fat your body reaches for first when you are eating under your number. It is why the waistband goes before anything else. Nothing on a treadmill outruns eating over your target, so the daily number stays the main event.'
  },
  {
    head: 'Aerobic work adds something on top',
    body: 'This is the one place exercise earns extra credit — regular aerobic exercise appears to cut visceral fat somewhat beyond what the weight loss alone explains. Walking uphill counts. It does not need to be running.'
  },
  {
    head: 'Alcohol and sugary drinks matter more than most foods',
    body: 'Both are associated with fat carried around the middle specifically. If you drink most evenings, that is a bigger lever than anything you could change about dinner.'
  },
  {
    head: 'Sleep and protein protect the result',
    body: 'Short sleep makes the deficit harder to hold and pushes appetite up. Protein keeps the weight you lose from being muscle. Neither burns visceral fat directly; both stop you undoing the work.'
  },
  {
    head: 'There are no exercises for the middle',
    body: 'Sit-ups build the muscle underneath and change nothing about the fat on top. Nobody can lose fat from one chosen place. Anything sold on that promise is selling you something.'
  }
];

export const FOCUS_OPTIONS = [
  {
    key: 'weight', label: 'Overall weight', icon: '⚖️',
    blurb: 'The straightforward one. Get the number on the scale down and keep the muscle.'
  },
  {
    key: 'visceral', label: 'Belly and visceral fat', icon: '📏',
    blurb: 'The fat around the organs — the one that matters most for health. Same calorie target, more emphasis on walking, fibre and what you drink.'
  },
  {
    key: 'strength', label: 'Keeping my strength', icon: '💪',
    blurb: 'Losing fat while protecting muscle, with a gentler deficit and protein pushed higher.'
  }
];
