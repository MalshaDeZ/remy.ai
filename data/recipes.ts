import type { CookingStep, Ingredient, Recipe } from "@/types";

type IngInput = [string, number | null, string, string?, boolean?];
type StepInput = [string, string[], number, number, string[]?];

function ings(prefix: string, list: IngInput[]): Ingredient[] {
  return list.map(([name, quantity, unit, preparationNotes, optional], i) => ({
    id: `${prefix}-i${i + 1}`,
    name,
    quantity,
    unit,
    optional: optional ?? false,
    preparationNotes,
  }));
}

function steps(prefix: string, ingredients: Ingredient[], list: StepInput[]): CookingStep[] {
  return list.map(([instruction, names, duration, videoTimestamp, tips], i) => ({
    id: `${prefix}-s${i + 1}`,
    stepNumber: i + 1,
    instruction,
    ingredients: names.map((n) => {
      const found = ingredients.find((x) => x.name.toLowerCase().startsWith(n.toLowerCase()));
      if (!found) throw new Error(`Unknown ingredient "${n}" in ${prefix}`);
      return found.id;
    }),
    duration,
    videoTimestamp,
    tips,
  }));
}

const pastaIngs = ings("pasta", [
  ["Penne or fettuccine", 250, "g"],
  ["Mixed mushrooms", 300, "g", "sliced"],
  ["Garlic", 3, "cloves", "minced"],
  ["Butter", 2, "tbsp"],
  ["Olive oil", 1, "tbsp"],
  ["Heavy cream", 200, "ml"],
  ["Parmesan", 50, "g", "finely grated"],
  ["Fresh parsley", 2, "tbsp", "chopped", true],
  ["Salt", null, "to taste"],
  ["Black pepper", null, "to taste"],
]);

const cakeIngs = ings("cake", [
  ["All-purpose flour", 200, "g"],
  ["Caster sugar", 200, "g"],
  ["Cocoa powder", 60, "g"],
  ["Baking powder", 1.5, "tsp"],
  ["Eggs", 2, "large"],
  ["Milk", 240, "ml"],
  ["Vegetable oil", 120, "ml"],
  ["Vanilla extract", 2, "tsp"],
  ["Hot coffee", 120, "ml", undefined, true],
  ["Dark chocolate", 150, "g", "chopped"],
  ["Double cream", 150, "ml"],
]);

const riceIngs = ings("rice", [
  ["Cooked cold rice", 3, "cups", "preferably day-old"],
  ["Eggs", 2, "large"],
  ["Carrot", 1, "medium", "diced small"],
  ["Green peas", 0.5, "cup"],
  ["Spring onions", 4, "stalks", "sliced, whites and greens separated"],
  ["Garlic", 3, "cloves", "minced"],
  ["Soy sauce", 2, "tbsp"],
  ["Sesame oil", 1, "tsp"],
  ["Vegetable oil", 2, "tbsp"],
  ["White pepper", null, "to taste"],
]);

const curryIngs = ings("curry", [
  ["Chicken thighs", 700, "g", "bone-in, cut into pieces"],
  ["Onion", 2, "medium", "sliced"],
  ["Garlic", 4, "cloves", "crushed"],
  ["Ginger", 1, "tbsp", "grated"],
  ["Sri Lankan curry powder", 3, "tbsp", "roasted"],
  ["Chilli powder", 1, "tsp"],
  ["Turmeric", 0.5, "tsp"],
  ["Curry leaves", 1, "sprig"],
  ["Pandan leaf", 1, "piece", undefined, true],
  ["Cinnamon stick", 1, "piece"],
  ["Tomato", 1, "medium", "chopped"],
  ["Coconut milk", 400, "ml"],
  ["Coconut oil", 2, "tbsp"],
  ["Salt", null, "to taste"],
]);

