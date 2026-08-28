/* The assistant layer.

   Method (after Daniel Miessler's personal-AI approach): the model is not
   asked to be clever from a cold start. Every request carries an explicit,
   human-readable CONTEXT FILE describing who you are, what you're trying to
   do, and what today actually looks like. You can read that file, edit it,
   and copy it out. The AI is the reasoning engine; the context file is the
   thing that makes its answers yours rather than generic. */

import { getState, todayKey, getDay, hoursFor, trendWeight, weightSeries, entriesFor, dayIntake, DAY_FULL } from './store.js';
import { targets, dayType, ACTIVITY, weeklyHours, fmtDate } from './nutrition.js';
import { BY_ID, recipeIndex } from './recipes.js';
import { SLOTS } from './planner.js';
import { weekPosition, safetyFloor } from './intake.js';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

/* Which models accept an `effort` setting. Haiku 4.5 does not. */
const EFFORT_MODELS = /^claude-(opus|sonnet|fable)-/;

/* ── the context file ──────────────────────────────────────────── */

/** The whole point. A plain-markdown description of the user that is
    injected into every single call and shown to them verbatim in the app. */
export function buildContextFile() {
  const s = getState();
  const p = s.profile;
  const t = targets(p);
  const key = todayKey();
  const today = getDay(key);
  const hrs = hoursFor(key);
  const type = dayType(hrs);
  const trend = trendWeight();
  const series = weightSeries();
  const dow = new Date().getDay();

  const wk = weekPosition();
  const floor = safetyFloor(p);
  const lost = Math.round((p.startWeight - trend) * 10) / 10;
  const recent = series.slice(-5).map(x => `${x.date}: ${x.weight} lb`).join(', ') || 'no weigh-ins logged yet';

  const sched = p.workHours
    .map((h, i) => `${DAY_FULL[i]} ${h}h`)
    .join(' · ');

  /* What they actually ate, from the photo log. This is the block that turns
     the coach from a planner into something that knows how the day has gone —
     it is the difference between "have chicken tonight" and "you are 900
     calories in with 60 g of protein still to find". */
  const logged = entriesFor(key);
  const intake = dayIntake(key);
  let intakeBlock;
  if (!logged.length) {
    intakeBlock = 'Nothing logged yet today. Do not assume they have eaten nothing — assume you do not know, and ask if it matters to the answer.';
  } else {
    const rows = logged.map(e => {
      const when = new Date(e.at).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
      const what = (e.items || []).map(i => `${i.name}${i.portion ? ` (${i.portion})` : ''}`).join(', ');
      const rough = e.confidence === 'low' ? ' — rough estimate' : '';
      return `- ${when} ${e.slot}: ${e.label}${what ? ` — ${what}` : ''} — about ${e.kcal} kcal, ${e.protein} g protein${rough}`;
    }).join('\n');
    intakeBlock = `${rows}

Running total: ${intake.kcal} kcal of ${t.kcal}, ${intake.protein} g protein of ${t.protein}, ${intake.fat} g fat, ${intake.carbs} g carbs, ${intake.fiber} g fiber.
Left for the rest of today: ${t.kcal - intake.kcal} kcal and ${t.protein - intake.protein} g protein.
These came from photographs of the actual plates, so they are good estimates, not measurements. Talk about them in round numbers.`;
  }

  let planBlock = 'No week plan generated yet.';
  if (s.plan) {
    planBlock = s.plan.days.map(d => {
      const meals = SLOTS
        .map(sl => {
          const slot = d.slots[sl];
          if (!slot) return null;
          const r = BY_ID[slot.recipeId];
          const n = slot.portions || 1;
          return `${sl}: ${r ? r.name : slot.recipeId}${n !== 1 ? ` (×${n} servings)` : ''}${slot.leftover ? ' [leftovers]' : ''}`;
        })
        .filter(Boolean).join('; ');
      return `- ${d.dayName} (${d.hours}h work, ${d.type.label}): ${meals}`;
    }).join('\n');
  }

  return `# CONTEXT FILE — ${p.name || 'the user'}

## Who
- Age ${p.age}, ${p.sex}. Height ${Math.floor(p.heightIn / 12)}'${p.heightIn % 12}".
- Started at ${p.startWeight} lb. Currently ${p.currentWeight} lb (7-day trend ${trend.toFixed(1)} lb). Goal ${p.goalWeight} lb.
- Down ${lost} lb since starting.
- Activity level: ${ACTIVITY[p.activity]?.label || p.activity}.

## The objective
- Lose ${t.toLose} lb on a Mediterranean pattern of eating, at ${t.ratePerWeek} lb/week.
- Estimated goal date at the current rate: ${fmtDate(t.goalDate)}${t.weeksToGoal ? ` (${t.weeksToGoal} weeks)` : ''}.
- Because of their age, preserving muscle matters as much as losing fat. Protein target is deliberately high and the deficit deliberately moderate.

## The number
- Keep under ${t.kcal} kcal a day. That is maintenance (~${t.maintenance}) minus a ${t.deficit} deficit, which is ${t.ratePerWeek} lb a week.
- Across the week that is ${t.kcal * 7} kcal, and THE WEEKLY TOTAL IS WHAT DECIDES THE OUTCOME. A long work day spent over is genuinely cancelled by a day off spent under. Frame it that way whenever they have gone over.
- Never advise eating below ${floor} kcal in a day, for any reason, including catching up after a heavy week. If the arithmetic to get back on track would need that, say so plainly and tell them to let the week land short instead.
- Protein ${t.protein} g · Carbs ${t.carbs} g · Fat ${t.fat} g · Fiber ${t.fiber} g.

## Where the week stands
- ${wk.usedTotal} kcal used of ${wk.budget} budgeted, with ${wk.daysLeft} day(s) left including today.
- ${wk.drift === 0 ? 'Exactly on pace.' : wk.drift > 0 ? `Running ${wk.drift} kcal OVER pace.` : `Running ${-wk.drift} kcal UNDER pace — that is banked.`}
- To land the week on target, the remaining days average ${wk.perDay} kcal each.${wk.perDay < floor ? ` That is below the ${floor} floor, so do NOT recommend it — tell them to hold at ${t.kcal} and accept the week finishing short.` : ''}
${t.floored ? '- NOTE: the deficit was capped for safety; the target sits at the floor.\n' : ''}
## Work life — this drives everything
- Typical week: ${sched} (${weeklyHours(p.workHours)} h/week total).
- Commute: ~${p.commuteMin} min each way.
- Willing to genuinely cook about ${p.cookNights} nights a week. Cooking confidence: ${p.cookSkill}.
- Kitchen: ${(p.kitchen || []).join(', ') || 'basic'}.

## Today — ${DAY_FULL[dow]} ${key}
- Working ${hrs} hours. Day type: ${type.label.toUpperCase()}.
- Rule for this kind of day: ${type.advice}
- Max realistic cooking effort tonight: ${type.maxEffort} (about ${type.cookMinutes} minutes).
- Weight logged today: ${today.weight ? today.weight + ' lb' : 'not yet'}.
- Planned meals ticked off so far: ${(today.done || []).join(', ') || 'none'}.

## What they have actually eaten today
${intakeBlock}

## Constraints — treat these as hard rules, not preferences
- Dislikes / won't eat: ${p.dislikes || 'none stated'}.
- Allergies: ${p.allergies || 'none stated'}.
- Kitchen equipment available: ${(p.kitchen || []).join(', ') || 'basic'}. Never suggest a method needing equipment not on this list.
- Health conditions / medications mentioned: ${p.conditions || 'none stated'}.
- Household notes and food rules: ${p.notes || '—'}.

If any note above rules out a food, a combination, or a piece of equipment, it applies to every suggestion you make, including improvised ones. Do not suggest a substitute that quietly reintroduces the same thing.

## Recent weigh-ins
${recent}

## Current week plan
${planBlock}
`;
}

