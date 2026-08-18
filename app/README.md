# Mediterranean Plan

An installable iPhone app (PWA) that builds a Mediterranean eating plan around **the hours you actually work**, with an AI coach that already knows your whole situation.

Built for someone roughly 58–63 years old carrying ~25 lb they want gone. That shapes real decisions in the code: the protein target is deliberately high (muscle loss, not fat loss, is the risk in a deficit at that age), the deficit is capped and floored for safety, and the type is large and high-contrast.

---

## Getting it onto your iPhone

The app is plain static files — no build step, no npm, no server. Any static host works.

### Option A — GitHub Pages (free, ~3 minutes)

```bash
cd C:\Users\ptomlinson\Documents\DEV\SaaS\diet-plan-app
git add app && git commit -m "Add Mediterranean Plan PWA"
git push
```

Then on GitHub: **Settings → Pages → Source: Deploy from a branch → main → /(root) → Save**.

After a minute your URL is:

```
https://<your-username>.github.io/<repo-name>/app/
```

### Option B — Netlify Drop (no git, ~30 seconds)

Drag the `app/` folder onto <https://app.netlify.com/drop>. You get a URL immediately.

### Then, on the iPhone

1. Open the URL **in Safari** (this does not work from Chrome on iOS).
2. Tap the **Share** button.
3. **Add to Home Screen** → Add.

You now have a real app icon. It launches full-screen with no browser chrome, and works with no signal.

> It must be served over `https://` (or `localhost`). Opening `index.html` from the file system will not register the service worker and will not install.

### Testing locally first

```bash
cd app
python -m http.server 8000
```

Then visit <http://localhost:8000>.

---

## The AI coach

The coach uses **your own** Anthropic API key, entered in **Me → AI coach**. It is stored only in this browser's local storage and is sent only to `api.anthropic.com`.

Get a key at <https://console.anthropic.com/settings/keys>. Realistic cost is a dollar or two a month at normal use — each message sends roughly 2,300 tokens of context plus the conversation.

Model and answer depth are switchable in settings (Opus 5 / Sonnet 5 / Haiku 4.5).

**You do not need a key.** Targets, the weekly plan, the recipe bank, the grocery list, swaps, tracking and the trend chart all work without one. Without a key the Coach tab offers **Copy my context** instead, which puts the full context file on your clipboard to paste into the Claude app by hand.

---

## The method

This follows Daniel Miessler's personal-AI approach: the model is never asked to be clever from a cold start. Every request carries an explicit, human-readable **context file** describing who you are, what you're trying to do, and what today actually looks like.

You can read that file, edit it, and copy it out — it's in **Me → Context file**. That transparency is the point. The AI is the reasoning engine; the context file is what makes its answers yours rather than generic.

The context file is regenerated live on every message and includes your stats and targets, your work schedule and today's hours, today's day type and its rule, what you've already eaten, recent weigh-ins, and the current week's plan.

---

## How the work-hours model works

Hours worked is the single best predictor of whether a dinner plan survives contact with reality, so it drives everything.

| Hours | Day type | Max effort | Calorie split |
|---|---|---|---|
| 0 | Day off | Batch cook (90 min) | Even |
| 1–7 | Light | Batch cook (60 min) | Even |
| 8–9 | Normal | Cook (35 min) | Even |
| 10–11 | Long | Quick (20 min) | Bigger lunch, lighter dinner |
| 12+ | Brutal | No cook (8 min) | Front-loaded, larger planned snack |

The day type controls which recipes are even eligible, how the day's calories are split across meals, and what the coach is told about tonight.

**The plan is a supply chain, not a list.** Batch cooks land on your lightest day, and their leftovers are deliberately routed forward to your heaviest days. That's why a 13-hour Tuesday still eats properly — Sunday already fed it. The leftover accounting is exact: the week never eats more of a batch than the batch makes.

If the day goes sideways, **Today → Re-tune today's meals** rebuilds the rest of the day for the hours you actually worked, leaving anything you've already eaten alone.

---

## What's in it

- **Today** — calories and protein remaining, hours-worked stepper, the day's meals with tick-off, weigh-in.
- **Week** — all 7 days with day types and batch day marked, meal swapping, aisle-grouped grocery list.
- **Recipes** — 42 recipes in plain English, filterable by meal, effort, batch, or protein.
- **Coach** — streaming chat with eight situational quick-prompts. Instructed to answer in plain English and stick to supermarket ingredients.
- **Me** — your targets with the arithmetic shown, weight trend chart, the context file, settings, JSON backup/restore.

Portions scale to your target (a 240 lb active man and a 140 lb woman need very different plates from the same recipe), and the plan shows `× 1.5` where it does.

---

## Files

```
app/
  index.html              shell
  styles.css              all styling, light + dark
  manifest.webmanifest    PWA manifest
  sw.js                   service worker (offline)
  icons/                  app icons
  js/
    store.js              localStorage state, dates, weight series
    nutrition.js          Mifflin-St Jeor, targets, the day-type model
    recipes.js            the recipe bank
    planner.js            week generation, portions, leftovers, grocery list
    ai.js                 context file, system prompt, streaming Claude client
    app.js                views and routing
```

---

## Your data

Everything lives in this browser's local storage on your phone. Nothing is uploaded. Clearing Safari's site data erases it — **Me → Export backup** writes a JSON file (the API key is deliberately excluded from backups).

---

## Not medical advice

This gives general nutrition guidance computed from your own numbers. It does not know your bloodwork. If you take medication — especially for blood pressure, diabetes, or blood thinning — talk to your doctor before and during a weight-loss push, because losing 25 lb genuinely changes what your body needs.

Calorie and macro figures throughout are good-faith estimates, not laboratory values.
