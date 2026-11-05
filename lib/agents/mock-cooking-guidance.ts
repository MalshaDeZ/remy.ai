import type { CookingStep, Recipe } from "@/types";
import type { CookingGuidanceAgent } from "./types";

export class MockCookingGuidanceAgent implements CookingGuidanceAgent {
  async explainStep(step: CookingStep, recipe: Recipe): Promise<string> {
    const names = step.ingredients
      .map((id) => recipe.ingredients.find((i) => i.id === id)?.name)
      .filter(Boolean)
      .join(", ");
    const tip = step.tips?.[0] ? ` Tip: ${step.tips[0]}` : "";
    return `Step ${step.stepNumber} should take about ${step.duration} min${names ? ` and uses ${names}` : ""}.${tip}`;
  }
}
