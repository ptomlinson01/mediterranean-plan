/* Photograph a meal, get numbers back.

   This is the same API, the same key and the same endpoint as the coach —
   one more POST to /v1/messages, with a picture attached and a JSON schema
   on the way out. Two rules shape the whole file:

   1. The model is asked what it can SEE, and told to say plainly what it
      cannot. A confidently wrong number is worse than an honest one with a
      caveat, because the value of this feature is a running total the person
      believes. The moment they stop believing it, they stop logging.

   2. Nothing is written down until they have looked at it. What comes back
      here is a first draft. The review screen is where it becomes a log
      entry, and every number on it is editable. */

import { getState, todayKey, hoursFor, dayIntake } from './store.js';
import { targets, dayType } from './nutrition.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

/* 1024px on the long edge is the sweet spot: plenty for the model to read a
   plate, roughly 120 KB as JPEG, and quick to upload on a phone signal. */
const MAX_EDGE = 1024;
const QUALITY = 0.82;

/* Haiku 4.5 rejects the effort setting, so it only goes to models that take it. */
const EFFORT_MODELS = /^claude-(opus|sonnet|fable)-/;

export class VisionError extends Error {
  constructor(message, kind) { super(message); this.kind = kind; }
}

/* ── getting the picture ready ─────────────────────────────────── */

/* Decoding through an <img> rather than createImageBitmap is deliberate: an
   <img> applies the EXIF orientation tag itself, so a photo taken with the
   phone held sideways arrives upright. Skipping this is why so many of these
   features ship with the food on its side. */
function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new VisionError('That picture could not be opened.', 'decode')); };
    img.src = url;
  });
}

/**
 * Downscale and re-encode, so a 12-megapixel phone photo becomes something
 * worth uploading.
 * @returns {{blob: Blob, base64: string, mediaType: string}}
 */
export async function prepareImage(file) {
  if (!file) throw new VisionError('No picture was chosen.', 'nofile');
  if (!/^image\//.test(file.type || '')) throw new VisionError('That file is not a picture.', 'type');

  const img = await loadImage(file);
  const w = img.naturalWidth || img.width;
  const h = img.naturalHeight || img.height;
  if (!w || !h) throw new VisionError('That picture could not be read.', 'decode');

  const scale = Math.min(1, MAX_EDGE / Math.max(w, h));
  const cw = Math.max(1, Math.round(w * scale));
  const ch = Math.max(1, Math.round(h * scale));

  const canvas = document.createElement('canvas');
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new VisionError('This browser cannot process pictures.', 'canvas');
  ctx.drawImage(img, 0, 0, cw, ch);

  const blob = await new Promise(res => canvas.toBlob(res, 'image/jpeg', QUALITY));
  if (!blob) throw new VisionError('This browser could not compress the picture.', 'encode');

  return { blob, base64: await toBase64(blob), mediaType: 'image/jpeg' };
}

function toBase64(blob) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => {
      const s = String(fr.result);
      const comma = s.indexOf(',');
      resolve(comma >= 0 ? s.slice(comma + 1) : s);
    };
    fr.onerror = () => reject(new VisionError('That picture could not be read.', 'decode'));
    fr.readAsDataURL(blob);
  });
}

/* ── what we ask for back ──────────────────────────────────────── */

const ITEM = {
  type: 'object',
  properties: {
    name:    { type: 'string', description: 'Plain English, as sold in an ordinary supermarket.' },
    portion: { type: 'string', description: 'How much you think is there, in everyday units.' },
    kcal:    { type: 'number' },
    protein: { type: 'number' },
    carbs:   { type: 'number' },
    fat:     { type: 'number' },
    fiber:   { type: 'number' }
  },
  required: ['name', 'portion', 'kcal', 'protein', 'carbs', 'fat', 'fiber'],
  additionalProperties: false
};