/* ── system prompt ─────────────────────────────────────────────── */

export function systemPrompt() {
  return `You are the personal Mediterranean-diet coach for the person described in the CONTEXT FILE below. You are not a generic chatbot: you already know this person, and every answer should show it.

${buildContextFile()}

## Recipe bank available in their app
Reference these by name when you can — they are already costed and the app can show them. Format: id | name | meals | effort | time | calories | protein.
${recipeIndex()}

## How to answer
- Talk like a knowledgeable friend who has been doing this for twenty years. Direct, warm, specific. No hype, no exclamation marks, no "amazing!".
- SHORT. This is being read on a phone, often while tired. Lead with the actual answer in the first sentence. Bullets over paragraphs. Rarely more than 150 words unless they ask for a full plan.
- Always respect today's day type. If they are working 12 hours, do not suggest anything that requires cooking — suggest assembly. If they have a light day, push them to batch cook.
- Respect the calorie and protein targets. When you suggest food, give a rough calorie figure so they can decide.
- PLAIN ENGLISH ONLY, and this is not negotiable. Never use a foreign or specialist culinary word — no shakshuka, keftedes, fasolada, puttanesca, souvlaki, labneh, za'atar, soffritto, julienne, chiffonade, deglaze, emulsify. Say what the food is: "baked eggs in tomato sauce", "turkey patties", "white bean soup". If a technique needs a name, describe the action instead. This person told you outright that unfamiliar recipe names made the whole thing overwhelming, and being overwhelmed is what makes people quit.
- Only suggest ingredients from an ordinary supermarket, under the name they are sold under. No specialty-shop items, nothing that needs a separate trip.
- Mediterranean pattern means: olive oil as the main fat, vegetables at the centre, fish and chicken often, beans and whole grains, yogurt, nuts, fruit for dessert, red meat rarely. Describe it in those plain terms if asked. It is not "low carb" and not "clean eating", and it does not require any special ingredient.
- When they slip, be matter-of-fact and forward-looking. One bad meal is noise. Never shame, never moralise about food.
- If they ask about medication, a medical symptom, a supplement, or anything clinical, give general information and tell them plainly to check with their doctor or pharmacist — especially for blood-pressure or diabetes medication, where losing weight genuinely changes dosing needs.
- Never invent a nutrition number precisely. Say "roughly 450 calories", not "451 calories".
- When they ask what they should be keeping under, answer with the single daily number first, then the weekly total. Do not give them a third figure to remember. If they have gone over, lead with the week, not the day — that is the difference between a recoverable slip and a reason to quit.
- Do not recommend dropping below their calorie floor, fasting protocols they did not ask about, or any supplement.`;
}

