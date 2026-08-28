/* The recipe bank.

   Rules this file follows, deliberately:
   1. PLAIN ENGLISH NAMES. A recipe is named after what is on the plate. No
      foreign culinary words. If you can't tell what it is from the name, the
      name is wrong.
   2. ORDINARY INGREDIENTS. Everything here is in a normal supermarket, on a
      normal aisle, under the name written. Nothing needs a special trip.
   3. BUILT ON chicken, tuna, eggs, salads and vegetables — because that is
      what actually gets eaten.

   It is still a Mediterranean pattern: olive oil as the main fat, vegetables
   at the centre, fish and chicken often, red meat rarely. That pattern is what
   drives the result. The unfamiliar vocabulary never did.

   effort tiers: zero (no cook), quick (<=20m), standard (<=40m), project (batch)
   Nutrition is per serving and is a good-faith estimate, not lab-measured.
   aisles: produce | protein | dairy | pantry | bakery | frozen | other        */

export const AISLES = ['produce', 'protein', 'dairy', 'pantry', 'bakery', 'frozen', 'other'];

export const RECIPES = [
/* ─────────────────────────── BREAKFAST ─────────────────────────── */
{
  id: 'b-yogurt-berries', name: 'Greek Yogurt with Berries and Honey', meal: ['breakfast'],
  effort: 'zero', minutes: 4, servings: 1, kcal: 330, protein: 26, carbs: 34, fat: 10, fiber: 5,
  tags: ['no-cook', 'high-protein', 'portable'],
  ingredients: [
    { n: 'Plain Greek yogurt, 2%', q: 1, u: 'cup', a: 'dairy' },
    { n: 'Berries, fresh or frozen', q: 0.75, u: 'cup', a: 'produce' },
    { n: 'Honey', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Sliced almonds', q: 1, u: 'tbsp', a: 'pantry' }
  ],
  steps: [
    'Yogurt in a bowl.',
    'Berries and almonds on top, honey over it.'
  ],
  note: '26g of protein in four minutes. This is the breakfast that stops you raiding the kitchen at 10am.'
},
{
  id: 'b-scrambled-eggs', name: 'Scrambled Eggs with Tomato and Spinach', meal: ['breakfast'],
  effort: 'quick', minutes: 10, servings: 1, kcal: 360, protein: 28, carbs: 22, fat: 18, fiber: 4,
  tags: ['high-protein'],
  ingredients: [
    { n: 'Eggs', q: 3, u: 'large', a: 'protein' },
    { n: 'Baby spinach', q: 1, u: 'cup', a: 'produce' },
    { n: 'Tomato, chopped', q: 1, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Whole-grain bread', q: 1, u: 'slice', a: 'bakery' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Warm the oil in a nonstick pan over medium heat.',
    'Tomato in first, 2 minutes. Then the spinach until it wilts, about 30 seconds.',
    'Beaten eggs in. Stir slowly and take them off while they still look slightly wet — they finish cooking in the pan.',
    'Toast on the side.'
  ]
},
{
  id: 'b-boiled-eggs-toast', name: 'Hard-Boiled Eggs with Toast and Peppers', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 400, protein: 22, carbs: 36, fat: 19, fiber: 6,
  tags: ['no-cook', 'prep-ahead', 'high-protein'],
  ingredients: [
    { n: 'Eggs, boiled ahead of time', q: 2, u: 'large', a: 'protein' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Roasted red peppers, sliced', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Boil half a dozen eggs on a Sunday and this becomes a five-minute breakfast all week.',
    'Toast, peppers straight from the jar, sliced egg, olive oil, salt, pepper.'
  ],
  note: 'Six eggs boiled at the weekend covers three breakfasts with no cooking at all.'
},
{
  id: 'b-overnight-oats', name: 'Overnight Oats with Berries', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 345, protein: 16, carbs: 55, fat: 7, fiber: 8,
  tags: ['no-cook', 'prep-ahead', 'portable'],
  ingredients: [
    { n: 'Rolled oats', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Milk', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Plain Greek yogurt, 2%', q: 0.25, u: 'cup', a: 'dairy' },
    { n: 'Berries, fresh or frozen', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Honey', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Everything in a jar or a bowl. Stir.',
    'Cover it, refrigerate overnight.',
    'Eat it cold in the morning. That is the whole recipe.'
  ],
  note: 'Make two at once. The second costs you ninety extra seconds and buys back a weekday morning.'
},
{
  id: 'b-avocado-egg-toast', name: 'Avocado and Egg Toast', meal: ['breakfast'],
  effort: 'quick', minutes: 8, servings: 1, kcal: 420, protein: 22, carbs: 36, fat: 22, fiber: 9,
  tags: ['high-protein'],
  ingredients: [
    { n: 'Eggs', q: 2, u: 'large', a: 'protein' },
    { n: 'Avocado', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Lemon juice', q: 1, u: 'tsp', a: 'produce' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Fry or poach the eggs however you like them.',
    'Mash the avocado onto the toast with the lemon, salt and pepper.',
    'Eggs on top.'
  ]
},
{
  id: 'b-egg-muffins', name: 'Egg and Vegetable Muffins', meal: ['breakfast'],
  effort: 'project', minutes: 45, servings: 4, batch: true, kcal: 285, protein: 23, carbs: 8, fat: 18, fiber: 2,
  prep: {
    kind: 'cook', makes: 4, activeMin: 15, keepsDays: 5,
    keeps: '5 days in the fridge.',
    freezes: true,
    containers: 'One tub. Three muffins is one breakfast.',
    reheat: '30 seconds in the microwave, or eat them cold in the car.',
    firstTimer: false
  },
  tags: ['batch', 'portable', 'high-protein', 'meal-prep'],
  ingredients: [
    { n: 'Eggs', q: 10, u: 'large', a: 'protein' },
    { n: 'Frozen chopped spinach, thawed', q: 10, u: 'oz', a: 'frozen' },
    { n: 'Bell pepper, chopped', q: 1, u: 'whole', a: 'produce' },
    { n: 'Shredded cheese', q: 4, u: 'oz', a: 'dairy' },
    { n: 'Olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Heat the oven to 350°F. Oil a 12-cup muffin tin well.',
    'Squeeze the spinach properly dry with your hands or a towel. Wet spinach makes soggy muffins.',
    'Beat the eggs, stir in the spinach, pepper, cheese, salt and pepper.',
    'Divide between the 12 cups. Bake 22–25 minutes until set and puffed.',
    'Cool, then refrigerate up to 5 days. Three muffins is one breakfast.'
  ],
  note: 'Your insurance policy against a 12-hour day. Grab three and eat them cold in the car.'
},
/* ───────────────────────────── LUNCH ───────────────────────────── */
{
  id: 'l-big-chicken-salad', name: 'Big Chicken Salad', meal: ['lunch'],
  effort: 'quick', minutes: 12, servings: 1, kcal: 450, protein: 42, carbs: 18, fat: 24, fiber: 6,
  tags: ['high-protein', 'no-cook', 'portable'],
  ingredients: [
    { n: 'Cooked chicken breast, sliced', q: 5, u: 'oz', a: 'protein' },
    { n: 'Romaine lettuce, chopped', q: 3, u: 'cups', a: 'produce' },
    { n: 'Cucumber, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Bell pepper, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Red onion, sliced thin', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Red wine vinegar', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Feta cheese', q: 1, u: 'oz', a: 'dairy' }
  ],
  steps: [
    'Everything into the biggest bowl you own.',
    'Oil, vinegar, salt, plenty of pepper. Toss it properly — dressing sitting at the bottom is wasted.',
    'Feta over the top.'
  ],
  note: 'Pack the dressing separately if this is going to work with you.'
},
{
  id: 'l-tuna-plate', name: 'Tuna Salad Plate', meal: ['lunch'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 420, protein: 36, carbs: 28, fat: 18, fiber: 6,
  tags: ['no-cook', 'pantry-only', 'high-protein', 'portable'],
  ingredients: [
    { n: 'Canned tuna, drained', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'Plain Greek yogurt, 2%', q: 2, u: 'tbsp', a: 'dairy' },
    { n: 'Celery, diced', q: 1, u: 'stalk', a: 'produce' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Romaine lettuce', q: 2, u: 'cups', a: 'produce' },
    { n: 'Bell pepper, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Whole-grain bread', q: 1, u: 'slice', a: 'bakery' }
  ],
  steps: [
    'Mix the tuna with the yogurt, celery, lemon, salt and pepper.',
    'Serve on the lettuce with the pepper strips and a slice of bread.'
  ],
  note: 'Greek yogurt instead of mayonnaise saves about 130 calories, and you genuinely will not miss it here.'
},
{
  id: 'l-chicken-wrap', name: 'Chicken and Salad Wrap', meal: ['lunch'],
  effort: 'quick', minutes: 10, servings: 1, kcal: 470, protein: 37, carbs: 42, fat: 17, fiber: 9,
  tags: ['high-protein', 'portable'],
  ingredients: [
    { n: 'Whole-wheat tortilla, large', q: 1, u: 'whole', a: 'bakery' },
    { n: 'Cooked chicken breast, sliced', q: 4, u: 'oz', a: 'protein' },
    { n: 'Hummus', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Cucumber, sliced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Bell pepper, sliced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Baby spinach', q: 1, u: 'cup', a: 'produce' }
  ],
  steps: [
    'Spread the hummus right to the edges — it is both the glue and the sauce.',
    'Layer the spinach, chicken, cucumber and pepper.',
    'Roll it tight and cut it on the diagonal.'
  ]
},
{
  id: 'l-tuna-sandwich', name: 'Tuna Salad Sandwich', meal: ['lunch'],
  effort: 'zero', minutes: 7, servings: 1, kcal: 440, protein: 34, carbs: 40, fat: 16, fiber: 7,
  tags: ['no-cook', 'pantry-only', 'high-protein', 'portable'],
  ingredients: [
    { n: 'Canned tuna, drained', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'Plain Greek yogurt, 2%', q: 2, u: 'tbsp', a: 'dairy' },
    { n: 'Celery, diced', q: 1, u: 'stalk', a: 'produce' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Romaine lettuce', q: 2, u: 'leaves', a: 'produce' },
    { n: 'Cucumber, sliced', q: 0.5, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Mix the tuna, yogurt, celery, salt and pepper.',
    'Onto the bread with the lettuce and cucumber.'
  ]
},
{
  id: 'l-chopped-chicken', name: 'Chopped Salad with Rotisserie Chicken', meal: ['lunch'],
  effort: 'quick', minutes: 10, servings: 1, kcal: 445, protein: 39, carbs: 26, fat: 22, fiber: 9,
  tags: ['high-protein', 'no-cook'],
  ingredients: [
    { n: 'Rotisserie chicken, pulled', q: 5, u: 'oz', a: 'protein' },
    { n: 'Romaine lettuce, chopped', q: 3, u: 'cups', a: 'produce' },
    { n: 'Cucumber, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Bell pepper, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'White beans, rinsed', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Feta cheese', q: 1, u: 'oz', a: 'dairy' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Red wine vinegar', q: 2, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Chop everything to roughly the same size. It genuinely eats better that way.',
    'Dress it, toss it, feta on top.'
  ]
},
{
  id: 'l-chicken-rice-bowl', name: 'Chicken and Rice Bowl', meal: ['lunch', 'dinner'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 450, protein: 35, carbs: 48, fat: 12, fiber: 6,
  tags: ['no-cook', 'leftovers', 'high-protein'],
  ingredients: [
    { n: 'Cooked chicken, chopped', q: 4, u: 'oz', a: 'protein' },
    { n: 'Cooked brown rice', q: 0.75, u: 'cup', a: 'pantry' },
    { n: 'Cucumber, diced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Roasted red peppers, chopped', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Rice on the bottom, chicken and vegetables on top.',
    'Olive oil, lemon, salt, pepper. Toss.'
  ],
  note: 'This slot exists to absorb last night\'s leftovers. Swap in whatever protein is actually in your fridge.'
},
{
  id: 'l-cucumber-pepper-chicken', name: 'Cucumber, Pepper and Chicken Salad', meal: ['lunch'],
  effort: 'quick', minutes: 12, servings: 1, kcal: 460, protein: 38, carbs: 22, fat: 26, fiber: 7,
  tags: ['high-protein', 'no-cook', 'low-carb'],
  ingredients: [
    { n: 'Cooked chicken breast, sliced', q: 5, u: 'oz', a: 'protein' },
    { n: 'Cucumber, chunked', q: 1, u: 'whole', a: 'produce' },
    { n: 'Bell peppers, chunked', q: 2, u: 'whole', a: 'produce' },
    { n: 'Red onion, sliced thin', q: 0.25, u: 'whole', a: 'produce' },
    { n: 'Feta cheese', q: 1.5, u: 'oz', a: 'dairy' },
    { n: 'Olives', q: 8, u: 'whole', a: 'pantry' },
    { n: 'Olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Dried oregano', q: 0.5, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Big chunks, not fine chopping. This one is better rough.',
    'Oil, oregano, salt, pepper.',
    'Feta on top in slabs rather than crumbs.'
  ]
},
{
  id: 'l-chicken-veg-soup', name: 'Chicken and Vegetable Soup', meal: ['lunch', 'dinner'],
  effort: 'project', minutes: 45, servings: 5, batch: true, kcal: 380, protein: 32, carbs: 34, fat: 12, fiber: 6,
  prep: {
    kind: 'cook', makes: 5, activeMin: 20, keepsDays: 4,
    keeps: '4 days in the fridge.',
    freezes: true,
    containers: '5 lidded tubs, or 3 tubs and 2 freezer bags.',
    reheat: '3 minutes in the microwave, or 6 in a pan.',
    firstTimer: false
  },
  tags: ['batch', 'meal-prep', 'high-protein', 'freezes'],
  ingredients: [
    { n: 'Chicken breast or thighs', q: 1.5, u: 'lb', a: 'protein' },
    { n: 'Chicken broth, low sodium', q: 8, u: 'cups', a: 'pantry' },
    { n: 'Carrots, sliced', q: 3, u: 'whole', a: 'produce' },
    { n: 'Celery, sliced', q: 3, u: 'stalks', a: 'produce' },
    { n: 'Onion, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Small pasta or rice', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Baby spinach', q: 4, u: 'cups', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Soften the onion, carrot and celery in the oil for 8 minutes. Garlic for 1 more.',
    'Add the broth and the whole chicken pieces. Simmer 18 minutes until cooked through.',
    'Lift the chicken out, shred it with two forks, put it back in.',
    'Add the pasta or rice, cook 8 minutes. Stir in the spinach until it wilts.',
    'Squeeze the lemon in at the end. It lifts the whole pot.',
    'Five portions. Divide into containers while it is still warm, or you will not do it.'
  ],
  note: 'The most useful thing in this app. Five lunches from one pot, and it freezes.'
},
{
  id: 'l-egg-salad-sandwich', name: 'Egg Salad Sandwich', meal: ['lunch'],
  effort: 'zero', minutes: 8, servings: 1, kcal: 430, protein: 26, carbs: 38, fat: 20, fiber: 6,
  tags: ['no-cook', 'prep-ahead', 'portable'],
  ingredients: [
    { n: 'Eggs, boiled ahead of time', q: 3, u: 'large', a: 'protein' },
    { n: 'Plain Greek yogurt, 2%', q: 3, u: 'tbsp', a: 'dairy' },
    { n: 'Celery, diced', q: 1, u: 'stalk', a: 'produce' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Romaine lettuce', q: 2, u: 'leaves', a: 'produce' },
    { n: 'Mustard', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Chop the eggs roughly. Chunks, not paste.',
    'Fold in the yogurt, mustard, celery, salt and pepper.',
    'Onto the bread with the lettuce.'
  ]
},
{
  id: 'l-tuna-bean-salad', name: 'Tuna and White Bean Salad', meal: ['lunch'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 425, protein: 34, carbs: 34, fat: 16, fiber: 11,
  tags: ['no-cook', 'pantry-only', 'high-protein', 'high-fiber'],
  ingredients: [
    { n: 'Canned tuna, drained', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'White beans, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Red onion, minced', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Lemon juice', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Baby spinach', q: 2, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Fold it together gently so the beans stay whole.',
    'Let it sit five minutes if you can. It improves.',
    'Serve over the spinach.'
  ],
  note: 'Two cans and a bag of spinach. Keep these stocked and you are never stuck.'
},

/* ───────────────────────────── DINNER ──────────────────────────── */
{
  id: 'd-chicken-thighs-peppers', name: 'Chicken Thighs with Peppers and Potatoes', meal: ['dinner'],
  effort: 'project', minutes: 50, servings: 4, batch: true, kcal: 515, protein: 42, carbs: 30, fat: 26, fiber: 6,
  prep: {
    kind: 'cook', makes: 4, activeMin: 15, keepsDays: 4,
    keeps: '4 days in the fridge.',
    freezes: true,
    containers: '4 lidded boxes, or 2 if you are eating two portions tonight.',
    reheat: '3 minutes in the microwave.',
    firstTimer: false
  },
  tags: ['batch', 'one-pan', 'high-protein', 'meal-prep'],
  ingredients: [
    { n: 'Chicken thighs, boneless skinless', q: 2, u: 'lb', a: 'protein' },
    { n: 'Bell peppers, sliced', q: 3, u: 'whole', a: 'produce' },
    { n: 'Red onions, wedged', q: 2, u: 'whole', a: 'produce' },
    { n: 'Baby potatoes, halved', q: 1, u: 'lb', a: 'produce' },
    { n: 'Olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 5, u: 'cloves', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tbsp', a: 'pantry' }
  ],
  steps: [
    'Heat the oven to 425°F. Toss the chicken with the oil, juice of one lemon, garlic and oregano.',
    'Spread the potatoes and onions on a sheet pan, roast 15 minutes on their own.',
    'Add the peppers, lay the chicken on top, roast 25 minutes more.',
    'Squeeze the second lemon over the hot tray.',
    'Two portions tonight. The other two go straight into containers — do it now, not later.'
  ],
  note: 'The engine of your week. Cook this on your lightest day and three hard days take care of themselves.'
},
{
  id: 'd-roast-chicken-veg', name: 'Roast Chicken and Vegetables', meal: ['dinner'],
  effort: 'project', minutes: 55, servings: 4, batch: true, kcal: 485, protein: 43, carbs: 28, fat: 23, fiber: 7,
  prep: {
    kind: 'cook', makes: 4, activeMin: 20, keepsDays: 4,
    keeps: '4 days in the fridge.',
    freezes: true,
    containers: '4 lidded boxes.',
    reheat: '3 minutes in the microwave. The vegetables soften; that is normal.',
    firstTimer: false
  },
  tags: ['batch', 'one-pan', 'high-protein', 'meal-prep'],
  ingredients: [
    { n: 'Chicken thighs, bone-in', q: 8, u: 'whole', a: 'protein' },
    { n: 'Carrots, chunked', q: 4, u: 'whole', a: 'produce' },
    { n: 'Broccoli florets', q: 4, u: 'cups', a: 'produce' },
    { n: 'Baby potatoes, halved', q: 1, u: 'lb', a: 'produce' },
    { n: 'Onion, wedged', q: 1, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, smashed', q: 5, u: 'cloves', a: 'produce' },
    { n: 'Dried oregano', q: 2, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Oven to 425°F. Toss the potatoes, carrots and onion with 2 tbsp oil, salt and oregano.',
    'Rub the chicken with the rest of the oil, salt and pepper. Sit it skin-side up on the vegetables.',
    'Roast 35 minutes. Add the broccoli, roast 12 more until the skin is crisp.',
    'Two portions tonight, two into the fridge.'
  ]
},
{
  id: 'd-grilled-chicken-salad', name: 'Grilled Chicken with a Big Salad', meal: ['dinner'],
  effort: 'standard', minutes: 25, servings: 2, kcal: 460, protein: 44, carbs: 18, fat: 24, fiber: 6,
  tags: ['high-protein', 'low-carb'],
  ingredients: [
    { n: 'Chicken breasts', q: 1, u: 'lb', a: 'protein' },
    { n: 'Romaine lettuce, chopped', q: 6, u: 'cups', a: 'produce' },
    { n: 'Cucumber, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Bell peppers, sliced', q: 2, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Feta cheese', q: 2, u: 'oz', a: 'dairy' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Season the chicken with salt, pepper and oregano. Rub with a teaspoon of the oil.',
    'Grill or pan-sear over medium-high, 6–7 minutes a side. Do not crowd the pan or you are steaming it.',
    'Let it rest 5 minutes before slicing. This matters more than people think.',
    'Dress the salad with the rest of the oil and the lemon. Sliced chicken on top.'
  ]
},
{
  id: 'd-lemon-chicken-rice', name: 'Lemon Chicken with Green Beans and Rice', meal: ['dinner'],
  effort: 'standard', minutes: 30, servings: 2, kcal: 520, protein: 45, carbs: 42, fat: 18, fiber: 6,
  tags: ['high-protein'],
  ingredients: [
    { n: 'Chicken breasts or thighs', q: 1, u: 'lb', a: 'protein' },
    { n: 'Green beans', q: 0.75, u: 'lb', a: 'produce' },
    { n: 'Brown rice, dry', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Lemons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Start the rice first — it takes the longest.',
    'Sear the chicken in 1 tbsp oil, 6 minutes a side, then add the garlic and the juice of one lemon to the pan.',
    'Steam or boil the green beans 4 minutes, then toss them with the rest of the oil.',
    'Second lemon over everything at the table.'
  ]
},
{
  id: 'd-baked-salmon', name: 'Baked Salmon with Asparagus and Potatoes', meal: ['dinner'],
  effort: 'standard', minutes: 30, servings: 2, kcal: 520, protein: 41, carbs: 32, fat: 25, fiber: 6,
  tags: ['one-pan', 'high-protein', 'omega-3'],
  ingredients: [
    { n: 'Salmon fillets', q: 2, u: 'x 5oz', a: 'protein' },
    { n: 'Asparagus, trimmed', q: 1, u: 'lb', a: 'produce' },
    { n: 'Baby potatoes, halved', q: 12, u: 'oz', a: 'produce' },
    { n: 'Lemon, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, minced', q: 3, u: 'cloves', a: 'produce' }
  ],
  steps: [
    'Oven to 425°F. Toss the potatoes in half the oil and roast 15 minutes on their own.',
    'Push them to one side. Add the salmon and asparagus, the rest of the oil, the garlic and the lemon slices.',
    'Roast 12–14 minutes until the salmon flakes when you push it with a fork.'
  ],
  note: 'Cook both fillets even if you are eating alone. Tomorrow\'s lunch just built itself.'
},
{
  id: 'd-baked-cod-tomatoes', name: 'Baked Cod with Tomatoes', meal: ['dinner'],
  effort: 'quick', minutes: 22, servings: 2, kcal: 400, protein: 39, carbs: 20, fat: 18, fiber: 5,
  tags: ['quick', 'high-protein', 'one-pan', 'low-carb'],
  ingredients: [
    { n: 'Cod fillets', q: 2, u: 'x 6oz', a: 'protein' },
    { n: 'Canned diced tomatoes', q: 1, u: 'can (14oz)', a: 'pantry' },
    { n: 'Garlic, sliced', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Olive oil', q: 1.5, u: 'tbsp', a: 'pantry' },
    { n: 'Baby spinach', q: 4, u: 'cups', a: 'produce' },
    { n: 'Olives', q: 0.33, u: 'cup', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Oven to 400°F. In an oven-safe pan, cook the garlic in the oil for 30 seconds.',
    'Add the tomatoes, olives and oregano. Simmer 6 minutes.',
    'Sit the cod in the sauce, spoon some over the top, bake 12 minutes until it turns opaque.',
    'Stir the spinach into the sauce at the end.'
  ]
},
{
  id: 'd-skillet-chicken-zucchini', name: 'Skillet Chicken with Zucchini and Tomatoes', meal: ['dinner'],
  effort: 'quick', minutes: 20, servings: 2, kcal: 440, protein: 40, carbs: 18, fat: 22, fiber: 5,
  tags: ['quick', 'high-protein', 'one-pan', 'low-carb'],
  ingredients: [
    { n: 'Chicken breast, cubed', q: 1, u: 'lb', a: 'protein' },
    { n: 'Zucchini, half-moons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes', q: 2, u: 'cups', a: 'produce' },
    { n: 'Garlic, sliced', q: 4, u: 'cloves', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Brown the zucchini in 1 tbsp oil over high heat, 5 minutes. Set it aside.',
    'Same pan, rest of the oil, chicken in a single layer. 4 minutes without touching it, then stir.',
    'Garlic for 30 seconds, then the tomatoes until they burst, about 3 minutes.',
    'Zucchini back in, lemon squeezed over, off the heat.'
  ]
},
{
  id: 'd-turkey-patties', name: 'Turkey Patties with Salad', meal: ['dinner'],
  effort: 'standard', minutes: 35, servings: 2, kcal: 460, protein: 38, carbs: 24, fat: 24, fiber: 6,
  tags: ['high-protein'],
  ingredients: [
    { n: 'Ground turkey, 93% lean', q: 1, u: 'lb', a: 'protein' },
    { n: 'Zucchini, grated', q: 1, u: 'whole', a: 'produce' },
    { n: 'Onion, grated', q: 0.25, u: 'whole', a: 'produce' },
    { n: 'Egg', q: 1, u: 'large', a: 'protein' },
    { n: 'Breadcrumbs', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Salad greens and cucumber', q: null, u: 'to serve', a: 'produce' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Squeeze the grated zucchini dry in a clean towel. Really dry — that is the whole trick.',
    'Mix everything, form 8 patties, rest them 10 minutes in the fridge so they hold together.',
    'Pan-fry in the oil over medium, 4 minutes a side.',
    'Serve on dressed greens with lemon.'
  ]
},
{
  id: 'd-chicken-broccoli-sweetpotato', name: 'Baked Chicken with Broccoli and Sweet Potato', meal: ['dinner'],
  effort: 'standard', minutes: 40, servings: 2, kcal: 495, protein: 43, carbs: 40, fat: 18, fiber: 8,
  tags: ['one-pan', 'high-protein'],
  ingredients: [
    { n: 'Chicken breasts or thighs', q: 1, u: 'lb', a: 'protein' },
    { n: 'Sweet potatoes, cubed', q: 2, u: 'whole', a: 'produce' },
    { n: 'Broccoli florets', q: 4, u: 'cups', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, minced', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Paprika', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Oven to 425°F. Sweet potato with half the oil and the paprika, roast 20 minutes.',
    'Add the chicken and broccoli with the rest of the oil and the garlic.',
    'Roast 18 minutes more until the chicken is cooked through.'
  ]
},
{
  id: 'd-shrimp-zucchini', name: 'Garlic Shrimp with Zucchini', meal: ['dinner'],
  effort: 'quick', minutes: 18, servings: 2, kcal: 420, protein: 37, carbs: 24, fat: 20, fiber: 5,
  tags: ['quick', 'high-protein'],
  ingredients: [
    { n: 'Shrimp, peeled', q: 1, u: 'lb', a: 'frozen' },
    { n: 'Zucchini, half-moons', q: 2, u: 'whole', a: 'produce' },
    { n: 'Cherry tomatoes', q: 2, u: 'cups', a: 'produce' },
    { n: 'Garlic, sliced', q: 5, u: 'cloves', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' }
  ],
  steps: [
    'Brown the zucchini in 1 tbsp oil over high heat, 5 minutes. Set aside.',
    'Rest of the oil, garlic for 30 seconds only — it burns fast.',
    'Shrimp in a single layer, 90 seconds a side. They are done the moment they curl and turn pink.',
    'Tomatoes for 2 minutes, zucchini back in, lemon over. Bread to mop the pan.'
  ],
  note: 'Frozen shrimp is fine here and much cheaper. Thaw it in a bowl of cold water for ten minutes.'
},
{
  id: 'd-chicken-salad-bowl', name: 'Chicken Salad Bowl with Yogurt Dressing', meal: ['dinner'],
  effort: 'quick', minutes: 15, servings: 1, kcal: 450, protein: 42, carbs: 16, fat: 24, fiber: 5,
  tags: ['quick', 'high-protein', 'low-carb'],
  ingredients: [
    { n: 'Cooked chicken breast, sliced', q: 5, u: 'oz', a: 'protein' },
    { n: 'Romaine lettuce, chopped', q: 3, u: 'cups', a: 'produce' },
    { n: 'Cucumber, diced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Plain Greek yogurt, 2%', q: 3, u: 'tbsp', a: 'dairy' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Garlic, minced', q: 1, u: 'clove', a: 'produce' },
    { n: 'Parmesan cheese, grated', q: 2, u: 'tbsp', a: 'dairy' }
  ],
  steps: [
    'Whisk the yogurt, oil, lemon, garlic, salt and pepper into a dressing.',
    'Toss with the lettuce and cucumber, chicken on top, parmesan over.'
  ],
  note: 'A Caesar you can actually eat on a diet. The yogurt does the work the mayonnaise used to.'
},
{
  id: 'd-egg-veg-skillet', name: 'Egg and Vegetable Skillet', meal: ['dinner', 'breakfast'],
  effort: 'quick', minutes: 18, servings: 2, kcal: 390, protein: 24, carbs: 22, fat: 23, fiber: 6,
  tags: ['quick', 'vegetarian', 'pantry-only'],
  ingredients: [
    { n: 'Eggs', q: 4, u: 'large', a: 'protein' },
    { n: 'Canned diced tomatoes', q: 1, u: 'can (14oz)', a: 'pantry' },
    { n: 'Bell pepper, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Onion, diced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Garlic, minced', q: 2, u: 'cloves', a: 'produce' },
    { n: 'Olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Paprika', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' }
  ],
  steps: [
    'Soften the onion and pepper in the oil, 6 minutes. Garlic and paprika for 1 more.',
    'Tomatoes in, simmer 8 minutes until thickened.',
    'Make four wells, crack in the eggs, cover the pan and cook 5 minutes for runny yolks.',
    'Bread on the side.'
  ],
  note: 'Eggs for dinner is a perfectly good answer on a Wednesday. Cheap, fast, 24g of protein.'
},
{
  id: 'd-chicken-potato-plate', name: 'Chicken, Potato and Green Bean Plate', meal: ['dinner'],
  effort: 'zero', minutes: 8, servings: 1, kcal: 460, protein: 40, carbs: 36, fat: 16, fiber: 7,
  tags: ['no-cook', 'exhausted', 'high-protein', 'leftovers'],
  ingredients: [
    { n: 'Rotisserie chicken, skin removed', q: 5, u: 'oz', a: 'protein' },
    { n: 'Baby potatoes, cooked', q: 6, u: 'small', a: 'produce' },
    { n: 'Green beans, frozen', q: 1.5, u: 'cups', a: 'frozen' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Microwave the potatoes and green beans for 3 minutes.',
    'Pull the chicken off the bird with your hands.',
    'Olive oil, lemon, salt, pepper over everything.'
  ],
  note: 'Nothing here is really cooked and it is still a proper dinner. This is what a hard day looks like.'
},
{
  id: 'd-rescue-chicken', name: 'Rotisserie Chicken Rescue Dinner', meal: ['dinner'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 470, protein: 43, carbs: 22, fat: 24, fiber: 7,
  tags: ['no-cook', 'exhausted', 'high-protein'],
  ingredients: [
    { n: 'Rotisserie chicken, skin removed', q: 6, u: 'oz', a: 'protein' },
    { n: 'Bagged salad mix', q: 3, u: 'cups', a: 'produce' },
    { n: 'Cucumber, chunked', q: 1, u: 'whole', a: 'produce' },
    { n: 'White beans, rinsed', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Olive oil', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon juice or vinegar', q: 1, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Tear the chicken off the bird with your hands.',
    'Everything into the biggest bowl you own.',
    'Oil, lemon, salt, pepper. Toss. Six minutes, door to plate.'
  ],
  note: 'Buy the bird on the way home on your longest day. That one decision is worth more than any recipe here.'
},
{
  id: 'd-tuna-bean-bowl', name: 'Tuna and White Bean Bowl', meal: ['dinner', 'lunch'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 425, protein: 35, carbs: 34, fat: 16, fiber: 10,
  tags: ['no-cook', 'exhausted', 'pantry-only', 'high-protein'],
  ingredients: [
    { n: 'Canned tuna, drained', q: 1, u: 'can (5oz)', a: 'pantry' },
    { n: 'White beans, rinsed', q: 1, u: 'cup', a: 'pantry' },
    { n: 'Roasted red peppers, sliced', q: 0.75, u: 'cup', a: 'pantry' },
    { n: 'Red onion, sliced thin', q: 2, u: 'tbsp', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Lemon juice', q: 1, u: 'tbsp', a: 'produce' },
    { n: 'Baby spinach', q: 2, u: 'cups', a: 'produce' }
  ],
  steps: [
    'Open three cans. Tip them into a bowl.',
    'Oil, lemon, salt, plenty of pepper. Stir once.'
  ],
  note: 'Keep these cans permanently stocked. This is the meal that stops a bad night becoming a bad week.'
},

{
  id: 's-cottage-fruit', name: 'Cottage Cheese with Fruit', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 3, servings: 1, kcal: 220, protein: 21, carbs: 20, fat: 6, fiber: 3,
  tags: ['no-cook', 'high-protein'],
  ingredients: [
    { n: 'Low-fat cottage cheese', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Berries or canned peaches, drained', q: 0.5, u: 'cup', a: 'produce' },
    { n: 'Ground cinnamon', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: ['Fruit over the cottage cheese, cinnamon on top.'],
  note: 'Buy the small tub. Cottage cheese turns fast, and a big one usually ends up thrown out.'
},
{
  id: 'd-pork-chops', name: 'Pork Chops with Green Beans and Potatoes', meal: ['dinner'],
  effort: 'standard', minutes: 30, servings: 2, kcal: 520, protein: 44, carbs: 34, fat: 22, fiber: 6,
  tags: ['high-protein'],
  ingredients: [
    { n: 'Pork chops, bone-in', q: 2, u: 'x 6oz', a: 'protein' },
    { n: 'Baby potatoes, halved', q: 12, u: 'oz', a: 'produce' },
    { n: 'Green beans', q: 0.75, u: 'lb', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, smashed', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Roast the potatoes at 425F with half the oil and the garlic, 25 minutes.',
    'Pat the chops dry and salt them well. Sear in the rest of the oil over medium-high, 4 minutes a side.',
    'Rest the chops 5 minutes before cutting. They keep cooking while they rest.',
    'Steam or boil the green beans 4 minutes. Lemon and oregano over everything.'
  ],
  note: 'Pat them dry and leave them alone in the pan. That is the whole difference between a good chop and a grey one.'
},
{
  id: 'l-chicken-bean-bowl', name: 'Chicken and Refried Bean Bowl', meal: ['lunch', 'dinner'],
  effort: 'zero', minutes: 6, servings: 1, kcal: 470, protein: 40, carbs: 40, fat: 16, fiber: 9,
  tags: ['no-cook', 'exhausted', 'high-protein', 'pantry-only'],
  ingredients: [
    { n: 'Rotisserie chicken, pulled', q: 5, u: 'oz', a: 'protein' },
    { n: 'Refried beans', q: 0.5, u: 'cup', a: 'pantry' },
    { n: 'Romaine lettuce, shredded', q: 2, u: 'cups', a: 'produce' },
    { n: 'Shredded cheese', q: 1, u: 'oz', a: 'dairy' },
    { n: 'Bell pepper, diced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Lime or lemon juice', q: 1, u: 'tbsp', a: 'produce' }
  ],
  steps: [
    'Warm the beans in the microwave, 60 seconds.',
    'Beans on the bottom, chicken on top, then lettuce, pepper and cheese.',
    'Squeeze of lime. Six minutes, nothing cooked.'
  ],
  note: 'A tin of refried beans and a rotisserie chicken is one of the cheapest high-protein dinners there is.'
},
{
  id: 'd-refried-beans-eggs', name: 'Refried Beans with Eggs and Peppers', meal: ['dinner', 'breakfast'],
  effort: 'quick', minutes: 12, servings: 1, kcal: 450, protein: 25, carbs: 42, fat: 20, fiber: 10,
  tags: ['quick', 'vegetarian', 'pantry-only', 'high-fiber'],
  ingredients: [
    { n: 'Refried beans', q: 0.75, u: 'cup', a: 'pantry' },
    { n: 'Eggs', q: 2, u: 'large', a: 'protein' },
    { n: 'Bell pepper, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Shredded cheese', q: 0.75, u: 'oz', a: 'dairy' },
    { n: 'Whole-wheat tortilla', q: 1, u: 'whole', a: 'bakery' }
  ],
  steps: [
    'Soften the pepper in the oil, 5 minutes.',
    'Warm the beans in a small pan or the microwave.',
    'Fry the eggs in the same pan as the peppers.',
    'Beans on the tortilla, peppers and eggs on top, cheese over.'
  ]
},
{
  id: 'd-rotisserie-roast-veg', name: 'Rotisserie Chicken with Roasted Vegetables', meal: ['dinner'],
  effort: 'quick', minutes: 18, servings: 2, kcal: 480, protein: 44, carbs: 30, fat: 20, fiber: 8,
  tags: ['quick', 'high-protein', 'one-pan'],
  ingredients: [
    { n: 'Rotisserie chicken, skin removed', q: 10, u: 'oz', a: 'protein' },
    { n: 'Frozen mixed vegetables', q: 4, u: 'cups', a: 'frozen' },
    { n: 'Baby potatoes, halved', q: 12, u: 'oz', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Garlic, minced', q: 3, u: 'cloves', a: 'produce' },
    { n: 'Dried oregano', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Oven to 425F. Potatoes with the oil, garlic and oregano, roast 25 minutes.',
    'Add the frozen vegetables straight from the bag for the last 8 minutes.',
    'Carve the chicken off the bird while it roasts. Warm it through on top for the final 3 minutes.'
  ],
  note: 'The bird does the protein, the oven does the rest. Almost no active work.'
},

/* ───────────────────────────── SNACKS ──────────────────────────── */
{
  id: 's-apple-almonds', name: 'Apple with Almonds', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 2, servings: 1, kcal: 200, protein: 6, carbs: 26, fat: 10, fiber: 6,
  tags: ['no-cook', 'portable'],
  ingredients: [
    { n: 'Apple', q: 1, u: 'medium', a: 'produce' },
    { n: 'Almonds', q: 15, u: 'whole', a: 'pantry' }
  ],
  steps: ['Count the almonds out. Do not eat them from the bag — that is how 200 calories becomes 600.']
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
  note: '18g of protein for 155 calories is the best ratio in this whole app.'
},
{
  id: 's-carrots-hummus', name: 'Carrots and Hummus', meal: ['snack'],
  effort: 'zero', minutes: 3, servings: 1, kcal: 180, protein: 6, carbs: 22, fat: 8, fiber: 6,
  tags: ['no-cook', 'portable', 'vegetarian'],
  ingredients: [
    { n: 'Baby carrots', q: 1.5, u: 'cups', a: 'produce' },
    { n: 'Hummus', q: 0.25, u: 'cup', a: 'pantry' }
  ],
  steps: ['Buy the carrots pre-cut. The five minutes you save is the difference between eating this and not.']
},
{
  id: 's-cheese-grapes', name: 'Cheese and Grapes', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 2, servings: 1, kcal: 190, protein: 11, carbs: 18, fat: 9, fiber: 1,
  tags: ['no-cook', 'portable'],
  ingredients: [
    { n: 'Cheddar cheese', q: 1, u: 'oz', a: 'dairy' },
    { n: 'Grapes', q: 1, u: 'cup', a: 'produce' }
  ],
  steps: ['Both live in the fridge door. That is the point.']
},
{
  id: 's-banana-peanut-butter', name: 'Banana with Peanut Butter', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 2, servings: 1, kcal: 210, protein: 7, carbs: 28, fat: 9, fiber: 4,
  tags: ['no-cook', 'portable'],
  ingredients: [
    { n: 'Banana', q: 1, u: 'medium', a: 'produce' },
    { n: 'Peanut butter', q: 1, u: 'tbsp', a: 'pantry' }
  ],
  steps: ['One level tablespoon, measured. Peanut butter is the easiest thing in the kitchen to over-serve.']
},
{
  id: 's-orange-almonds', name: 'Orange and Almonds', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 2, servings: 1, kcal: 175, protein: 5, carbs: 22, fat: 9, fiber: 5,
  tags: ['no-cook', 'portable'],
  ingredients: [
    { n: 'Orange', q: 1, u: 'large', a: 'produce' },
    { n: 'Almonds', q: 12, u: 'whole', a: 'pantry' }
  ],
  steps: ['Keep both in your bag. This is the 4pm answer.']
},
{
  id: 's-hard-boiled-egg', name: 'Hard-Boiled Eggs', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 1, servings: 1, kcal: 160, protein: 13, carbs: 2, fat: 11, fiber: 0,
  tags: ['no-cook', 'portable', 'high-protein', 'prep-ahead'],
  ingredients: [
    { n: 'Eggs, boiled ahead of time', q: 2, u: 'large', a: 'protein' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: ['The reason you boiled a half-dozen on Sunday.']
},
{
  id: 's-chocolate-tea', name: 'Dark Chocolate and Tea', meal: ['snack'], maxPortion: 1,
  effort: 'zero', minutes: 3, servings: 1, kcal: 95, protein: 1, carbs: 9, fat: 7, fiber: 2,
  tags: ['no-cook', 'evening', 'craving'],
  ingredients: [
    { n: 'Dark chocolate, 70%', q: 2, u: 'squares', a: 'pantry' },
    { n: 'Tea', q: 1, u: 'cup', a: 'pantry' }
  ],
  steps: [
    'Make the tea first, then eat the chocolate with it.',
    'Two squares. Then the kitchen is closed for the night.'
  ],
  note: 'A planned 95-calorie treat at 9pm prevents the unplanned 600-calorie one at 10pm. This is a tool, not a cheat.'
},

/* ─────────────────── THINGS YOU MAKE AHEAD ──────────────────────

   Everything below is written to be made once and eaten several times.
   Each carries a `prep` block, which is the part a first-timer actually
   needs: how many it makes, how long it survives in the fridge, what to
   put it in, and how to bring it back to life.

   Two kinds, and the difference matters more than it sounds:

     kind: 'cook'     — heat is involved, it takes a slot in your Sunday.
     kind: 'portion'  — no cooking at all. You are dividing food into
                        containers. Ten minutes, no skill, and it is the
                        single highest-return thing on this list.

   The night snack is the reason this section exists. Nobody eats a bag of
   crisps at 9pm because they wanted crisps. They eat them because crisps
   were the only thing in the house that required no decision. Portioning
   six things on a Sunday is how you win that argument in advance. */

/* ── night snacks: portioning jobs, not cooking ── */
{
  id: 'p-snack-boiled-eggs', name: 'A Half-Dozen Boiled Eggs', meal: ['snack', 'breakfast'], maxPortion: 1.5,
  effort: 'quick', minutes: 15, servings: 6, batch: true, kcal: 160, protein: 13, carbs: 2, fat: 11, fiber: 0,
  tags: ['batch', 'meal-prep', 'high-protein', 'evening'],
  prep: {
    kind: 'cook', makes: 6, activeMin: 5, keepsDays: 7,
    keeps: 'A week in the fridge, in their shells.',
    freezes: false,
    containers: 'Leave them in the egg box, or one bowl.',
    reheat: 'None. Eat them cold, straight from the fridge.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Eggs', q: 6, u: 'large', a: 'protein' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Eggs in a pan, cover them with cold water by an inch.',
    'Bring to the boil, then take the pan off the heat, put the lid on, and leave it 11 minutes.',
    'Into cold water for 5 minutes. This is what makes them peel properly.',
    'Back in the egg box, in the fridge. Leave the shells on until you eat one.'
  ],
  note: 'Two eggs is 160 calories and 13g of protein at 9pm. It is the most useful five minutes you will spend on a Sunday.'
},
{
  id: 'p-snack-nut-bags', name: 'Nuts, Already Portioned', meal: ['snack'], maxPortion: 1,
  effort: 'zero', minutes: 6, servings: 6, batch: true, kcal: 170, protein: 6, carbs: 6, fat: 15, fiber: 3,
  tags: ['no-cook', 'batch', 'meal-prep', 'portable', 'evening'],
  prep: {
    kind: 'portion', makes: 6, activeMin: 6, keepsDays: 30,
    keeps: 'Weeks. They are nuts.',
    freezes: false,
    containers: '6 small sandwich bags or little tubs.',
    reheat: 'None.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Mixed nuts, unsalted', q: 1.5, u: 'cups', a: 'pantry' },
    { n: 'Small sandwich bags', q: 6, u: 'bags', a: 'other' }
  ],
  steps: [
    'A small handful into each bag — about a quarter cup, roughly what fits in your cupped palm.',
    'Six bags. Put them where you can see them, not at the back of the cupboard.',
    'At night you eat one bag. Then it is finished, because the bag is empty.'
  ],
  note: 'The whole point is the bag. Nuts from the tub is 600 calories and you will not notice. Nuts from a bag is 170 and you will stop.'
},
{
  id: 'p-snack-veg-sticks', name: 'Carrot and Pepper Sticks in Water', meal: ['snack'], maxPortion: 2,
  effort: 'zero', minutes: 12, servings: 5, batch: true, kcal: 80, protein: 2, carbs: 14, fat: 2, fiber: 4,
  tags: ['no-cook', 'batch', 'meal-prep', 'evening'],
  prep: {
    kind: 'portion', makes: 5, activeMin: 12, keepsDays: 5,
    keeps: '5 days, and they stay properly crisp because of the water.',
    freezes: false,
    containers: 'One big tub with a lid, or a jug.',
    reheat: 'None.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Carrots', q: 6, u: 'whole', a: 'produce' },
    { n: 'Bell peppers', q: 2, u: 'whole', a: 'produce' },
    { n: 'Hummus', q: 1, u: 'tub', a: 'dairy' }
  ],
  steps: [
    'Cut the carrots and peppers into sticks about the length of your finger.',
    'Into a tub, then cover them with cold water and put the lid on.',
    'The water is not optional — it is the difference between crisp on Thursday and dry and bendy on Tuesday.',
    'Take out a handful, shake the water off, dip in hummus.'
  ],
  note: 'Something to crunch on is half of what you are actually after at night.'
},
{
  id: 'p-snack-yogurt-pots', name: 'Yogurt Pots with Cinnamon', meal: ['snack', 'breakfast'], maxPortion: 1,
  effort: 'zero', minutes: 8, servings: 5, batch: true, kcal: 155, protein: 18, carbs: 12, fat: 4, fiber: 1,
  tags: ['no-cook', 'batch', 'meal-prep', 'high-protein', 'evening'],
  prep: {
    kind: 'portion', makes: 5, activeMin: 8, keepsDays: 5,
    keeps: '5 days in the fridge.',
    freezes: false,
    containers: '5 small pots or jars with lids.',
    reheat: 'None.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Plain Greek yogurt, 2%', q: 5, u: 'cups', a: 'dairy' },
    { n: 'Cinnamon', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Honey', q: 5, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'A cup of yogurt into each pot.',
    'A good shake of cinnamon and a teaspoon of honey on each. Stir it through or leave it on top.',
    'Lids on, into the fridge. Five pots.'
  ],
  note: '18g of protein for 155 calories. Cinnamon makes plain yogurt taste like it was sweetened far more than it was.'
},
{
  id: 'p-snack-cottage-fruit', name: 'Cottage Cheese Pots with Fruit', meal: ['snack'], maxPortion: 1,
  effort: 'zero', minutes: 8, servings: 4, batch: true, kcal: 170, protein: 16, carbs: 16, fat: 5, fiber: 2,
  tags: ['no-cook', 'batch', 'meal-prep', 'high-protein', 'evening'],
  prep: {
    kind: 'portion', makes: 4, activeMin: 8, keepsDays: 4,
    keeps: '4 days. Cottage cheese goes off faster than yogurt, so buy it the day you portion it.',
    freezes: false,
    containers: '4 small pots with lids.',
    reheat: 'None.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Cottage cheese, 2%', q: 3, u: 'cups', a: 'dairy' },
    { n: 'Tinned peaches or pineapple in juice, drained', q: 1, u: 'tin', a: 'pantry' }
  ],
  steps: [
    'Three-quarters of a cup of cottage cheese into each pot.',
    'Drain the fruit well and spoon some onto each.',
    'Lids on. Four pots. Eat them within four days — this is the one that will not wait a week.'
  ],
  note: 'Tinned fruit in juice, not syrup. Portioning it the day you buy it is what stops the tub going to waste, which is the reason you stopped buying it before.'
},
{
  id: 'p-snack-turkey-rollups', name: 'Turkey and Cheese Roll-Ups', meal: ['snack'], maxPortion: 1.5,
  effort: 'zero', minutes: 10, servings: 5, batch: true, kcal: 150, protein: 17, carbs: 2, fat: 8, fiber: 0,
  tags: ['no-cook', 'batch', 'meal-prep', 'high-protein', 'evening'],
  prep: {
    kind: 'portion', makes: 5, activeMin: 10, keepsDays: 4,
    keeps: '4 days in the fridge.',
    freezes: false,
    containers: 'One tub, layered, or 5 small bags.',
    reheat: 'None.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Sliced turkey breast', q: 10, u: 'slices', a: 'protein' },
    { n: 'Sliced cheese', q: 5, u: 'slices', a: 'dairy' }
  ],
  steps: [
    'A slice of cheese on two slices of turkey, roll it up tight.',
    'Five roll-ups. Into a tub.',
    'Savoury, salty, and it is protein rather than crisps.'
  ],
  note: 'Made for the night you want something salty. Two of these is 300 calories; the bag of crisps you would otherwise have is 550 and leaves you hungrier.'
},

/* ── lunches you make once and eat all week ── */
{
  id: 'p-lunch-chicken-rice-boxes', name: 'Chicken and Rice Boxes', meal: ['lunch'],
  effort: 'quick', minutes: 20, servings: 4, batch: true, kcal: 470, protein: 40, carbs: 45, fat: 14, fiber: 5,
  tags: ['batch', 'meal-prep', 'high-protein', 'portable'],
  prep: {
    kind: 'cook', makes: 4, activeMin: 15, keepsDays: 4,
    keeps: '4 days in the fridge.',
    freezes: true,
    containers: '4 lidded boxes.',
    reheat: '2 minutes in the microwave, or eat it cold — it is good cold.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Rotisserie chicken', q: 1, u: 'whole', a: 'protein' },
    { n: 'Rice', q: 1.5, u: 'cups', a: 'pantry' },
    { n: 'Bell peppers, chopped', q: 2, u: 'whole', a: 'produce' },
    { n: 'Cucumber, chopped', q: 1, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Cook the rice. That is the only cooking in this.',
    'While it cooks, pull all the meat off the rotisserie chicken. Hands are quicker than a knife.',
    'Chop the peppers and cucumber.',
    'Four boxes. Rice in the bottom, chicken on top, vegetables alongside.',
    'Olive oil and a squeeze of lemon over each, then the lids on.'
  ],
  note: 'The easiest real meal prep there is. One shop-bought chicken, one pot of rice, and Monday to Thursday lunch is finished.'
},
{
  id: 'p-lunch-tuna-bean-boxes', name: 'Tuna and White Bean Boxes', meal: ['lunch'],
  effort: 'zero', minutes: 12, servings: 4, batch: true, kcal: 425, protein: 35, carbs: 36, fat: 15, fiber: 9,
  tags: ['no-cook', 'batch', 'meal-prep', 'high-protein', 'portable'],
  prep: {
    kind: 'portion', makes: 4, activeMin: 12, keepsDays: 4,
    keeps: '4 days in the fridge, and it gets better on day two.',
    freezes: false,
    containers: '4 lidded boxes.',
    reheat: 'None. This is meant to be cold.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Tuna in olive oil, tinned', q: 4, u: 'tins', a: 'pantry' },
    { n: 'White beans, tinned', q: 2, u: 'tins', a: 'pantry' },
    { n: 'Cucumber, chopped', q: 1, u: 'whole', a: 'produce' },
    { n: 'Red onion, thinly sliced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 3, u: 'tbsp', a: 'pantry' },
    { n: 'Lemon', q: 1, u: 'whole', a: 'produce' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Drain and rinse the beans. Drain the tuna.',
    'Everything into one big bowl, olive oil and lemon over it, mix gently so the beans stay whole.',
    'Divide between four boxes. Lids on.',
    'No cooking at all. Twelve minutes and four lunches are done.'
  ],
  note: 'The one to start with if the idea of meal prep puts you off. Nothing gets heated, nothing can go wrong.'
},
{
  id: 'p-lunch-egg-salad-tubs', name: 'Egg Salad Tubs', meal: ['lunch'],
  effort: 'quick', minutes: 20, servings: 4, batch: true, kcal: 430, protein: 27, carbs: 30, fat: 23, fiber: 4,
  tags: ['batch', 'meal-prep', 'high-protein'],
  prep: {
    kind: 'cook', makes: 4, activeMin: 12, keepsDays: 3,
    keeps: '3 days in the fridge. Eggs are the shortest-lived thing here.',
    freezes: false,
    containers: '4 lidded tubs, plus bread kept separate.',
    reheat: 'None. Put it on the bread on the day, not in advance, or the bread goes soft.',
    firstTimer: false
  },
  ingredients: [
    { n: 'Eggs', q: 10, u: 'large', a: 'protein' },
    { n: 'Greek yogurt, 2%', q: 0.5, u: 'cup', a: 'dairy' },
    { n: 'Mayonnaise', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Celery, finely chopped', q: 3, u: 'stalks', a: 'produce' },
    { n: 'Whole-grain bread', q: 8, u: 'slices', a: 'bakery' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Boil the eggs: cover with cold water, bring to the boil, off the heat, lid on, 11 minutes. Then cold water.',
    'Peel and chop them roughly.',
    'Mix with the yogurt, mayonnaise and celery. Salt and pepper.',
    'Four tubs. Keep the bread out of it until the day you eat it.'
  ],
  note: 'Yogurt does most of the work that mayonnaise usually does, for a fraction of the calories. You will not miss it.'
},
{
  id: 'p-lunch-chicken-pasta-salad', name: 'Chicken and Pasta Salad', meal: ['lunch'],
  effort: 'standard', minutes: 25, servings: 4, batch: true, kcal: 480, protein: 38, carbs: 48, fat: 15, fiber: 6,
  tags: ['batch', 'meal-prep', 'high-protein', 'portable'],
  prep: {
    kind: 'cook', makes: 4, activeMin: 15, keepsDays: 4,
    keeps: '4 days in the fridge.',
    freezes: false,
    containers: '4 lidded boxes.',
    reheat: 'None, eat it cold. It is a salad.',
    firstTimer: false
  },
  ingredients: [
    { n: 'Whole-grain pasta', q: 8, u: 'oz', a: 'pantry' },
    { n: 'Rotisserie chicken', q: 1, u: 'whole', a: 'protein' },
    { n: 'Bell peppers, chopped', q: 2, u: 'whole', a: 'produce' },
    { n: 'Cucumber, chopped', q: 1, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 4, u: 'tbsp', a: 'pantry' },
    { n: 'Red wine vinegar', q: 2, u: 'tbsp', a: 'pantry' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Cook the pasta, then run it under cold water to stop it and cool it down.',
    'Pull the meat off the rotisserie chicken while the pasta cooks.',
    'Everything in one bowl with the oil and vinegar. Mix.',
    'Four boxes, lids on.'
  ],
  note: 'Cold pasta salad holds up better across four days than anything you would eat hot.'
},

/* ── breakfasts made in one go ── */
{
  id: 'p-breakfast-oat-jars', name: 'Four Jars of Overnight Oats', meal: ['breakfast'],
  effort: 'zero', minutes: 10, servings: 4, batch: true, kcal: 345, protein: 16, carbs: 52, fat: 9, fiber: 7,
  tags: ['no-cook', 'batch', 'meal-prep', 'portable'],
  prep: {
    kind: 'portion', makes: 4, activeMin: 10, keepsDays: 4,
    keeps: '4 days in the fridge.',
    freezes: false,
    containers: '4 jars or pots with lids.',
    reheat: 'None. Eat them cold, straight out of the jar.',
    firstTimer: true
  },
  ingredients: [
    { n: 'Rolled oats', q: 2, u: 'cups', a: 'pantry' },
    { n: 'Milk', q: 2, u: 'cups', a: 'dairy' },
    { n: 'Plain Greek yogurt, 2%', q: 1, u: 'cup', a: 'dairy' },
    { n: 'Berries, fresh or frozen', q: 2, u: 'cups', a: 'produce' },
    { n: 'Honey', q: 4, u: 'tsp', a: 'pantry' }
  ],
  steps: [
    'Half a cup of oats into each jar.',
    'Half a cup of milk and a quarter cup of yogurt on top of each. Stir.',
    'Berries and a teaspoon of honey on each.',
    'Lids on, into the fridge. They are ready by morning and good for four days.'
  ],
  note: 'Ten minutes on a Sunday and breakfast is not a decision you have to make at 6am for the rest of the week.'
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
