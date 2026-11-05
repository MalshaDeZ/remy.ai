import { SAMPLE_RECIPES } from "@/data/recipes";
import type { Recipe } from "@/types";
import type { RecipeExtractionAgent, VideoAnalysis } from "./types";

export class MockRecipeExtractionAgent implements RecipeExtractionAgent {
  async extract(analysis: VideoAnalysis): Promise<Recipe> {
    const sample = SAMPLE_RECIPES.find((r) => r.title === analysis.title);
    if (!sample) throw new Error("Could not extract a recipe from this video.");
    return { ...sample, sourceUrl: analysis.sourceUrl };
  }
}