/** A one-tap copy of the full context for pasting into the Claude app,
    ChatGPT, or anywhere else — the context file is theirs, not ours. */
export function contextPack(question = '') {
  return `${systemPrompt()}\n\n---\n\nMy question: ${question || '(type your question here)'}`;
}

/* ── streaming client ──────────────────────────────────────────── */

export class ApiError extends Error {
  constructor(message, kind) { super(message); this.kind = kind; }
}

/**
 * Stream a reply from Claude straight from the browser.
 * @param history  [{role:'user'|'assistant', content:string}]
 * @param onDelta  (textChunk) => void
 * @param signal   AbortSignal
 * @returns full text
 */
export async function askCoach(history, onDelta, signal) {
  const s = getState();
  const key = (s.settings.apiKey || '').trim();
  if (!key) throw new ApiError('No API key saved. Add one in Me → Settings.', 'nokey');

  const model = s.settings.model || 'claude-opus-5';
  const body = {
    model,
    max_tokens: 4000,
    stream: true,
    system: systemPrompt(),
    messages: history.slice(-20).map(m => ({ role: m.role, content: m.content }))
  };
  // Haiku 4.5 rejects the effort setting outright, so only send it to models
  // that accept one. Without this guard, picking the cheapest model in
  // settings breaks the coach with a 400.
  if (EFFORT_MODELS.test(model)) body.output_config = { effort: s.settings.effort || 'low' };

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
      body: JSON.stringify(body)
    });
  } catch (e) {
    if (e.name === 'AbortError') throw e;
    throw new ApiError('Could not reach the API. Check your connection.', 'network');
  }

  if (!res.ok) {
    let detail = '';
    try { detail = (await res.json())?.error?.message || ''; } catch { /* body not JSON */ }
    if (res.status === 401) throw new ApiError('That API key was rejected. Check it in Me → Settings.', 'auth');
    if (res.status === 429) throw new ApiError('Rate limited by the API. Wait a moment and try again.', 'rate');
    if (res.status === 400 && /credit|balance/i.test(detail)) {
      throw new ApiError('Your Anthropic account is out of credit.', 'credit');
    }
    throw new ApiError(detail || `API error ${res.status}.`, 'api');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let full = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop();               // keep the partial line

    for (const line of lines) {
      if (!line.startsWith('data:')) continue;
      const payload = line.slice(5).trim();
      if (!payload || payload === '[DONE]') continue;
      let evt;
      try { evt = JSON.parse(payload); } catch { continue; }

      if (evt.type === 'content_block_delta' && evt.delta?.type === 'text_delta') {
        full += evt.delta.text;
        onDelta(evt.delta.text);
      } else if (evt.type === 'error') {
        throw new ApiError(evt.error?.message || 'Stream error.', 'api');
      }
    }
  }

  if (!full.trim()) throw new ApiError('The model returned nothing. Try rephrasing.', 'empty');
  return full;
}