const MEAL_SCHEMA = {
  type: 'object',
  properties: {
    label:      { type: 'string', description: 'A short plain name for the whole plate.' },
    items:      { type: 'array', items: ITEM },
    confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
    uncertain:  { type: 'string', description: 'What you genuinely cannot tell from the picture. Empty string if nothing.' },
    ruleFlag:   { type: 'string', description: 'Anything on the plate that breaks their stated rules. Empty string if nothing.' },
    coachNote:  { type: 'string', description: 'One short sentence about where this leaves them today.' }
  },
  required: ['label', 'items', 'confidence', 'uncertain', 'ruleFlag', 'coachNote'],
  additionalProperties: false
};

function visionSystem() {
  const s = getState();
  const p = s.profile;
  const t = targets(p);
  const key = todayKey();
  const type = dayType(hoursFor(key));
  const soFar = dayIntake(key);
  const leftKcal = t.kcal - soFar.kcal;
  const leftProtein = t.protein - soFar.protein;

  return `You estimate what someone has eaten — from a photograph of the plate, or from their own description of it — for someone tracking a Mediterranean pattern of eating.

## Your job
Name what you can see, estimate the portion, and give calories and macros for each item. Return only the structured object you have been given a schema for.

## Estimating honestly — this matters more than looking clever
- Estimate what is ACTUALLY IN THE PICTURE, not a textbook version of the dish. If that looks like half a chicken breast, it is half a chicken breast.
- Use everyday portions: "one chicken thigh", "about a cup", "two slices", "a handful", "a palm-sized piece".
- Round calories to the nearest 5 and grams to the nearest whole number. These are estimates, and the rounding should say so.
- Judge cooking fat from what you can see. Food that is glistening was cooked in oil — count it. Food that looks dry was not.
- Anything hidden — dressing already tossed through, butter already melted in, sugar in a sauce — goes in "uncertain". Do not quietly guess it into the numbers, and do not quietly leave it out.
- Set confidence honestly. "high" is a clear picture of separable food. "low" is a mixed dish, poor light, an awkward angle, or a container you cannot see into. Claiming high when you are unsure is the worst thing you can do here: it teaches them to trust a number that is wrong, and the day they notice is the day they stop logging.
- If there is no food in the picture, or the description is not of food, return an empty items array, label it "No food I can identify", and say so in "uncertain".
- Working from a description rather than a picture, you cannot see portion size — so say what you assumed in "uncertain", and set confidence to "medium" at best unless they gave you amounts.

## Naming
PLAIN ENGLISH ONLY. Never a foreign or specialist culinary word. Say "baked eggs in tomato sauce", not the restaurant name for it. Name ingredients the way a supermarket labels them. This person told us outright that unfamiliar food words made the whole thing feel overwhelming, and feeling overwhelmed is what makes people quit.

## Their rules — check the plate against these
- Will not eat: ${p.dislikes || 'nothing stated'}.
- Allergies: ${p.allergies || 'none stated'}.
- Household notes: ${p.notes || '—'}.
If something on this plate breaks one of those, put a short plain sentence in "ruleFlag" — for example "There look like raw tomatoes in this." Otherwise make "ruleFlag" an empty string. Never scold. They are telling you what they ate, not asking your permission.

## Where they are today
- Target ${t.kcal} kcal and ${t.protein} g protein for the day.
- Already logged today: ${soFar.kcal} kcal and ${soFar.protein} g protein.
- That leaves roughly ${leftKcal} kcal and ${leftProtein} g protein.
- Today is a ${type.label.toLowerCase()} — ${type.maxEffort} cooking effort at most.

"coachNote" is ONE short sentence: where this meal leaves them for the rest of today, or what to aim at next. Direct and warm, like someone who has done this for twenty years. No hype, no exclamation marks, no moralising about food. If they are over, that is information, not a failure.`;
}

/* ── the call ──────────────────────────────────────────────────── */

/**
 * @param {{base64:string, mediaType:string, note?:string}} image
 * @param {AbortSignal} [signal]
 * @returns the parsed meal estimate
 */
export async function estimateMeal({ base64, mediaType, note = '' }, signal) {
  const ask = note.trim()
    ? `Here is what I am eating. What I can tell you: ${note.trim()}`
    : 'Here is what I am eating. Estimate it.';
  return callEstimator([
    { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64 } },
    { type: 'text', text: ask }
  ], signal);
}

