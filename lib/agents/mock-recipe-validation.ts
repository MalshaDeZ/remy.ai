import type { Recipe } from "@/types";
import type { RecipeValidationAgent, ValidationIssue } from "./types";

export class MockRecipeValidationAgent implements RecipeValidationAgent {
  async validate(recipe: Recipe): Promise<ValidationIssue[]> {
    const issues: ValidationIssue[] = [];
    if (recipe.ingredients.length === 0)
      issues.push({ severity: "error", message: "Recipe has no ingredients." });
    if (recipe.instructions.length === 0)
      issues.push({ severity: "error", message: "Recipe has no instructions." });
    const ids = new Set(recipe.ingredients.map((i) => i.id));
    for (const step of recipe.instructions) {
      for (const id of step.ingredients) {
        if (!ids.has(id))
          issues.push({
            severity: "error",
            message: `Step ${step.stepNumber} references an unknown ingredient.`,
          });
      }
    }
    for (const ing of recipe.ingredients) {
      if (ing.quantity === null && !ing.unit)
        issues.push({ severity: "warning", message: `Missing quantity for ${ing.name}.` });
    }
    return issues;
  }
}
