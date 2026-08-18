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
    notes: ''
  },
  settings: {
    apiKey: '',
    model: 'claude-opus-5',
    units: 'imperial'
  },
  // date-keyed: { 'YYYY-MM-DD': { weight, hoursWorked, eaten: {slot: recipeId|null}, done: [slot], note } }
  log: {},
  plan: null,                 // { weekStart: 'YYYY-MM-DD', days: [...] }
  grocery: { checked: [], generatedFor: null },
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

export function getDay(key = todayKey()) {
  return state.log[key] || { weight: null, hoursWorked: null, done: [], note: '' };
}

export function setDay(key, patch) {
  return update(s => {
    s.log[key] = { ...getDay(key), ...patch };
  });
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
  return JSON.stringify(copy, null, 2);
}

export function importJSON(text) {
  const parsed = JSON.parse(text);
  const key = state.settings.apiKey;
  state = deepMerge(structuredClone(DEFAULT_STATE), parsed);
  state.settings.apiKey = key;
  save();
}
