import type { Recipe } from "@/types";
import { MockVideoAnalysisAgent } from "@/lib/agents/mock-video-analysis";
import { MockRecipeExtractionAgent } from "@/lib/agents/mock-recipe-extraction";
import { MockRecipeValidationAgent } from "@/lib/agents/mock-recipe-validation";
import type { ValidationIssue } from "@/lib/agents/types";
import { ingestVideo } from "./video-ingestion";

// Swap these for LLM-backed agents (e.g. using OPENAI_API_KEY) later.
const videoAnalysis = new MockVideoAnalysisAgent();
const extraction = new MockRecipeExtractionAgent();
const validation = new MockRecipeValidationAgent();

export interface ExtractionResult {
  recipe: Recipe;
  issues: ValidationIssue[];
}

export async function extractRecipeFromUrl(url: string): Promise<ExtractionResult> {
  const video = ingestVideo(url);
  const analysis = await videoAnalysis.analyse(video);
  const recipe = await extraction.extract(analysis);
  const issues = await validation.validate(recipe);
  if (issues.some((i) => i.severity === "error")) {
    throw new Error("The extracted recipe failed validation.");
  }
  return { recipe, issues };
}