/**
 * The same estimate, from a description instead of a picture.
 *
 * Typing is often the better route and not merely the fallback: a photograph
 * cannot tell you the milk went in the coffee, that half of it came back to
 * the kitchen, or what you ate in the car two hours ago. Words can.
 */
export async function estimateFromText(description, signal) {
  const text = String(description || '').trim();
  if (!text) throw new VisionError('Type what you ate first.', 'empty');
  return callEstimator([{
    type: 'text',
    text: `Here is what I ate, in my own words. Estimate it as if you had seen it.

"${text}"

Work from exactly what I said. Where I gave you an amount, use it. Where I did not, assume an ordinary helping for a grown adult and put what you assumed in "uncertain" — do not pad the numbers to be safe, and do not trim them to be kind.`
  }], signal);
}

async function callEstimator(content, signal) {
  const s = getState();
  const key = (s.settings.apiKey || '').trim();
  if (!key) throw new VisionError('No API key saved. Add one in Me → AI coach.', 'nokey');

  const model = s.settings.model || 'claude-opus-5';
  const output_config = { format: { type: 'json_schema', schema: MEAL_SCHEMA } };
  if (EFFORT_MODELS.test(model)) output_config.effort = 'low';

  let res;
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      signal,
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': API_VERSION,
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify({
        model,
        max_tokens: 2000,
        system: visionSystem(),
        output_config,
        messages: [{ role: 'user', content }]
      })
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new VisionError('Could not reach the API. Check your connection.', 'network');
  }

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message || ''; } catch { /* body not JSON */ }
    if (res.status === 401) throw new VisionError('That API key was rejected. Check it in Me → AI coach.', 'auth');
    if (res.status === 429) throw new VisionError('Rate limited. Wait a moment and try the picture again.', 'rate');
    if (res.status === 413) throw new VisionError('That was too big to send.', 'size');
    if (res.status === 400 && /credit|balance/i.test(detail)) {
      throw new VisionError('Your Anthropic account is out of credit.', 'credit');
    }
    throw new VisionError(detail || `API error ${res.status}.`, 'api');
  }

  const data = await res.json();
  const out = (data.content || []).find(b => b.type === 'text')?.text;
  if (!out) throw new VisionError('Nothing came back. Try again.', 'empty');

  let parsed;
  try { parsed = JSON.parse(out); }
  catch { throw new VisionError('The estimate came back unreadable. Try again.', 'parse'); }

  return normalise(parsed);
}

/* The schema fixes the shape, but the values still get clamped here — one
   negative or absurd number would quietly poison the day's total. */
function normalise(raw) {
  const n = (v, max) => {
    const x = Math.round(Number(v));
    if (!Number.isFinite(x) || x < 0) return 0;
    return Math.min(x, max);
  };
  const items = (Array.isArray(raw.items) ? raw.items : []).slice(0, 12).map(it => ({
    name: String(it.name || 'Something').slice(0, 80),
    portion: String(it.portion || '').slice(0, 60),
    kcal: n(it.kcal, 4000),
    protein: n(it.protein, 300),
    carbs: n(it.carbs, 500),
    fat: n(it.fat, 300),
    fiber: n(it.fiber, 100)
  }));
  return {
    label: String(raw.label || 'Logged meal').slice(0, 80),
    items,
    confidence: ['high', 'medium', 'low'].includes(raw.confidence) ? raw.confidence : 'low',
    uncertain: String(raw.uncertain || '').slice(0, 400),
    ruleFlag: String(raw.ruleFlag || '').slice(0, 300),
    coachNote: String(raw.coachNote || '').slice(0, 300)
  };
}

/* ── small helpers the UI wants ────────────────────────────────── */

/** Which meal this probably is, judged from the clock. Always overridable. */
export function guessSlot(d = new Date()) {
  const h = d.getHours() + d.getMinutes() / 60;
  if (h < 10.5) return 'breakfast';
  if (h < 15) return 'lunch';
  if (h < 21) return 'dinner';
  return 'snack';
}

export const CONFIDENCE_LABEL = {
  high: 'Clear picture',
  medium: 'Fair guess',
  low: 'Rough guess'
};
