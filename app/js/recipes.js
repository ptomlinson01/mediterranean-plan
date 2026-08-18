/* Mediterranean recipe bank.
   effort tiers: zero (no cook), quick (<=20m), standard (<=40m), project (batch cook)
   Nutrition is per serving and is a good-faith estimate, not lab-measured.
   aisles: produce | protein | pantry | dairy | frozen | bakery | other          */

export const AISLES = ['produce', 'protein', 'dairy', 'pantry', 'bakery', 'frozen', 'other'];

export const RECIPES = [
/* ─────────────────────────── BREAKFAST ─────────────────────────── */
{
  id: 'b-yogurt-walnut', name: 'Greek Yogurt, Walnuts & Berries', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 340, protein: 28, carbs: 30, fat: 14, fiber: 5,
  tags: ['high-protein', 'no-cook', 'portable'],
  ingredients: [
    { n: 'Plain Greek yogurt, 2%', q: 1, u: 'cup', a: 'dairy' },
    { n: 'Walnut halves', q: 7, u: 'halves', a: 'pantry' },
    { n: 'Mixed berries', q: 0.75, u: 'cup', a: 'produce' },
    { n: 'Honey', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Ground cinnamon', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: [
    'Spoon yogurt into a bowl.',
    'Top with berries and walnuts.',
    'Drizzle honey, dust with cinnamon.'
  ],
  note: 'The 28g of protein here is doing real work — it blunts the 10am snack urge better than any bowl of oatmeal.'
},
{
  id: 'b-feta-scramble', name: 'Feta & Tomato Scramble', meal: ['breakfast'],
  effort: 'quick', minutes: 10, servings: 1, kcal: 365, protein: 26, carbs: 12, fat: 25, fiber: 3,
  tags: ['high-protein', 'low-carb'],
  ingredients: [
    { n: 'Eggs', q: 2, u: 'large', a: 'protein' },
    { n: 'Egg whites', q: 2, u: 'large', a: 'protein' },
    { n: 'Feta cheese, crumbled', q: 1, u: 'oz', a: 'dairy' },
    { n: 'Cherry tomatoes, halved', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Baby spinach', q: 1, u: 'cup', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: [
    'Warm oil in a nonstick pan over medium.',
    'Add tomatoes, cook 2 min until they slump. Add spinach, wilt 30 sec.',
    'Pour in beaten eggs and whites. Stir slowly until just set — pull them off early.',
    'Off heat, fold in feta and oregano.'
  ]
},
{
  id: 'b-overnight-oats', name: 'Fig & Almond Overnight Oats', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 385, protein: 19, carbs: 48, fat: 14, fiber: 8,
  tags: ['no-cook', 'portable', 'prep-ahead'],
  ingredients: [
    { n: 'Rolled oats', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Plain Greek yogurt, 2%', q: 0.5, u: 'cup', a: 'dairy' },
    { n: 'Unsweetened almond milk', q: 0.5, u: 'cup', a: 'dairy' },
    { n: 'Dried figs, chopped', q: 2, u: 'whole', a: 'pantry' },
    { n: 'Sliced almonds', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Ground cinnamon', q: 0.25, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Combine everything except almonds in a jar.',
    'Refrigerate overnight (or at least 4 hours).',
    'Top with almonds in the morning. Eat cold, straight from the jar.'
  ],
  note: 'Build two jars at once on a Sunday. Costs you 90 extra seconds and buys back a Wednesday morning.'
},
{
  id: 'b-shakshuka', name: 'Shakshuka for One', meal: ['breakfast', 'dinner'],
  effort: 'standard', minutes: 25, servings: 1, kcal: 395, protein: 23, carbs: 24, fat: 23, fiber: 6,
  tags: ['weekend', 'vegetarian'],
  ingredients: [
    { n: 'Eggs', q: 2, u: 'large', a: 'protein' },
    { n: 'Canned crushed tomatoes', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Red bell pepper, sliced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Onion, diced', q: 0.25, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 2, u: 'cloves', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Ground cumin', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Smoked paprika', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Feta cheese, crumbled', q: 0.75, u: 'oz', a: 'dairy' },
    { n: 'Fresh parsley', q: 2, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Soften onion and pepper in olive oil, 6–7 min.',
    'Add garlic, cumin, paprika — 45 seconds until fragrant.',
    'Pour in tomatoes, simmer 8 min until thickened.',
    'Make two wells, crack in eggs, cover and cook 5–6 min for runny yolks.',
    'Scatter feta and parsley.'
  ]
},
{
  id: 'b-ricotta-toast', name: 'Ricotta, Tomato & Olive Oil Toast', meal: ['breakfast'],
  effort: 'quick', minutes: 8, servings: 1, kcal: 350, protein: 19, carbs: 34, fat: 16, fiber: 6,
  tags: ['quick'],
  ingredients: [
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Part-skim ricotta', q: 0.5, u: 'cup', a: 'dairy' },
    { n: 'Tomato, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Fresh basil', q: 4, u: 'leaves', a: 'produce' },
    { n: 'Flaky salt & black pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Toast the bread until genuinely crisp.',
    'Spread ricotta thickly, layer tomato on top.',
    'Olive oil, salt, pepper, torn basil.'
  ]
},
{
  id: 'b-egg-muffins', name: 'Spinach & Feta Egg Muffins', meal: ['breakfast'],
  effort: 'project', minutes: 45, servings: 4, batch: true, kcal: 285, protein: 23, carbs: 6, fat: 19, fiber: 2,
  tags: ['batch', 'portable', 'high-protein', 'low-carb'],
  ingredients: [
    { n: 'Eggs', q: 8, u: 'large', a: 'protein' },
    { n: 'Egg whites', q: 4, u: 'large', a: 'protein' },
    { n: 'Frozen chopped spinach, thawed & squeezed', q: 10, u: 'oz', a: 'frozen' },
    { n: 'Feta cheese, crumbled', q: 4, u: 'oz', a: 'dairy' },
    { n: 'Roasted red peppers, chopped', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tbsp', a: 'pantry' }
  ],
  steps: [
    'Heat oven to 350°F. Oil a 12-cup muffin tin well.',
    'Squeeze the spinach genuinely dry — wet spinach makes soggy muffins.',
    'Whisk eggs and whites, fold in spinach, feta, peppers, oregano.',
    'Divide into 12 cups. Bake 22–25 min until set and puffed.',
    'Cool, then refrigerate up to 5 days. Three muffins = one serving.'
  ],
  note: 'This is your insurance policy against the 12-hour Tuesday. Grab three, eat them cold in the car.'
},
{
  id: 'b-tuna-bean-toast', name: 'Tuna & White Bean Toast', meal: ['breakfast', 'lunch'],
  effort: 'quick', minutes: 7, servings: 1, kcal: 405, protein: 33, carbs: 38, fat: 13, fiber: 9,
  tags: ['high-protein', 'quick', 'pantry-only'],
  ingredients: [
    { n: 'Canned tuna in olive oil, drained', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'Cannellini beans, rinsed', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Red onion, thin sliced', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Fresh parsley', q: 2, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Mash half the beans with lemon and olive oil.',
    'Fold in tuna, whole beans, onion, parsley.',
    'Pile onto toast.'
  ]
},
{
  id: 'b-smoothie', name: 'Mediterranean Breakfast Smoothie', meal: ['breakfast'],
  effort: 'zero', minutes: 4, servings: 1, kcal: 335, protein: 25, carbs: 34, fat: 12, fiber: 6,
  tags: ['no-cook', 'portable', 'high-protein'],
  ingredients: [
    { n: 'Plain Greek yogurt, 2%', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Orange, peeled', q: 1, u: 'whole', a: 'produce' },
    { n: 'Baby spinach', q: 1, u: 'cup', a: 'produce' },
    { n: 'Almond butter', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Ice', q: 0.5, u: 'cup', a: 'other' },
    { n: 'Unsweetened almond milk', q: 0.5, u: 'cup', a: 'dairy' }
  ],
  steps: ['Blend everything 45 seconds.', 'Drink within the hour — it separates.']
},
{
  id: 'b-labneh-bowl', name: 'Labneh Bowl with Za’atar', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 325, protein: 20, carbs: 22, fat: 19, fiber: 4,
  tags: ['no-cook'],
  ingredients: [
    { n: 'Labneh (or thick Greek yogurt)', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Cucumber, diced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes, halved', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Za’atar', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Whole-wheat pita, small', q: 0.5, u: 'whole', a: 'bakery' },
    { n: 'Kalamata olives', q: 5, u: 'whole', a: 'pantry' }
  ],
  steps: [
    'Spread labneh in a shallow bowl, swoosh a well in the middle.',
    'Pile cucumber, tomato, olives on top.',
    'Olive oil, then za’atar. Scoop with pita.'
  ]
},

/* ───────────────────────────── LUNCH ───────────────────────────── */
{
  id: 'l-greek-salad', name: 'Big Greek Salad with Chickpeas', meal: ['lunch'],
  effort: 'quick', minutes: 12, servings: 1, kcal: 455, protein: 20, carbs: 38, fat: 26, fiber: 12,
  tags: ['vegetarian', 'no-cook', 'portable'],
  ingredients: [
    { n: 'Romaine lettuce, chopped', q: 3, u: 'cups', a: 'produce' },
    { n: 'Cucumber, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Tomato, wedged', q: 1, u: 'whole', a: 'produce' },
    { n: 'Red onion, thin sliced', q: 0.25, u: 'whole', a: 'produce' },
    { n: 'Chickpeas, rinsed', q: 0.75, u: 'cup', a: 'pantry' },
    { n: 'Feta cheese', q: 1.5, u: 'oz', a: 'dairy' },
    { n: 'Kalamata olives', q: 8, u: 'whole', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Red wine vinegar', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Dried oregano', q: 0.5, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Combine vegetables and chickpeas in a wide bowl.',
    'Whisk oil, vinegar, oregano — dress and toss.',
    'Break feta over the top in slabs, not crumbs.'
  ],
  note: 'Pack the dressing separately if this is travelling to work.'
},
{
  id: 'l-lentil-jars', name: 'Lentil & Roasted Vegetable Jars', meal: ['lunch'],
  effort: 'project', minutes: 50, servings: 4, batch: true, kcal: 435, protein: 22, carbs: 52, fat: 16, fiber: 15,
  tags: ['batch', 'portable', 'vegetarian', 'meal-prep'],
  ingredients: [
    { n: 'Dry green or brown lentils', q: 1.5, u: 'cups', a: 'pantry' },
    { n: 'Zucchini, chunked', q: 2, u: 'whole', a: 'produce' },
    { n: 'Red bell peppers, chunked', q: 2, u: 'whole', a: 'produce' },
    { n: 'Red onion, wedged', q: 1, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes', q: 2, u: 'cups', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 4, u: 'tbsp', a: 'pantry' },
    { n: 'Feta cheese', q: 4, u: 'oz', a: 'dairy' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Dried oregano', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Baby arugula', q: 4, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Heat oven to 425°F. Toss vegetables with 3 tbsp oil, oregano, salt. Roast 30 min, stirring once.',
    'Simmer lentils in plenty of water 20–25 min until tender but not mushy. Drain.',
    'Dress the lentils while warm with lemon juice and remaining oil — warm legumes absorb dressing, cold ones do not.',
    'Layer four jars: lentils on the bottom, roast vegetables, feta. Arugula in a separate bag.',
    'Refrigerate up to 4 days. Add arugula the moment you eat.'
  ],
  note: 'Four lunches from one Sunday hour. The single highest-leverage cook in the whole plan.'
},
{
  id: 'l-tuna-box', name: 'Tuna Niçoise Lunch Box', meal: ['lunch'],
  effort: 'quick', minutes: 12, servings: 1, kcal: 445, protein: 34, carbs: 30, fat: 22, fiber: 8,
  tags: ['high-protein', 'portable'],
  ingredients: [
    { n: 'Canned tuna in olive oil, drained', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'Egg, hard-boiled', q: 1, u: 'large', a: 'protein' },
    { n: 'Green beans, blanched', q: 1, u: 'cup', a: 'produce' },
    { n: 'Baby potatoes, boiled', q: 4, u: 'small', a: 'produce' },
    { n: 'Cherry tomatoes', q: 0.75, u: 'cup', a: 'produce' },
    { n: 'Kalamata olives', q: 8, u: 'whole', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Dijon mustard', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Boil potatoes and egg together, 10 min; drop green beans in for the last 3.',
    'Cool under cold water, halve everything.',
    'Pack in compartments. Shake oil, mustard, lemon in a small jar and carry alongside.'
  ]
},
{
  id: 'l-leftover-bowl', name: 'Leftover Grain Bowl', meal: ['lunch', 'dinner'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 450, protein: 26, carbs: 45, fat: 20, fiber: 10,
  tags: ['no-cook', 'leftovers', 'flexible'],
  ingredients: [
    { n: 'Cooked grain (farro, bulgur, brown rice)', q: 0.75, u: 'cup', a: 'pantry' },
    { n: 'Last night’s protein, chopped', q: 4, u: 'oz', a: 'protein' },
    { n: 'Any raw vegetable, chopped', q: 1.5, u: 'cups', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Feta cheese', q: 1, u: 'oz', a: 'dairy' }
  ],
  steps: [
    'Grain on the bottom, protein and vegetables on top.',
    'Olive oil, lemon, salt, pepper. Toss hard.',
    'Feta last — or a spoon of olives instead, if you have them.'
  ],
  note: 'Deliberately vague. That is the point — this slot absorbs whatever is actually in your fridge.'
},
{
  id: 'l-chicken-wrap', name: 'Hummus & Grilled Chicken Wrap', meal: ['lunch'],
  effort: 'quick', minutes: 10, servings: 1, kcal: 470, protein: 37, carbs: 42, fat: 17, fiber: 9,
  tags: ['high-protein', 'portable'],
  ingredients: [
    { n: 'Whole-wheat wrap or lavash', q: 1, u: 'large', a: 'bakery' },
    { n: 'Cooked chicken breast, sliced', q: 4, u: 'oz', a: 'protein' },
    { n: 'Hummus', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Cucumber, sliced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Tomato, sliced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Baby spinach', q: 1, u: 'cup', a: 'produce' },
    { n: 'Red onion, thin sliced', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Lemon juice', q: 2, u: 'tsp', a: 'produce' }
  ],
  steps: [
    'Spread hummus edge to edge — it is the glue and the sauce.',
    'Layer spinach, chicken, cucumber, tomato, onion. Squeeze lemon.',
    'Roll tight, cut on the diagonal.'
  ]
},
{
  id: 'l-white-bean-tuna', name: 'White Bean & Tuna Salad', meal: ['lunch'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 425, protein: 34, carbs: 34, fat: 16, fiber: 11,
  tags: ['no-cook', 'pantry-only', 'high-protein', 'portable'],
  ingredients: [
    { n: 'Canned tuna in olive oil, drained', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'Cannellini beans, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Celery, diced', q: 1, u: 'stalk', a: 'produce' },
    { n: 'Red onion, minced', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Fresh parsley, chopped', q: 3, u: 'tbsp', a: 'produce' },
    { n: 'Lemon juice', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Arugula', q: 2, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Fold everything together, gently — you want the beans intact.',
    'Let it sit 5 minutes if you can. It improves.',
    'Serve over arugula.'
  ],
  note: 'Zero cooking, no fresh-ingredient dependency except the greens. Keep this permanently stocked.'
},
{
  id: 'l-lemon-chicken-soup', name: 'Lemon Chicken & Orzo Soup', meal: ['lunch', 'dinner'],
  effort: 'project', minutes: 45, servings: 5, batch: true, kcal: 400, protein: 31, carbs: 40, fat: 12, fiber: 5,
  tags: ['batch', 'meal-prep', 'freezes'],
  ingredients: [
    { n: 'Chicken breast or thigh', q: 1.25, u: 'lb', a: 'protein' },
    { n: 'Low-sodium chicken broth', q: 8, u: 'cups', a: 'pantry' },
    { n: 'Whole-wheat orzo', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Carrots, diced', q: 3, u: 'whole', a: 'produce' },
    { n: 'Celery, diced', q: 3, u: 'stalks', a: 'produce' },
    { n: 'Onion, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Fresh dill, chopped', q: 0.25, u: 'cup', a: 'produce' },
    { n: 'Baby spinach', q: 4, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Soften onion, carrot, celery in oil, 8 min. Add garlic 1 min.',
    'Add broth and whole chicken pieces. Simmer 18 min until cooked through.',
    'Pull chicken out, shred, return to the pot.',
    'Add orzo, cook 8 min. Stir in spinach until wilted.',
    'Off heat: juice of both lemons and all the dill. Taste — it usually wants more lemon.'
  ],
  note: 'Portion into five containers while it is still warm, or you will not do it.'
},
{
  id: 'l-sardine-toast', name: 'Sardine Toast with Lemon & Parsley', meal: ['lunch'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 395, protein: 29, carbs: 32, fat: 18, fiber: 6,
  tags: ['no-cook', 'pantry-only', 'omega-3', 'high-protein'],
  ingredients: [
    { n: 'Sardines in olive oil, drained', q: 1, u: 'tin (4oz)', a: 'pantry' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Lemon', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Fresh parsley, chopped', q: 3, u: 'tbsp', a: 'produce' },
    { n: 'Red onion, thin sliced', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Red pepper flakes', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: [
    'Toast the bread hard.',
    'Lay sardines on top, break them up slightly with a fork.',
    'Onion, parsley, big squeeze of lemon, olive oil, pepper flakes.'
  ],
  note: 'Two tins a week covers your omega-3s for roughly a dollar a serving.'
},
{
  id: 'l-farro-salad', name: 'Farro Salad with Cucumber, Feta & Mint', meal: ['lunch'],
  effort: 'standard', minutes: 35, servings: 4, batch: true, kcal: 420, protein: 16, carbs: 52, fat: 17, fiber: 10,
  tags: ['batch', 'vegetarian', 'portable', 'meal-prep'],
  ingredients: [
    { n: 'Pearled farro', q: 1.25, u: 'cups', a: 'pantry' },
    { n: 'Cucumber, diced', q: 2, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes, halved', q: 2, u: 'cups', a: 'produce' },
    { n: 'Feta cheese', q: 4, u: 'oz', a: 'dairy' },
    { n: 'Fresh mint, chopped', q: 0.33, u: 'cup', a: 'produce' },
    { n: 'Fresh parsley, chopped', q: 0.33, u: 'cup', a: 'produce' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Chickpeas, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Red onion, minced', q: 0.5, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Simmer farro 25 min until chewy-tender. Drain, spread on a tray to cool fast.',
    'Whisk lemon juice, olive oil, salt, pepper.',
    'Toss everything together while the farro is still barely warm.',
    'Better on day two. Keeps 4 days.'
  ]
},
{
  id: 'l-chickpea-patties', name: 'Baked Chickpea Patties in Pita', meal: ['lunch', 'dinner'],
  effort: 'project', minutes: 50, servings: 4, batch: true, kcal: 460, protein: 20, carbs: 58, fat: 17, fiber: 14,
  tags: ['batch', 'vegetarian', 'meal-prep'],
  ingredients: [
    { n: 'Chickpeas, rinsed & dried', q: 2, u: 'cans (15oz)', a: 'pantry' },
    { n: 'Onion, quartered', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Garlic', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Fresh parsley', q: 1, u: 'cup', a: 'produce' },
    { n: 'Ground cumin', q: 1.5, u: 'tsp', a: 'pantry' },
    { n: 'Ground coriander', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Chickpea or whole-wheat flour', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Whole-wheat pitas', q: 4, u: 'whole', a: 'bakery' },
    { n: 'Plain Greek yogurt, 2%', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Tahini', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Tomato, cucumber, lettuce for stuffing', q: null, u: 'as needed', a: 'produce' }
  ],
  steps: [
    'Heat oven to 400°F. Pulse chickpeas, onion, garlic, parsley, spices to a coarse crumb — not a puree.',
    'Stir in flour. Form 12 patties, brush both sides with oil.',
    'Bake 25 min, flipping at 15. They should be golden and firm.',
    'Whisk yogurt with tahini and lemon for the sauce.',
    'Three patties per pita with salad and sauce. Patties keep 4 days; reheat in a dry pan.'
  ]
},
{
  id: 'l-caprese-chickpea', name: 'Caprese Plate with Chickpeas', meal: ['lunch'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 430, protein: 23, carbs: 34, fat: 23, fiber: 9,
  tags: ['no-cook', 'vegetarian'],
  ingredients: [
    { n: 'Fresh mozzarella', q: 2.5, u: 'oz', a: 'dairy' },
    { n: 'Tomatoes, sliced', q: 2, u: 'whole', a: 'produce' },
    { n: 'Chickpeas, rinsed', q: 0.75, u: 'cup', a: 'pantry' },
    { n: 'Fresh basil', q: 10, u: 'leaves', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Balsamic vinegar', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Whole-grain bread', q: 1, u: 'slice', a: 'bakery' }
  ],
  steps: [
    'Alternate tomato and mozzarella on a plate.',
    'Scatter chickpeas around, tuck basil in.',
    'Olive oil, balsamic, flaky salt, plenty of pepper. Bread on the side.'
  ]
},
{
  id: 'l-chopped-chicken', name: 'Chopped Salad with Rotisserie Chicken', meal: ['lunch'],
  effort: 'quick', minutes: 10, servings: 1, kcal: 445, protein: 39, carbs: 26, fat: 22, fiber: 9,
  tags: ['high-protein', 'quick', 'no-cook'],
  ingredients: [
    { n: 'Rotisserie chicken, pulled', q: 5, u: 'oz', a: 'protein' },
    { n: 'Romaine, chopped', q: 3, u: 'cups', a: 'produce' },
    { n: 'Cucumber, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes, halved', q: 1, u: 'cup', a: 'produce' },
    { n: 'Chickpeas, rinsed', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Feta cheese', q: 1, u: 'oz', a: 'dairy' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Red wine vinegar', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Dried oregano', q: 0.5, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Chop everything to roughly the same size — it genuinely eats better.',
    'Dress, toss, top with feta.'
  ]
},

/* ───────────────────────────── DINNER ──────────────────────────── */
{
  id: 'd-sheetpan-salmon', name: 'Sheet-Pan Lemon Salmon & Asparagus', meal: ['dinner'],
  effort: 'standard', minutes: 30, servings: 2, kcal: 520, protein: 41, carbs: 32, fat: 25, fiber: 6,
  tags: ['omega-3', 'one-pan', 'high-protein'],
  ingredients: [
    { n: 'Salmon fillets', q: 2, u: 'x 5oz', a: 'protein' },
    { n: 'Asparagus, trimmed', q: 1, u: 'lb', a: 'produce' },
    { n: 'Baby potatoes, halved', q: 12, u: 'oz', a: 'produce' },
    { n: 'Lemon, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, minced', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Fresh dill', q: 2, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Oven to 425°F. Toss potatoes with half the oil, roast 15 min alone.',
    'Push potatoes aside. Add salmon and asparagus, remaining oil, garlic, oregano, lemon slices.',
    'Roast 12–14 min until the salmon flakes at the thickest point.',
    'Dill and a squeeze of lemon at the table.'
  ],
  note: 'One pan, one cleanup. Cook both fillets even if you are eating alone — tomorrow’s lunch just built itself.'
},
{
  id: 'd-garlic-shrimp', name: 'Garlic Shrimp with Zucchini & Tomatoes', meal: ['dinner'],
  effort: 'quick', minutes: 18, servings: 2, kcal: 420, protein: 37, carbs: 24, fat: 20, fiber: 5,
  tags: ['quick', 'high-protein', 'low-carb'],
  ingredients: [
    { n: 'Shrimp, peeled', q: 1, u: 'lb', a: 'protein' },
    { n: 'Zucchini, half-moons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes', q: 2, u: 'cups', a: 'produce' },
    { n: 'Garlic, sliced', q: 5, u: 'cloves', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'White wine or broth', q: 0.25, u: 'cup', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Fresh parsley', q: 0.25, u: 'cup', a: 'produce' },
    { n: 'Red pepper flakes', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' }
  ],
  steps: [
    'Sear zucchini in 1 tbsp oil over high heat until browned, 5 min. Set aside.',
    'Same pan: remaining oil, garlic and pepper flakes, 30 seconds only.',
    'Shrimp in a single layer, 90 seconds per side.',
    'Tomatoes and wine, bubble 2 min until they burst.',
    'Return zucchini, off heat, lemon and parsley. Bread to mop the pan.'
  ]
},
{
  id: 'd-souvlaki', name: 'Chicken Souvlaki Skillet with Tzatziki', meal: ['dinner'],
  effort: 'standard', minutes: 30, servings: 2, kcal: 490, protein: 45, carbs: 30, fat: 21, fiber: 5,
  tags: ['high-protein'],
  ingredients: [
    { n: 'Chicken breast, cubed', q: 1, u: 'lb', a: 'protein' },
    { n: 'Plain Greek yogurt, 2%', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Cucumber, grated & squeezed', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Dried oregano', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Fresh dill', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Whole-wheat pitas', q: 2, u: 'small', a: 'bakery' },
    { n: 'Tomato & red onion', q: null, u: 'to serve', a: 'produce' }
  ],
  steps: [
    'Toss chicken with 1 tbsp oil, juice of 1 lemon, oregano, 1 clove garlic. Sit 10 min while the pan heats.',
    'Tzatziki: yogurt, squeezed cucumber, remaining garlic, dill, lemon juice, pinch of salt.',
    'Sear chicken in a hot skillet, hard, 8–10 min. Do not crowd the pan or you are steaming it.',
    'Warm the pitas. Build with tzatziki, chicken, tomato, onion.'
  ]
},
{
  id: 'd-cod-puttanesca', name: 'Baked Cod with Olives, Capers & Tomato', meal: ['dinner'],
  effort: 'quick', minutes: 22, servings: 2, kcal: 400, protein: 39, carbs: 20, fat: 18, fiber: 5,
  tags: ['quick', 'high-protein', 'one-pan'],
  ingredients: [
    { n: 'Cod or haddock fillets', q: 2, u: 'x 6oz', a: 'protein' },
    { n: 'Canned diced tomatoes', q: 1, u: 'can (14oz)', a: 'pantry' },
    { n: 'Kalamata olives, halved', q: 0.33, u: 'cup', a: 'pantry' },
    { n: 'Capers, rinsed', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, sliced', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1.5, u: 'tbsp', a: 'pantry' },
    { n: 'Red pepper flakes', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Fresh parsley', q: 0.25, u: 'cup', a: 'produce' },
    { n: 'Baby spinach', q: 4, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Oven to 400°F. In an oven-safe skillet, sizzle garlic and pepper flakes in oil, 30 sec.',
    'Add tomatoes, olives, capers. Simmer 6 min.',
    'Nestle cod into the sauce, spoon some over. Bake 12 min until opaque.',
    'Wilt spinach into the sauce at the end. Parsley over the top.'
  ]
},
{
  id: 'd-chicken-traybake', name: 'Big-Batch Chicken & Vegetable Traybake', meal: ['dinner'],
  effort: 'project', minutes: 55, servings: 4, batch: true, kcal: 485, protein: 43, carbs: 30, fat: 22, fiber: 7,
  tags: ['batch', 'meal-prep', 'one-pan', 'high-protein'],
  ingredients: [
    { n: 'Chicken thighs, bone-in skin-on', q: 8, u: 'whole', a: 'protein' },
    { n: 'Baby potatoes, halved', q: 1.5, u: 'lb', a: 'produce' },
    { n: 'Red bell peppers, chunked', q: 2, u: 'whole', a: 'produce' },
    { n: 'Red onions, wedged', q: 2, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes', q: 2, u: 'cups', a: 'produce' },
    { n: 'Kalamata olives', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, smashed', q: 6, u: 'cloves', a: 'produce' }
  ],
  steps: [
    'Oven to 425°F. Toss potatoes, peppers, onions, garlic with 2 tbsp oil and half the oregano across two trays.',
    'Rub chicken with remaining oil, oregano, salt, pepper. Set skin-side up on the vegetables.',
    'Roast 35 min. Add tomatoes and olives, roast 12 more until the skin is crisp and juices run clear.',
    'Squeeze the lemons over everything while hot.',
    'Eat two thighs tonight; the rest becomes lunch bowls and wrap filling.'
  ],
  note: 'The engine of the week. Cook this on your lightest day and three heavy days get easy.'
},
{
  id: 'd-fasolada', name: 'Greek White Bean Stew (Fasolada)', meal: ['dinner', 'lunch'],
  effort: 'project', minutes: 60, servings: 6, batch: true, kcal: 395, protein: 19, carbs: 52, fat: 13, fiber: 16,
  tags: ['batch', 'vegetarian', 'meal-prep', 'high-fiber', 'freezes'],
  ingredients: [
    { n: 'Cannellini or great northern beans', q: 3, u: 'cans (15oz)', a: 'pantry' },
    { n: 'Carrots, sliced', q: 4, u: 'whole', a: 'produce' },
    { n: 'Celery, sliced', q: 4, u: 'stalks', a: 'produce' },
    { n: 'Onions, diced', q: 2, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 5, u: 'cloves', a: 'produce' },
    { n: 'Canned crushed tomatoes', q: 1, u: 'can (28oz)', a: 'pantry' },
    { n: 'Vegetable broth', q: 4, u: 'cups', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 5, u: 'tbsp', a: 'pantry' },
    { n: 'Bay leaves', q: 2, u: 'whole', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Fresh parsley', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Sweat onion, carrot, celery in 3 tbsp oil for 12 min — slow, no browning.',
    'Garlic and oregano, 1 min. Then tomatoes, broth, bay leaves.',
    'Simmer 25 min. Add beans, simmer 15 more, mashing some against the pot to thicken.',
    'Off heat: remaining olive oil, parsley, lemon juice. The finishing oil is not optional — it is the dish.',
    'Six portions. Freezes for two months.'
  ]
},
{
  id: 'd-keftedes', name: 'Turkey & Zucchini Keftedes with Salad', meal: ['dinner'],
  effort: 'standard', minutes: 35, servings: 2, kcal: 460, protein: 38, carbs: 24, fat: 24, fiber: 6,
  tags: ['high-protein'],
  ingredients: [
    { n: 'Ground turkey, 93% lean', q: 1, u: 'lb', a: 'protein' },
    { n: 'Zucchini, grated & squeezed', q: 1, u: 'whole', a: 'produce' },
    { n: 'Red onion, grated', q: 0.25, u: 'whole', a: 'produce' },
    { n: 'Fresh mint, chopped', q: 3, u: 'tbsp', a: 'produce' },
    { n: 'Fresh parsley, chopped', q: 3, u: 'tbsp', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Whole-wheat breadcrumbs', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Egg', q: 1, u: 'large', a: 'protein' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Salad greens, cucumber, tomato', q: null, u: 'to serve', a: 'produce' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Squeeze the grated zucchini dry in a towel. Really dry.',
    'Mix everything, form 12 small patties, rest 10 min in the fridge.',
    'Pan-fry in oil over medium, 4 min a side.',
    'Serve over dressed greens with lemon.'
  ]
},
{
  id: 'd-trout-potatoes', name: 'Pan-Seared Trout with Lemon Potatoes', meal: ['dinner'],
  effort: 'standard', minutes: 30, servings: 2, kcal: 500, protein: 38, carbs: 34, fat: 24, fiber: 5,
  tags: ['omega-3', 'high-protein'],
  ingredients: [
    { n: 'Trout or arctic char fillets', q: 2, u: 'x 5oz', a: 'protein' },
    { n: 'Baby potatoes, halved', q: 1, u: 'lb', a: 'produce' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, smashed', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Green beans', q: 0.75, u: 'lb', a: 'produce' },
    { n: 'Fresh dill', q: 2, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Roast potatoes at 425°F with 1 tbsp oil, garlic, oregano and the juice of one lemon, 28 min.',
    'Steam or blanch the green beans, 4 min.',
    'Pat trout very dry, salt it. Sear skin-side down in remaining oil, 4 min, pressing flat. Flip for 90 seconds.',
    'Dill, second lemon, done.'
  ]
},
{
  id: 'd-chickpea-spinach', name: 'Chickpea & Spinach Stew with Yogurt', meal: ['dinner'],
  effort: 'quick', minutes: 20, servings: 2, kcal: 420, protein: 20, carbs: 48, fat: 17, fiber: 13,
  tags: ['quick', 'vegetarian', 'high-fiber', 'pantry-only'],
  ingredients: [
    { n: 'Chickpeas, rinsed', q: 2, u: 'cans (15oz)', a: 'pantry' },
    { n: 'Baby spinach', q: 8, u: 'cups', a: 'produce' },
    { n: 'Canned diced tomatoes', q: 1, u: 'can (14oz)', a: 'pantry' },
    { n: 'Onion, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Ground cumin', q: 1.5, u: 'tsp', a: 'pantry' },
    { n: 'Smoked paprika', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Plain Greek yogurt, 2%', q: 0.5, u: 'cup', a: 'dairy' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Soften onion in oil 6 min. Garlic, cumin, paprika 1 min.',
    'Tomatoes and chickpeas, simmer 8 min, mashing a quarter of the chickpeas to thicken.',
    'Spinach in handfuls until wilted.',
    'Lemon juice, then a spoon of yogurt on each bowl.'
  ]
},
{
  id: 'd-sardine-pasta', name: 'Whole-Wheat Pasta with Sardines & Fennel', meal: ['dinner'],
  effort: 'quick', minutes: 20, servings: 2, kcal: 510, protein: 28, carbs: 58, fat: 20, fiber: 10,
  tags: ['quick', 'omega-3', 'pantry-only'],
  ingredients: [
    { n: 'Whole-wheat spaghetti', q: 6, u: 'oz', a: 'pantry' },
    { n: 'Sardines in olive oil', q: 2, u: 'tins (4oz)', a: 'pantry' },
    { n: 'Fennel bulb, thin sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Garlic, sliced', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Red pepper flakes', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Fresh parsley', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Toasted breadcrumbs', q: 3, u: 'tbsp', a: 'pantry' }
  ],
  steps: [
    'Boil the pasta. Reserve a mug of the water before draining.',
    'Meanwhile soften fennel in oil, 7 min. Garlic and pepper flakes, 1 min.',
    'Add sardines with their oil, break them up.',
    'Toss the pasta in with a splash of pasta water until it goes glossy.',
    'Lemon zest and juice, parsley, breadcrumbs over the top.'
  ]
},
{
  id: 'd-eggplant-halloumi', name: 'Grilled Eggplant, Halloumi & Herbs', meal: ['dinner'],
  effort: 'standard', minutes: 28, servings: 2, kcal: 435, protein: 24, carbs: 26, fat: 27, fiber: 9,
  tags: ['vegetarian'],
  ingredients: [
    { n: 'Eggplant, sliced 1/2 inch', q: 1, u: 'large', a: 'produce' },
    { n: 'Halloumi, sliced', q: 5, u: 'oz', a: 'dairy' },
    { n: 'Cherry tomatoes', q: 1.5, u: 'cups', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Fresh mint & parsley', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Chickpeas, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Pomegranate molasses (optional)', q: 2, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Salt the eggplant slices, rest 10 min, pat dry. This is what stops them soaking up all the oil.',
    'Grill or griddle the eggplant in oil, 4 min a side, until collapsing.',
    'Dry-fry the halloumi 90 seconds a side until it squeaks and browns.',
    'Layer with chickpeas and tomatoes. Lemon, herbs, molasses.'
  ]
},
{
  id: 'd-mussels', name: 'Mussels in Tomato & White Wine Broth', meal: ['dinner'],
  effort: 'standard', minutes: 25, servings: 2, kcal: 420, protein: 36, carbs: 30, fat: 16, fiber: 4,
  tags: ['high-protein', 'omega-3'],
  ingredients: [
    { n: 'Mussels, scrubbed', q: 2, u: 'lb', a: 'protein' },
    { n: 'Canned diced tomatoes', q: 1, u: 'can (14oz)', a: 'pantry' },
    { n: 'Dry white wine', q: 0.75, u: 'cup', a: 'other' },
    { n: 'Shallot, minced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Garlic, sliced', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1.5, u: 'tbsp', a: 'pantry' },
    { n: 'Red pepper flakes', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Fresh parsley', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' }
  ],
  steps: [
    'Discard any mussels that stay open when tapped.',
    'Soften shallot and garlic in oil, 3 min. Pepper flakes.',
    'Wine, bubble 2 min. Tomatoes, simmer 5.',
    'Mussels in, lid on, 5–6 min until they open. Discard any that do not.',
    'Parsley. Bread is mandatory here.'
  ]
},
{
  id: 'd-lentil-tahini-bowl', name: 'Roasted Vegetable & Lentil Bowl, Tahini', meal: ['dinner'],
  effort: 'standard', minutes: 35, servings: 2, kcal: 450, protein: 21, carbs: 50, fat: 20, fiber: 15,
  tags: ['vegetarian', 'high-fiber'],
  ingredients: [
    { n: 'Cooked or canned lentils', q: 1.5, u: 'cups', a: 'pantry' },
    { n: 'Cauliflower florets', q: 4, u: 'cups', a: 'produce' },
    { n: 'Carrots, batons', q: 3, u: 'whole', a: 'produce' },
    { n: 'Red onion, wedged', q: 1, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Ground cumin', q: 1.5, u: 'tsp', a: 'pantry' },
    { n: 'Tahini', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 1, u: 'clove', a: 'produce' },
    { n: 'Fresh parsley', q: 0.33, u: 'cup', a: 'produce' }
  ],
  steps: [
    'Oven 425°F. Toss cauliflower, carrot, onion with oil and cumin. Roast 28 min until the edges char.',
    'Thin the tahini with lemon juice, garlic, and cold water until it pours.',
    'Warm the lentils, pile everything in a bowl.',
    'Tahini over the top, parsley, more lemon.'
  ]
},
{
  id: 'd-mezze-plate', name: 'Zero-Cook Mezze Dinner Plate', meal: ['dinner'],
  effort: 'zero', minutes: 8, servings: 1, kcal: 480, protein: 26, carbs: 42, fat: 25, fiber: 12,
  tags: ['no-cook', 'exhausted', 'vegetarian'],
  ingredients: [
    { n: 'Hummus', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Feta cheese', q: 1.5, u: 'oz', a: 'dairy' },
    { n: 'Chickpeas, rinsed', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Cucumber, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes', q: 1, u: 'cup', a: 'produce' },
    { n: 'Kalamata olives', q: 8, u: 'whole', a: 'pantry' },
    { n: 'Whole-wheat pita', q: 1, u: 'small', a: 'bakery' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: [
    'Put everything on one plate. Do not cook. Do not apologise for it.',
    'Olive oil and oregano over the hummus and feta.',
    'Eat sitting down, at a table, with a glass of water.'
  ],
  note: 'This exists for the 13-hour day. A real Mediterranean dinner with zero heat and zero decisions — it beats the drive-through by about 700 calories.'
},
{
  id: 'd-rescue-chicken', name: 'Rotisserie Chicken Rescue Dinner', meal: ['dinner'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 470, protein: 43, carbs: 22, fat: 24, fiber: 7,
  tags: ['no-cook', 'exhausted', 'high-protein'],
  ingredients: [
    { n: 'Rotisserie chicken, skin removed', q: 6, u: 'oz', a: 'protein' },
    { n: 'Bagged salad mix', q: 3, u: 'cups', a: 'produce' },
    { n: 'Cherry tomatoes', q: 1, u: 'cup', a: 'produce' },
    { n: 'Chickpeas, rinsed', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon or red wine vinegar', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Cucumber, chunked', q: 1, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Tear the chicken off the bird with your hands.',
    'Everything into the biggest bowl you own.',
    'Oil, acid, salt, pepper. Toss. Eight minutes door to plate.',
    'A handful of olives on top if you keep them in.'
  ],
  note: 'Buy the bird on the way home on your longest day. That single decision is worth more than any recipe here.'
},
{
  id: 'd-emergency-bowl', name: 'Tuna & Butter Bean Emergency Bowl', meal: ['dinner', 'lunch'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 440, protein: 36, carbs: 34, fat: 18, fiber: 11,
  tags: ['no-cook', 'exhausted', 'pantry-only', 'high-protein'],
  ingredients: [
    { n: 'Canned tuna in olive oil', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'Butter beans or cannellini, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Roasted red peppers, sliced', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Kalamata olives', q: 8, u: 'whole', a: 'pantry' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Dried oregano', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Baby spinach (optional)', q: 2, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Open three cans. Tip into a bowl.',
    'Oil, lemon, oregano, black pepper.',
    'Stir. Eat. Five minutes, entirely from the cupboard.'
  ],
  note: 'Keep these four cans permanently stocked. This is the meal that stops a bad night becoming a bad week.'
},
{
  id: 'd-greek-thighs', name: 'Sheet-Pan Greek Chicken Thighs & Peppers', meal: ['dinner'],
  effort: 'project', minutes: 50, servings: 4, batch: true, kcal: 515, protein: 42, carbs: 28, fat: 27, fiber: 6,
  tags: ['batch', 'one-pan', 'high-protein', 'meal-prep'],
  ingredients: [
    { n: 'Chicken thighs, boneless skinless', q: 2, u: 'lb', a: 'protein' },
    { n: 'Bell peppers, sliced', q: 3, u: 'whole', a: 'produce' },
    { n: 'Red onions, wedged', q: 2, u: 'whole', a: 'produce' },
    { n: 'Baby potatoes, halved', q: 1, u: 'lb', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 5, u: 'cloves', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Feta cheese', q: 3, u: 'oz', a: 'dairy' }
  ],
  steps: [
    'Marinate the chicken 15 min in oil, lemon juice, garlic, oregano while the oven hits 425°F.',
    'Spread potatoes and onions on a sheet, roast 15 min.',
    'Add peppers and chicken on top, roast 25 min more.',
    'Crumble feta over the hot tray, squeeze the second lemon.',
    'Two portions tonight, two into containers immediately.'
  ]
},

/* ───────────────────────────── SNACKS ──────────────────────────── */
{
  id: 's-apple-almonds', name: 'Apple with Almonds', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 2, servings: 1, kcal: 200, protein: 6, carbs: 26, fat: 10, fiber: 6,
  tags: ['no-cook', 'portable'],
  ingredients: [
    { n: 'Apple', q: 1, u: 'medium', a: 'produce' },
    { n: 'Raw almonds', q: 15, u: 'whole', a: 'pantry' }
  ],
  steps: ['Eat the almonds slowly. Count them out — do not eat from the bag.']
},
{
  id: 's-hummus-veg', name: 'Hummus with Cucumber & Peppers', meal: ['snack'],
  effort: 'zero', minutes: 3, servings: 1, kcal: 180, protein: 7, carbs: 20, fat: 9, fiber: 6,
  tags: ['no-cook', 'portable', 'vegetarian'],
  ingredients: [
    { n: 'Hummus', q: 0.25, u: 'cup', a: 'pantry' },
    { n: 'Cucumber, sticks', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Bell pepper, strips', q: 1, u: 'whole', a: 'produce' }
  ],
  steps: ['Cut the vegetables the night before and this actually gets eaten.']
},
{
  id: 's-yogurt-cinnamon', name: 'Greek Yogurt with Cinnamon', meal: ['snack'],
  effort: 'zero', minutes: 2, servings: 1, kcal: 155, protein: 18, carbs: 12, fat: 4, fiber: 1,
  tags: ['no-cook', 'high-protein'],
  ingredients: [
    { n: 'Plain Greek yogurt, 2%', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Ground cinnamon', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Honey', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: ['Stir. Done.'],
  note: '18g of protein for 155 calories is the best ratio in this entire app.'
},
{
  id: 's-olives-feta', name: 'Olives, Feta & Cherry Tomatoes', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 3, servings: 1, kcal: 175, protein: 7, carbs: 7, fat: 14, fiber: 2,
  tags: ['no-cook', 'low-carb'],
  ingredients: [
    { n: 'Kalamata olives', q: 8, u: 'whole', a: 'pantry' },
    { n: 'Feta cheese', q: 1, u: 'oz', a: 'dairy' },
    { n: 'Cherry tomatoes', q: 0.75, u: 'cup', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: ['Small bowl. Sit down for it — standing at the fridge is how 175 calories becomes 500.']
},
{
  id: 's-pistachios', name: 'A Handful of Pistachios', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 1, servings: 1, kcal: 170, protein: 6, carbs: 8, fat: 14, fiber: 3,
  tags: ['no-cook', 'portable'],
  ingredients: [{ n: 'Pistachios, in shell', q: 1.5, u: 'oz', a: 'pantry' }],
  steps: ['Buy them in the shell. Shelling slows you down, and the pile of shells tells you when to stop.']
},
{
  id: 's-orange-walnuts', name: 'Orange & Walnuts', meal: ['snack'],
  effort: 'zero', minutes: 2, servings: 1, kcal: 160, protein: 4, carbs: 18, fat: 9, fiber: 5,
  tags: ['no-cook', 'portable'],
  ingredients: [
    { n: 'Orange', q: 1, u: 'large', a: 'produce' },
    { n: 'Walnut halves', q: 6, u: 'halves', a: 'pantry' }
  ],
  steps: ['Keep both in your bag. This is the 4pm answer.']
},
{
  id: 's-cottage-tomato', name: 'Cottage Cheese with Tomato & Oregano', meal: ['snack'],
  effort: 'zero', minutes: 3, servings: 1, kcal: 170, protein: 20, carbs: 10, fat: 6, fiber: 1,
  tags: ['no-cook', 'high-protein'],
  ingredients: [
    { n: 'Low-fat cottage cheese', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Cherry tomatoes, halved', q: 0.75, u: 'cup', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: ['Tomatoes and oregano over the cottage cheese, olive oil, lots of black pepper.']
},
{
  id: 's-chocolate-tea', name: 'Dark Chocolate & Mint Tea', meal: ['snack'], maxPortion: 1,
  effort: 'zero', minutes: 3, servings: 1, kcal: 95, protein: 1, carbs: 9, fat: 7, fiber: 2,
  tags: ['no-cook', 'evening', 'craving'],
  ingredients: [
    { n: 'Dark chocolate, 70%+', q: 2, u: 'squares', a: 'pantry' },
    { n: 'Mint or chamomile tea', q: 1, u: 'cup', a: 'pantry' }
  ],
  steps: [
    'Make the tea first, then eat the chocolate with it.',
    'Two squares. Then the kitchen is closed for the night.'
  ],
  note: 'A planned 95-calorie treat at 9pm prevents the unplanned 600-calorie one at 10pm. This is a tool, not a cheat.'
},

/* ── allergy-and-dislike cover ──────────────────────────────────────
   The bank above leans hard on nuts, olives, and dairy — which is honest
   Mediterranean cooking, but it means someone avoiding those can run out of
   no-cook options exactly when they need them most. These exist so every
   meal slot still has an answer on a brutal day, whatever you can't eat. */
{
  id: 'b-eggs-tomato-toast', name: 'Hard-Boiled Eggs with Tomato & Toast', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 400, protein: 22, carbs: 36, fat: 19, fiber: 6,
  tags: ['no-cook', 'prep-ahead', 'dairy-free', 'nut-free', 'high-protein'],
  ingredients: [
    { n: 'Eggs, hard-boiled ahead', q: 2, u: 'large', a: 'protein' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Tomato, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: [
    'Boil a half-dozen eggs on Sunday and this becomes a five-minute breakfast all week.',
    'Toast, tomato, sliced egg, olive oil, oregano, salt.'
  ],
  note: 'Six eggs boiled on the weekend covers three breakfasts. No dairy, no nuts, no cooking.'
},
{
  id: 'b-oats-orange', name: 'Fig & Orange Overnight Oats (dairy-free)', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 385, protein: 12, carbs: 58, fat: 11, fiber: 10,
  tags: ['no-cook', 'prep-ahead', 'dairy-free', 'nut-free', 'portable', 'high-fiber'],
  ingredients: [
    { n: 'Rolled oats', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Oat milk, unsweetened', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Dried figs, chopped', q: 2, u: 'whole', a: 'pantry' },
    { n: 'Orange, segmented', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Chia seeds', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Ground cinnamon', q: 0.25, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Everything in a jar, stir, refrigerate overnight.',
    'Eat cold. Add the orange in the morning so it stays bright.'
  ]
},
{
  id: 'l-egg-salad-pita', name: 'Egg & Herb Salad in Pita', meal: ['lunch'],
  effort: 'zero', minutes: 8, servings: 1, kcal: 450, protein: 28, carbs: 40, fat: 19, fiber: 7,
  tags: ['no-cook', 'portable', 'nut-free', 'high-protein'],
  ingredients: [
    { n: 'Eggs, hard-boiled', q: 3, u: 'large', a: 'protein' },
    { n: 'Plain Greek yogurt, 2%', q: 3, u: 'tbsp', a: 'dairy' },
    { n: 'Dijon mustard', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Fresh dill & parsley, chopped', q: 3, u: 'tbsp', a: 'produce' },
    { n: 'Celery, diced', q: 1, u: 'stalk', a: 'produce' },
    { n: 'Whole-wheat pita', q: 1, u: 'whole', a: 'bakery' },
    { n: 'Romaine, shredded', q: 1, u: 'cup', a: 'produce' },
    { n: 'Lemon juice', q: 2, u: 'tsp', a: 'produce' }
  ],
  steps: [
    'Roughly chop the eggs — chunks, not paste.',
    'Fold through yogurt, mustard, herbs, celery, lemon.',
    'Stuff the pita with lettuce first so it does not go soggy.'
  ]
},
{
  id: 'd-chickpea-feta-bowl', name: 'Chickpea, Cucumber & Feta Bowl', meal: ['dinner', 'lunch'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 465, protein: 21, carbs: 42, fat: 25, fiber: 11,
  tags: ['no-cook', 'exhausted', 'vegetarian', 'nut-free', 'pantry-only'],
  ingredients: [
    { n: 'Chickpeas, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Cucumber, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes, halved', q: 1, u: 'cup', a: 'produce' },
    { n: 'Feta cheese', q: 1.5, u: 'oz', a: 'dairy' },
    { n: 'Red onion, minced', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Dried oregano', q: 0.5, u: 'tsp', a: 'pantry' },
    { n: 'Fresh parsley', q: 3, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Everything in a bowl.',
    'Oil, lemon, oregano, salt, a lot of black pepper. Toss.',
    'Better after five minutes sitting, if you can wait.'
  ]
},
{
  id: 'd-mackerel-plate', name: 'Smoked Mackerel, Beet & Yogurt Plate', meal: ['dinner', 'lunch'],
  effort: 'zero', minutes: 7, servings: 1, kcal: 490, protein: 34, carbs: 30, fat: 27, fiber: 6,
  tags: ['no-cook', 'exhausted', 'omega-3', 'high-protein', 'nut-free'],
  ingredients: [
    { n: 'Smoked mackerel fillet', q: 4, u: 'oz', a: 'protein' },
    { n: 'Cooked beets, sliced', q: 1, u: 'cup', a: 'produce' },
    { n: 'Plain Greek yogurt, 2%', q: 0.5, u: 'cup', a: 'dairy' },
    { n: 'Fresh dill', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Lemon', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Whole-grain bread', q: 1, u: 'slice', a: 'bakery' },
    { n: 'Baby spinach', q: 2, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Flake the mackerel onto a plate, skin discarded.',
    'Beets and spinach alongside, yogurt spooned over, dill and lemon.',
    'One slice of bread. Nothing is cooked and it still looks like a dinner.'
  ]
},
{
  id: 'd-tuna-pepper-bowl', name: 'Tuna, Butter Bean & Roasted Pepper Bowl', meal: ['dinner', 'lunch'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 425, protein: 35, carbs: 34, fat: 16, fiber: 10,
  tags: ['no-cook', 'exhausted', 'pantry-only', 'high-protein', 'nut-free', 'dairy-free'],
  ingredients: [
    { n: 'Canned tuna in olive oil', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'Butter beans, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Roasted red peppers, sliced', q: 0.75, u: 'cup', a: 'pantry' },
    { n: 'Red onion, thin sliced', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Extra-virgin olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Fresh parsley', q: 3, u: 'tbsp', a: 'produce' },
    { n: 'Baby spinach', q: 2, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Three cans and a bag of spinach. Tip it all into a bowl.',
    'Oil, lemon, parsley, black pepper. Stir once.'
  ]
},
{
  id: 's-pear-seeds', name: 'Pear with Pumpkin Seeds', meal: ['snack'],
  effort: 'zero', minutes: 2, servings: 1, kcal: 185, protein: 7, carbs: 26, fat: 8, fiber: 6,
  tags: ['no-cook', 'portable', 'nut-free', 'dairy-free'],
  ingredients: [
    { n: 'Pear', q: 1, u: 'medium', a: 'produce' },
    { n: 'Pumpkin seeds', q: 2, u: 'tbsp', a: 'pantry' }
  ],
  steps: ['Seeds are the answer when nuts are off the table — same job, different allergen.']
}
];

export const BY_ID = Object.fromEntries(RECIPES.map(r => [r.id, r]));

export const EFFORT_LABEL = {
  zero: 'No cook',
  quick: 'Quick',
  standard: 'Cook',
  project: 'Batch cook'
};

export const EFFORT_RANK = { zero: 0, quick: 1, standard: 2, project: 3 };

/** Compact index for the AI system prompt — keeps token cost low. */
export function recipeIndex() {
  return RECIPES.map(r =>
    `${r.id} | ${r.name} | ${r.meal.join('/')} | ${r.effort} | ${r.minutes}m | ${r.kcal}kcal | P${r.protein}g${r.batch ? ' | BATCH x' + r.servings : ''}`
  ).join('\n');
}