/** Cheap non-streaming check that a key works. */
export async function testKey(key, model) {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': key.trim(),
      'anthropic-version': API_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: model || 'claude-opus-5',
      max_tokens: 16,
      messages: [{ role: 'user', content: 'Reply with the single word: ready' }]
    })
  });
  if (res.ok) return { ok: true };
  let detail = '';
  try { detail = (await res.json())?.error?.message || ''; } catch { /* ignore */ }
  return { ok: false, status: res.status, detail };
}

/* Quick prompts. Deliberately written the way the situation actually feels. */
export const QUICK_PROMPTS = [
  { icon: '🍽️', label: 'What do I eat tonight?', text: 'Given how many hours I worked today and what I have already eaten, what should dinner be? Keep it to one recommendation and a backup.' },
  { icon: '😮‍💨', label: 'I am wiped out', text: 'I am exhausted and about to order takeout. Talk me into something I can actually put together in under ten minutes.' },
  { icon: '🗓️', label: 'Plan my week', text: 'Look at my work hours for the week and tell me exactly how to sequence my cooking — what to batch cook and when, and which nights are assembly-only.' },
  { icon: '🍷', label: 'Eating out tonight', text: 'I am eating at a restaurant tonight. Give me a simple ordering strategy that keeps me roughly on target without making it weird.' },
  { icon: '🍫', label: 'I want something sweet', text: 'I am craving something sweet. What do I do right now?' },
  { icon: '📉', label: 'The scale went up', text: 'The scale went up this week even though I stuck to the plan. Explain what is actually happening and what, if anything, I should change.' },
  { icon: '🛒', label: 'What should I always keep in?', text: 'What should I permanently keep stocked so I am never more than ten minutes from a decent Mediterranean meal?' },
  { icon: '💪', label: 'Am I getting enough protein?', text: 'Look at my targets and my plan for this week. Am I actually hitting enough protein to protect my muscle at my age? Be specific about where I fall short.' },
  { icon: '📷', label: 'How is today going?', text: 'Look at what I have actually logged today against my targets. Where am I, and what should the rest of the day look like? Be specific about protein.' },
  { icon: '🎯', label: 'What should I keep under?', text: 'What number should I be keeping under, and where does it come from? Then tell me where I am against it for the week so far, and whether I need to change anything.' }
];
