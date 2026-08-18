# Mediterranean Plan — iPhone PWA
<!-- DOE-VERSION: 2026.08.18 -->

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
4. **Runs the day** — Today shows remaining calories and protein, an hours-worked stepper, tick-off meals, and weigh-in. If actual hours diverge from planned, it offers to re-tune the rest of the day.
5. **Coaches** — streams from `api.anthropic.com` directly from the browser, injecting a generated context file plus a compact index of all 42 recipes into the system prompt.

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
- **Bring-your-own API key.** Stored in localStorage only, never in backups. Everything except the chat works with no key.

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
| Screens and layout | `app/js/app.js`, `app/styles.css` |

After editing recipes, re-check coverage: every meal slot needs at least one zero-effort option surviving a common allergy set, or heavily restricted users get a stretched plan.

Bump `CACHE` in `app/sw.js` when shipping changes, or installed phones keep serving the old files.
