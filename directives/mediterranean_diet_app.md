# Mediterranean Plan — iPhone PWA
<!-- DOE-VERSION: 2026.08.28 -->

## Goal

An installable iPhone app (progressive web app) that builds a Mediterranean weight-loss plan around the operator's actual work hours, with a Claude-powered coach that reads a persistent, user-editable context file on every message.

---

## Trigger Phrases

**Matches:**
- "open the diet app"
- "update the Mediterranean plan app"
- "deploy the diet PWA"
- "add recipes to the diet app"
- "change the calorie or protein math"

---

## Quick Start

```bash
# serve locally
cd app && python -m http.server 8000     # then http://localhost:8000

# deploy (GitHub Pages, /app/ path)
git add app && git commit -m "Update Mediterranean Plan" && git push
```

Full deployment and iPhone install steps: `app/README.md`.

---

## What It Does

1. **Onboards** — six screens capturing age, sex, height, weight, goal, rate, per-day work hours, cooking honesty, dislikes/allergies/conditions, and an optional Anthropic API key.
2. **Computes targets** — Mifflin-St Jeor BMR × activity, deficit capped at 25% of TDEE and floored at 1500/1250 kcal, protein set at 1.6 g/kg of goal weight to protect lean mass.
3. **Builds the week** — classifies each day by hours worked (off / light / normal / long / brutal), which sets the maximum cooking effort and the calorie split. Batch cooks land on the lightest day; their leftovers are routed forward to the heaviest days with exact portion accounting.
4. **Runs the day** — Today shows remaining calories, all four macros, an hours-worked stepper, tick-off meals, and weigh-in. If actual hours diverge from planned, it offers to re-tune the rest of the day.
5. **Logs what was actually eaten** — photograph a meal, Claude returns a per-item estimate against a JSON schema, and every number is editable before it is saved. Photos are stored in IndexedDB; the numbers live in the day log.
6. **Coaches** — streams from `api.anthropic.com` directly from the browser, injecting a generated context file (now including the day's real intake) plus a compact index of all 44 recipes into the system prompt.

---

## Output

**Deliverable:** A static PWA the operator installs to the iPhone home screen via Safari → Share → Add to Home Screen.
**Location:** `app/` — plain HTML/CSS/ES modules, no build step, no dependencies.

---

## Key Design Decisions

- **Work hours drive everything.** Day type gates which recipes are eligible, how calories split across meals, and what the coach is told. This is the app's whole reason to exist.
- **The plan is a supply chain.** Batch cook on the light day, eat the leftovers on the brutal day. Verified: across 300 generated weeks, no batch recipe is ever eaten more than it makes.
- **Portions scale, recipes don't multiply.** One serving is the recipe's unit; the planner scales servings (0.75–3, per-slot ceilings) to hit the calorie target. Breakfast and snacks are capped lower so surplus doesn't become 900 kcal of oats or six squares of chocolate.
- **Allergies expand to foods.** "Shellfish" is mapped to shrimp/mussel/prawn/etc., because recipes list foods, not categories. Matching is whole-word so "egg" doesn't knock out eggplant, and "olive oil" is excluded so disliking olives doesn't empty the bank.
- **Plain English, ordinary ingredients.** Recipes are named after what is on the plate — no foreign culinary words — and every ingredient is sold in a normal supermarket under the name written. The operator reported that unfamiliar recipe names made the app overwhelming, which is the failure mode that ends adherence. The same rule is enforced on the AI coach in the system prompt.
- **Context file is the product.** Following Daniel Miessler's personal-AI method — the model gets an explicit, readable, user-owned description of the person instead of guessing. Visible and copyable in Me → Context file.
- **Bring-your-own API key.** Stored in localStorage only, never in backups. Everything except the chat and the photo estimate works with no key.
- **The photo estimate is a draft, never a fact.** Every capture lands on a review sheet with editable per-item numbers, a portion scaler, and the model's own stated uncertainty. An app that silently banks a wrong calorie count is one you stop believing, and one you stop believing is one you stop opening. The model is instructed to set confidence honestly and to put anything it cannot see — dressing already tossed through, butter melted in — into an explicit "couldn't tell" field rather than guessing it into the numbers.
- **Photos in IndexedDB, numbers in localStorage.** localStorage is ~5 MB and already holds the profile, plan, weight history and chat; a handful of meal photos would blow it. Blobs go to IndexedDB keyed by id, orphans are pruned on launch, and a backup carries the numbers but not the pictures.
- **Photos are decoded through an `<img>`, not `createImageBitmap`.** An `<img>` applies the EXIF orientation tag, so a photo taken with the phone held sideways arrives upright.
- **Ticked plan meals and logged photos both count.** Ticking says "I ate the plan"; a photo says "here is what I actually ate". `countedToday()` in `app/js/app.js` is the single place that adds them up.

---

## Constraints

- Must be served over HTTPS (or localhost) or the service worker won't register and the app won't install.
- iOS only installs PWAs from **Safari**, not Chrome.
- Browser calls to the Anthropic API require the `anthropic-dangerous-direct-browser-access: true` header (already set in `js/ai.js`).
- Nutrition figures are good-faith estimates. The app states this and defers clinical questions to a doctor — keep that behaviour in the system prompt if you edit it.

---

## Where To Change Things

| Want to change | Edit |
|---|---|
| Add or edit recipes | `app/js/recipes.js` |
| Calorie / protein / macro math | `app/js/nutrition.js` → `targets()` |
| Day-type thresholds and advice | `app/js/nutrition.js` → `DAY_TYPES` |
| Week generation, portions, leftovers, grocery | `app/js/planner.js` |
| Coach personality, rules, context file | `app/js/ai.js` |
| Photo estimation prompt, JSON schema, image sizing | `app/js/vision.js` |
| Meal photo storage and pruning | `app/js/photos.js` |
| Meal log shape, totals, day intake | `app/js/store.js` |
| Screens and layout | `app/js/app.js`, `app/styles.css` |

After editing recipes, re-check coverage: every meal slot needs at least one zero-effort option surviving a common allergy set, or heavily restricted users get a stretched plan.

Bump `CACHE` in `app/sw.js` when shipping changes, or installed phones keep serving the old files. New JS modules must also be added to the `SHELL` list there or they will not be available offline.

Only Opus/Sonnet/Fable accept an `output_config.effort` setting — Haiku 4.5 rejects it with a 400. Both `js/ai.js` and `js/vision.js` guard on `EFFORT_MODELS` before sending it.

### Testing

Browser-level tests live outside the repo (scratchpad, Playwright). To re-run them, serve `app/` on `127.0.0.1:8777` and drive the capture flow with `page.route` stubbing `https://api.anthropic.com/**`. Worth covering: the review sheet renders and recomputes, the request carries a base64 image block plus the JSON schema, entries survive reload, and the no-key / API-failure paths both fall through to hand entry rather than losing the photo.
