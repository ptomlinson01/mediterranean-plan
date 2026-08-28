/* Persistent state. Everything lives in localStorage on this device — nothing
   is sent anywhere except the messages you explicitly send to the AI coach. */

const KEY = 'medplan.v1';

const DEFAULT_STATE = {
  onboarded: false,
  profile: {
    name: '',
    age: 60,
    sex: 'male',              // male | female
    heightIn: 70,             // inches
    startWeight: 210,
    currentWeight: 210,
    goalWeight: 185,
    activity: 'light',        // sedentary | light | moderate | active
    rate: 1.0,                // target lb per week
    // Work-hours model — index 0 = Sunday
    workHours: [0, 9, 9, 9, 9, 9, 2],
    commuteMin: 30,
    cookSkill: 'ok',          // none | ok | confident
    cookNights: 3,            // how many nights a week you'll genuinely cook
    dislikes: '',
    allergies: '',
    conditions: '',
    kitchen: ['oven', 'stovetop'],
    notes: '',
    /* Who actually handles each meal. Planning seven dinners a week for
       someone whose partner cooks them is not a small annoyance — it is a
       quarter of the plan that is not theirs to do, and it is most of why
       the week reads as a wall. 'me' | 'other' | 'skip'. */
    whoCooks: { breakfast: 'me', lunch: 'me', dinner: 'me', snack: 'me' },

    /* Kitchen equipment, as three states rather than a yes/no list. Owning
       an oven and being willing to switch it on at nine at night after a
       twelve-hour day are different questions, and the second one is the
       one that decides whether a plan survives.
         'yes'    — have it, happy to use it
         'light'  — have it, but not on a working night
         'no'     — do not have it
         'ask'    — never answered; must not be asserted to the coach */
    equipment: {
      stovetop: 'ask', oven: 'ask', microwave: 'ask', airfryer: 'ask',
      grill: 'ask', slowcooker: 'ask', pressurecooker: 'ask', blender: 'ask'
    },

    /* Foods they actually like. Nudges the planner and, more usefully,
       tells the coach what to reach for when it improvises. */
    favorites: [],

    /* What they are actually trying to do. Changes emphasis and the
       movement advice — not the calorie arithmetic, which is the same
       whichever of these you pick. */
    focus: 'weight'
  },
  settings: {
    apiKey: '',
    model: 'claude-opus-5',
    units: 'imperial'
  },
  // date-keyed:
  //   'YYYY-MM-DD': {
  //     weight, hoursWorked, done: [slot], note,
  //     entries: [ ... ]   ← what was actually eaten, see addEntry below
  //   }
  log: {},
  plan: null,                 // { weekStart: 'YYYY-MM-DD', days: [...] }
  grocery: { checked: [], generatedFor: null },
  /* What is currently made and sitting in the fridge, so the app can answer
     "what can I eat right now" at 9pm without you opening a container. */
  prepStock: [],
  /* Eating windows. `current` is the fast in progress, if any. */
  fasting: {
    mode: null,              // 'weight' | 'visceral' | 'medical'
    protocol: '12:12',
    current: null,           // { startedAt, plannedHours }
    history: [],             // { startedAt, endedAt, plannedHours, completed }
    everDone: false
  },
  chat: [],
  version: 1
};

function deepMerge(base, patch) {
  if (Array.isArray(base) || typeof base !== 'object' || base === null) {
    return patch === undefined ? base : patch;
  }
  const out = { ...base };
  for (const k of Object.keys(patch || {})) {
    out[k] = k in base ? deepMerge(base[k], patch[k]) : patch[k];
  }
  return out;
}

/* Safari in private mode, and some embedded webviews, throw on any access to
   localStorage rather than simply returning null. Probe once and degrade to an
   in-memory store so the app still runs — it just won't remember. */
const storage = (() => {
  try {
    const t = '__medplan_probe__';
    localStorage.setItem(t, '1');
    localStorage.removeItem(t);
    return localStorage;
  } catch {
    const mem = new Map();
    return {
      getItem: k => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
      removeItem: k => mem.delete(k),
      persistent: false
    };
  }
})();

export const storageIsPersistent = storage.persistent !== false;

let state = load();

function load() {
  try {
    const raw = storage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_STATE);
    return deepMerge(structuredClone(DEFAULT_STATE), JSON.parse(raw));
  } catch (e) {
    console.warn('Saved data was unreadable; starting fresh.', e);
    return structuredClone(DEFAULT_STATE);
  }
}

