import type { ChatContext } from "@/types";
import type { CookingAssistantAgent } from "./types";
import { MockCookingGuidanceAgent } from "./mock-cooking-guidance";

interface Scenario {
  match: RegExp;
  reply: (ctx: ChatContext, question: string) => string;
}

const guidance = new MockCookingGuidanceAgent();

const GLOSSARY: Record<string, string> = {
  fold: "Folding means gently combining a light mixture (like whipped cream) into a heavier one using a spatula, cutting down through the middle and sweeping up the side, so you keep the air in.",
  simmer: "Simmering is cooking just below boiling — you should see small, lazy bubbles breaking the surface now and then.",
  "al dente": "Al dente means 'to the tooth': cooked through but still with a slight bite in the centre.",
  deglaze: "Deglazing means adding liquid to a hot pan to loosen the browned bits stuck to the bottom — they're pure flavour.",
  sauté: "Sautéing is cooking quickly in a little fat over fairly high heat, moving the food often.",
  saute: "Sautéing is cooking quickly in a little fat over fairly high heat, moving the food often.",
  slurry: "A slurry is a starch (flour or cornflour) mixed with cold water, used to thicken sauces without lumps.",
};

function stepOf(ctx: ChatContext) {
  return ctx.recipe.instructions[ctx.currentStep] ?? ctx.recipe.instructions[0];
}

const BACK = (ctx: ChatContext) =>
  ` When you're ready, we can get back to step ${stepOf(ctx).stepNumber}.`;