export const SAMPLE_RECIPES: Recipe[] = [
  {
    id: "creamy-mushroom-pasta",
    title: "Creamy Mushroom Pasta",
    description:
      "Silky garlic-cream sauce, golden mushrooms and al dente pasta — a cosy weeknight favourite ready in 30 minutes.",
    sourceUrl: "https://www.youtube.com/watch?v=remy-mushroom-pasta",
    thumbnailUrl: "/thumbnails/pasta.svg",
    ingredients: pastaIngs,
    preparationTime: 10,
    cookingTime: 20,
    totalTime: 30,
    servings: 2,
    difficulty: "Easy",
    equipment: ["Large pot", "Large frying pan", "Wooden spoon", "Colander"],
    instructions: steps("pasta", pastaIngs, [
      ["Boil the pasta in well-salted water until al dente. Reserve a mug of pasta water, then drain.", ["Penne", "Salt"], 10, 25, ["Salt the water generously — it should taste like the sea."]],
      ["Heat the butter and olive oil in a large pan over medium-high heat. Add the mushrooms in a single layer and cook until deeply golden.", ["Butter", "Olive", "Mixed"], 6, 70, ["Don't stir too often; let the mushrooms brown."]],
      ["Add the garlic and cook for 30 seconds until fragrant, taking care not to burn it.", ["Garlic"], 1, 120],
      ["Add cream and simmer gently until the sauce thickens enough to coat the back of a spoon.", ["Heavy"], 5, 150, ["Keep the heat medium-low so the cream doesn't split."]],
      ["Stir in the Parmesan, then toss in the pasta with a splash of pasta water until glossy.", ["Parmesan", "Penne"], 2, 200],
      ["Season with salt and pepper, scatter with parsley and serve immediately.", ["Salt", "Black", "Fresh"], 1, 240],
    ]),
    tips: [
      "Use a mix of mushrooms for deeper flavour.",
      "Pasta water is starchy — it helps the sauce cling and thicken.",
      "Add a squeeze of lemon at the end to brighten the richness.",
    ],
    category: "Pasta",
  },
  {
    id: "chocolate-cake",
    title: "Chocolate Cake",
    description:
      "A moist, deeply chocolatey layer-free cake topped with glossy ganache. Simple one-bowl batter, bakery-level results.",
    sourceUrl: "https://www.instagram.com/reel/remy-chocolate-cake",
    thumbnailUrl: "/thumbnails/cake.svg",
    ingredients: cakeIngs,
    preparationTime: 20,
    cookingTime: 35,
    totalTime: 75,
    servings: 8,
    difficulty: "Medium",
    equipment: ["20cm round cake tin", "Mixing bowls", "Whisk", "Saucepan", "Wire rack"],
    instructions: steps("cake", cakeIngs, [
      ["Preheat the oven to 175°C (350°F) and line a 20cm tin with baking paper.", [], 5, 10],
      ["Whisk the flour, sugar, cocoa and baking powder together in a large bowl.", ["All", "Caster", "Cocoa", "Baking"], 3, 40],
      ["In another bowl, whisk eggs, milk, oil and vanilla until smooth.", ["Eggs", "Milk", "Vegetable", "Vanilla"], 3, 80],
      ["Pour the wet mix into the dry and whisk until just combined, then stir in the hot coffee. The batter will be thin.", ["Hot"], 3, 120, ["Don't overmix — it makes the cake tough."]],
      ["Pour into the tin and bake for 30–35 minutes, until a skewer comes out with a few moist crumbs.", [], 35, 160, ["Avoid opening the oven door in the first 20 minutes."]],
      ["Cool in the tin for 10 minutes, then turn out onto a wire rack to cool completely.", [], 30, 210],
      ["Heat the cream until steaming, pour over the chopped chocolate, wait a minute, stir until glossy, then spread over the cake.", ["Double", "Dark"], 10, 250],
    ]),
    tips: [
      "Coffee deepens the chocolate flavour without tasting of coffee.",
      "Bring eggs and milk to room temperature for a better rise.",
    ],
    category: "Dessert",
  },
  {
    id: "vegetable-fried-rice",
    title: "Vegetable Fried Rice",
    description:
      "Restaurant-style fried rice with fluffy egg, crisp vegetables and a smoky wok finish — ready in 15 minutes.",
    sourceUrl: "https://www.tiktok.com/@remy/video/vegetable-fried-rice",
    thumbnailUrl: "/thumbnails/rice.svg",
    ingredients: riceIngs,
    preparationTime: 10,
    cookingTime: 10,
    totalTime: 20,
    servings: 2,
    difficulty: "Easy",
    equipment: ["Wok or large frying pan", "Spatula"],
    instructions: steps("rice", riceIngs, [
      ["Break up any clumps in the cold rice with your fingers so the grains are separate.", ["Cooked"], 2, 8],
      ["Heat a wok over high heat until smoking. Add 1 tbsp oil and scramble the eggs until just set, then remove.", ["Eggs", "Vegetable"], 2, 30],
      ["Add the remaining oil, then the garlic, spring onion whites, carrot and peas. Stir-fry for 2 minutes.", ["Garlic", "Spring", "Carrot", "Green", "Vegetable"], 3, 60],
      ["Add the rice and press it against the hot wok, tossing so it toasts and heats through.", ["Cooked"], 3, 100, ["Cold rice is key — fresh rice turns mushy."]],
      ["Stir in the soy sauce, sesame oil and white pepper, return the eggs and toss everything together.", ["Soy", "Sesame", "White", "Eggs"], 2, 140],
      ["Finish with the spring onion greens and serve hot.", ["Spring"], 1, 165],
    ]),
    tips: [
      "Day-old rice dries out in the fridge, which gives the best texture.",
      "Cook in small batches so the wok stays very hot.",
    ],
    category: "Rice & Noodles",
  },
  {
    id: "sri-lankan-chicken-curry",
    title: "Sri Lankan Chicken Curry",
    description:
      "A fragrant, coconut-rich chicken curry with roasted curry powder, curry leaves and pandan. Best with rice and sambol.",
    sourceUrl: "https://www.youtube.com/watch?v=remy-sl-chicken-curry",
    thumbnailUrl: "/thumbnails/curry.svg",
    ingredients: curryIngs,
    preparationTime: 15,
    cookingTime: 40,
    totalTime: 55,
    servings: 4,
    difficulty: "Medium",
    equipment: ["Heavy-bottomed pot with lid", "Wooden spoon", "Chopping board"],
    instructions: steps("curry", curryIngs, [
      ["Marinate the chicken with curry powder, chilli, turmeric and salt. Rest while you prep the rest.", ["Chicken", "Sri", "Chilli", "Turmeric", "Salt"], 10, 30],
      ["Heat coconut oil in a pot. Add cinnamon, curry leaves and pandan until fragrant, then the onion, garlic and ginger. Cook until soft and golden.", ["Coconut oil", "Cinnamon", "Curry leaves", "Pandan", "Onion", "Garlic", "Ginger"], 8, 90],
      ["Add the marinated chicken and tomato. Stir well, cover and cook on medium heat for 10 minutes — the chicken will release its own juices.", ["Chicken", "Tomato"], 10, 150, ["Don't add water; let the chicken cook in its juices."]],
      ["Pour in the coconut milk, bring to a gentle simmer and cook uncovered until the chicken is tender and the gravy thickens.", ["Coconut milk"], 20, 220, ["Don't boil hard or the coconut milk may split."]],
      ["Taste and adjust salt. Rest for 5 minutes, then serve with steamed rice.", ["Salt"], 5, 290],
    ]),
    tips: [
      "Roasting the curry powder in a dry pan first adds a deeper aroma.",
      "The curry tastes even better the next day.",
      "Add a squeeze of lime to lift the flavours.",
    ],
    category: "Curry",
  },
];

export const RECIPE_CATEGORIES = ["All", ...Array.from(new Set(SAMPLE_RECIPES.map((r) => r.category)))];

export function getRecipeById(id: string): Recipe | undefined {
  return SAMPLE_RECIPES.find((r) => r.id === id);
}