export function getState() { return state; }

export function save() {
  try {
    storage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Could not save — storage may be full or blocked.', e);
  }
}

export function update(fn) {
  fn(state);
  save();
  return state;
}

export function resetAll() {
  state = structuredClone(DEFAULT_STATE);
  save();
}

/* ── dates ─────────────────────────────────────────────────────── */

export function todayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function parseKey(k) {
  const [y, m, d] = k.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

/** Sunday of the week containing `date`. */
export function weekStart(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return addDays(d, -d.getDay());
}

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const DAY_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/* ── day log ───────────────────────────────────────────────────── */

const EMPTY_DAY = { weight: null, hoursWorked: null, done: [], note: '', entries: [] };

export function getDay(key = todayKey()) {
  // Days saved before meal logging existed have no `entries`, so the default
  // fills it in rather than handing callers an undefined to trip over.
  return { ...EMPTY_DAY, ...(state.log[key] || {}) };
}

export function setDay(key, patch) {
  return update(s => {
    s.log[key] = { ...getDay(key), ...patch };
  });
}

/* ── what was actually eaten ───────────────────────────────────── */

/* An entry is one photographed or hand-entered meal:
     { id, at, slot, label, items: [{name, portion, kcal, protein, carbs, fat, fiber}],
       kcal, protein, carbs, fat, fiber,      ← the totals, after any edits
       photoId, confidence, note, source }
   The totals are stored alongside the items rather than derived on read,
   because the person can edit them and their edit is the truth. */

export function entriesFor(key = todayKey()) {
  return getDay(key).entries;
}

export function addEntry(key, entry) {
  return update(s => {
    const day = s.log[key] || (s.log[key] = { ...EMPTY_DAY, done: [], entries: [] });
    if (!Array.isArray(day.entries)) day.entries = [];
    day.entries.push(entry);
  });
}

export function updateEntry(key, id, patch) {
  return update(s => {
    const list = s.log[key]?.entries;
    if (!Array.isArray(list)) return;
    const i = list.findIndex(e => e.id === id);
    if (i >= 0) list[i] = { ...list[i], ...patch };
  });
}

export function removeEntry(key, id) {
  return update(s => {
    const list = s.log[key]?.entries;
    if (!Array.isArray(list)) return;
    s.log[key].entries = list.filter(e => e.id !== id);
  });
}

export function newEntryId() {
  return `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

const MACROS = ['kcal', 'protein', 'carbs', 'fat', 'fiber'];

export function sumEntries(list) {
  const out = { kcal: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, count: 0 };
  for (const e of list || []) {
    for (const m of MACROS) out[m] += Math.round(Number(e[m]) || 0);
    out.count++;
  }
  return out;
}

/** Everything logged on a day, whatever route it came in by. */
export function dayIntake(key = todayKey()) {
  return sumEntries(entriesFor(key));
}

/** Every photo id the log still points at — anything else can be deleted. */
export function referencedPhotoIds() {
  const ids = [];
  for (const day of Object.values(state.log)) {
    for (const e of day?.entries || []) if (e.photoId) ids.push(e.photoId);
  }
  return ids;
}

/** Hours worked for a date — the logged actual, else the scheduled default. */
export function hoursFor(key) {
  const logged = state.log[key]?.hoursWorked;
  if (logged !== null && logged !== undefined) return logged;
  return state.profile.workHours[parseKey(key).getDay()] ?? 8;
}

/** Weight entries sorted oldest → newest. */
export function weightSeries() {
  return Object.entries(state.log)
    .filter(([, v]) => typeof v.weight === 'number' && v.weight > 0)
    .map(([k, v]) => ({ date: k, weight: v.weight }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Smoothed weight — the number that actually tracks fat loss. */
export function trendWeight() {
  const s = weightSeries();
  if (!s.length) return state.profile.currentWeight;
  const window = s.slice(-7);
  return window.reduce((a, b) => a + b.weight, 0) / window.length;
}

/* ── export / import ───────────────────────────────────────────── */

export function exportJSON() {
  const copy = structuredClone(state);
  copy.settings.apiKey = '';   // never leaves in a backup file
  // Meal photos live in IndexedDB and are not included — the numbers,
  // which are what the log is for, all travel in here.
  return JSON.stringify(copy, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  const key = state.settings.apiKey;
  state = deepMerge(structuredClone(DEFAULT_STATE), parsed);
  state.settings.apiKey = key;
  save();
}