const SCENARIOS: Scenario[] = [
  {
    match: /watery|too thin|runny|not thick/i,
    reply: (ctx) =>
      `Don't worry, this is easy to fix! Let it simmer gently for a few more minutes without the lid, stirring occasionally, so the excess liquid evaporates. If it's still too thin, a little grated Parmesan (or a slurry of flour or cornflour mixed with cold water, stirred in gradually) will thicken it. Avoid high heat — rich sauces can split.${BACK(ctx)}`,
  },
  {
    match: /flour/i,
    reply: () =>
      "Yes! Mix a small amount of flour with cold water to make a smooth slurry. Stir it in gradually and let it simmer briefly until it thickens. Avoid adding dry flour directly, as it can form lumps.",
  },
  {
    match: /too much salt|too salty|over-?salted|oversalted/i,
    reply: (ctx) =>
      `No worries, it happens to everyone! Add a bit more of the other ingredients (cream, coconut milk, water or unsalted veg) to dilute it, and a squeeze of lemon or a pinch of sugar to balance the taste. Avoid adding more seasoning until you've tasted again.${BACK(ctx)}`,
  },
  {
    match: /too sticky|sticky/i,
    reply: () =>
      "Sticky dough or batter is usually just a touch too wet. Dust your hands and surface lightly with flour and add a tablespoon of flour at a time until it's manageable. Resting it for 5–10 minutes also helps the flour hydrate.",
  },
  {
    match: /burn|burnt|stuck to the (pan|bottom)|scorch/i,
    reply: (ctx) =>
      `Take the pan off the heat right away. If only the bottom is catching, transfer the unburnt food to a clean pan without scraping the bottom. A splash of water or stock and lower heat will help. Don't stir up the burnt bits.${BACK(ctx)}`,
  },
  {
    match: /substitut|instead of|replace|swap|don'?t have|dont have|run out/i,
    reply: (ctx, q) => {
      if (/butter/i.test(q))
        return "Yes, you can use oil instead of butter. Use about ¾ the amount, since butter contains some water. Oil gives less richness and a slightly different flavour; olive oil works well for savoury dishes. In baking, use a neutral oil.";
      if (/cream/i.test(q) && /coconut/i.test(q))
        return "Yes, coconut milk works instead of cream! Use the same amount. The sauce will be slightly lighter with a gentle coconut flavour. Full-fat coconut milk gives the best thickness, and simmering a bit longer will make it richer.";
      if (/cream/i.test(q))
        return "Good options for cream: full-fat coconut milk (1:1), or whole milk with a knob of butter. Milk is thinner, so simmer it a bit longer or add a little Parmesan.";
      if (/egg/i.test(q))
        return "For one egg in baking, try ¼ cup of yoghurt, or 1 tbsp ground flaxseed mixed with 3 tbsp water. The texture will be slightly denser.";
      if (/soy/i.test(q))
        return "No soy sauce? Use tamari or coconut aminos 1:1, or a pinch of salt with a dash of Worcestershire sauce.";
      const ingredient = ctx.recipe.ingredients.map((i) => i.name).join(", ");
      return `Tell me which ingredient you're missing and I'll suggest the best swap. Quick ones: butter ↔ oil, cream ↔ coconut milk, fresh herbs ↔ dried (use a third). The recipe uses: ${ingredient}.`;
    },
  },
  {
    match: /what does .* mean|what is|what'?s|explain.*(term|technique)/i,
    reply: (ctx, q) => {
      for (const [term, def] of Object.entries(GLOSSARY)) {
        if (q.toLowerCase().includes(term)) return def;
      }
      return `Good question! Which term or technique would you like explained? In the meantime, here's the current step: ${stepOf(ctx).instruction}`;
    },
  },
  {
    match: /explain (this|the) step|help me with this step|what do i do/i,
    reply: (ctx) => {
      const step = stepOf(ctx);
      return `Here's the plan: ${step.instruction} It should take about ${step.duration} min. ${step.tips?.[0] ? "Tip: " + step.tips[0] : "Take your time — you've got this!"}`;
    },
  },
  {
    match: /ready|done|cooked|know when|fully cooked/i,
    reply: (ctx) => {
      const step = stepOf(ctx);
      if (/chicken/i.test(step.instruction + ctx.recipe.title))
        return "Chicken is done when the juices run clear and the thickest part reaches 74°C (165°F). Cut into the largest piece: it should be white all the way through with no pink.";
      if (/cake|bake/i.test(step.instruction))
        return "Insert a skewer in the centre: it should come out clean or with a few moist crumbs. The top should spring back lightly when pressed.";
      if (/pasta|penne|boil/i.test(step.instruction))
        return "Bite a piece of pasta: it should be tender outside with a tiny firm centre. If it's chalky, give it another minute.";
      if (/sauce|simmer|thicken/i.test(step.instruction))
        return "The sauce is ready when it coats the back of a spoon and a finger drawn through leaves a clear line.";
      return `Look for the cues in this step: "${step.instruction}" Estimated time is ${step.duration} min, but trust your eyes and nose — colour, aroma and texture matter more than the clock.`;
    },
  },
  {
    match: /skip/i,
    reply: (ctx) =>
      `You can, but it may change the result. ${stepOf(ctx).tips?.[0] ?? "This step usually builds flavour or texture for later steps."} If you're short on time, tell me which part you'd like to skip and I'll tell you the consequences.`,
  },
  {
    match: /in advance|ahead|make.*(before|earlier)|store|leftover|freeze|fridge/i,
    reply: (ctx) =>
      `Yes! You can prep ingredients ahead (chop, measure, grate) up to a day before. For ${ctx.recipe.title}, cooked leftovers keep 2–3 days in the fridge in a sealed container; reheat gently with a splash of liquid.`,
  },
  {
    match: /adjust|scale|double|half|more people|servings/i,
    reply: (ctx) =>
      `You're cooking for ${ctx.servings} right now. Change the servings on the recipe page and quantities will scale. When doubling, season gradually, and cooking times for pans usually increase a little because of the larger volume.`,
  },
  {
    match: /something went wrong|help!|mistake|oops|messed|ruined|went wrong/i,
    reply: (ctx) =>
      `Don't worry — most kitchen mishaps can be rescued! Tell me what happened (too salty, too thin, burnt, too dry, lumpy…) and I'll help. We're on step ${stepOf(ctx).stepNumber}: "${stepOf(ctx).instruction}"`,
  },
  {
    match: /temperature|how hot|heat|degrees|how long|time/i,
    reply: (ctx) => {
      const step = stepOf(ctx);
      return `This step takes about ${step.duration} min. ${/simmer|cream|coconut/i.test(step.instruction) ? "Keep the heat at medium-low for a gentle simmer." : "Medium to medium-high heat is usually right; lower it if anything browns too fast."}`;
    },
  },
  {
    match: /thank|thanks/i,
    reply: () => "You're very welcome! I'm right here if you need anything else. 🍳",
  },
];

export class MockCookingAssistantAgent implements CookingAssistantAgent {
  async answer(question: string, ctx: ChatContext): Promise<string> {
    const found = SCENARIOS.find((s) => s.match.test(question));
    if (found) return found.reply(ctx, question);
    const step = stepOf(ctx);
    const text = await guidance.explainStep(step, ctx.recipe);
    return `I'm not completely sure what you mean, could you tell me a bit more? Meanwhile, ${text} I'm here whenever you need help with substitutions, mistakes or techniques.`;
  }
}
