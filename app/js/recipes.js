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
  id: 'b-boiled-eggs-toast', name: 'Hard-Boiled Eggs with Toast and Tomato', meal: ['breakfast'],
  effort: 'zero', minutes: 5, servings: 1, kcal: 400, protein: 22, carbs: 36, fat: 19, fiber: 6,
  tags: ['no-cook', 'prep-ahead', 'high-protein'],
  ingredients: [
    { n: 'Eggs, boiled ahead of time', q: 2, u: 'large', a: 'protein' },
    { n: 'Whole-grain bread', q: 2, u: 'slices', a: 'bakery' },
    { n: 'Tomato, sliced', q: 1, u: 'whole', a: 'produce' },
    { n: 'Olive oil', q: 2, u: 'tsp', a: 'pantry' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: [
    'Boil half a dozen eggs on a Sunday and this becomes a five-minute breakfast all week.',
    'Toast, sliced tomato, sliced egg, olive oil, salt, pepper.'
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
  id: 'b-cottage-fruit', name: 'Cottage Cheese with Fruit', meal: ['breakfast'],
  effort: 'zero', minutes: 3, servings: 1, kcal: 310, protein: 29, carbs: 24, fat: 11, fiber: 4,
  tags: ['no-cook', 'high-protein'],
  ingredients: [
    { n: 'Low-fat cottage cheese', q: 1, u: 'cup', a: 'dairy' },
    { n: 'Berries or sliced peach', q: 0.75, u: 'cup', a: 'produce' },
    { n: 'Sliced almonds', q: 1, u: 'tbsp', a: 'pantry' },
    { n: 'Ground cinnamon', q: 1, u: 'pinch', a: 'pantry' }
  ],
  steps: ['Fruit and almonds over the cottage cheese, cinnamon on top.'],
  note: 'Nearly 30g of protein for 310 calories. Very hard to beat that ratio.'
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
{
  id: 'b-smoothie', name: 'Yogurt and Berry Smoothie', meal: ['breakfast'],
  effort: 'zero', minutes: 4, servings: 1, kcal: 330, protein: 25, carbs: 40, fat: 8, fiber: 6,
  tags: ['no-cook', 'portable', 'high-protein'],
  ingredients: [
    { n: 'Plain Greek yogurt, 2%', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Frozen berries', q: 1, u: 'cup', a: 'frozen' },
    { n: 'Banana', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Milk', q: 0.5, u: 'cup', a: 'dairy' },
    { n: 'Peanut butter', q: 1, u: 'tsp', a: 'pantry' }
  ],
  steps: ['Blend for 45 seconds.', 'Drink it within the hour or it separates.']
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
    { n: 'Cherry tomatoes', q: 1, u: 'cup', a: 'produce' },
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
    { n: 'Cherry tomatoes', q: 1, u: 'cup', a: 'produce' },
    { n: 'Whole-grain bread', q: 1, u: 'slice', a: 'bakery' }
  ],
  steps: [
    'Mix the tuna with the yogurt, celery, lemon, salt and pepper.',
    'Serve on the lettuce with the tomatoes and a slice of bread.'
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
    { n: 'Tomato, sliced', q: 0.5, u: 'whole', a: 'produce' },
    { n: 'Baby spinach', q: 1, u: 'cup', a: 'produce' }
  ],
  steps: [
    'Spread the hummus right to the edges — it is both the glue and the sauce.',
    'Layer the spinach, chicken, cucumber and tomato.',
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
    { n: 'Tomato, sliced', q: 0.5, u: 'whole', a: 'produce' }
  ],
  steps: [
    'Mix the tuna, yogurt, celery, salt and pepper.',
    'Onto the bread with the lettuce and tomato.'
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
    { n: 'Cherry tomatoes, halved', q: 1, u: 'cup', a: 'produce' },
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
    { n: 'Cherry tomatoes', q: 0.75, u: 'cup', a: 'produce' },
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
  id: 'l-cucumber-tomato-chicken', name: 'Cucumber, Tomato and Chicken Salad', meal: ['lunch'],
  effort: 'quick', minutes: 12, servings: 1, kcal: 460, protein: 38, carbs: 22, fat: 26, fiber: 7,
  tags: ['high-protein', 'no-cook', 'low-carb'],
  ingredients: [
    { n: 'Cooked chicken breast, sliced', q: 5, u: 'oz', a: 'protein' },
    { n: 'Cucumber, chunked', q: 1, u: 'whole', a: 'produce' },
    { n: 'Tomatoes, wedged', q: 2, u: 'whole', a: 'produce' },
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
    { n: 'Cherry tomatoes', q: 2, u: 'cups', a: 'produce' },
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
    { n: 'Salad greens, cucumber, tomato', q: null, u: 'to serve', a: 'produce' },
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
    { n: 'Cherry tomatoes', q: 1, u: 'cup', a: 'produce' },
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
  id: 's-cottage-tomato', name: 'Cottage Cheese with Tomato', meal: ['snack'],
  effort: 'zero', minutes: 3, servings: 1, kcal: 170, protein: 20, carbs: 10, fat: 6, fiber: 1,
  tags: ['no-cook', 'high-protein'],
  ingredients: [
    { n: 'Low-fat cottage cheese', q: 0.75, u: 'cup', a: 'dairy' },
    { n: 'Cherry tomatoes, halved', q: 0.75, u: 'cup', a: 'produce' },
    { n: 'Olive oil', q: 1, u: 'tsp', a: 'pantry' },
    { n: 'Salt and pepper', q: null, u: 'to taste', a: 'pantry' }
  ],
  steps: ['Tomatoes over the cottage cheese, olive oil, lots of black pepper.']
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
