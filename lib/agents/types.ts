import type { ChatContext, CookingStep, Recipe, VideoPlatform } from "@/types";

/** Raw observations from analysing a video (frames, transcript, metadata). */
export interface VideoAnalysis {
  platform: VideoPlatform;
  sourceUrl: string;
  title: string;
  ingredients: string[];
  actions: { action: string; timestamp: number }[];
  techniques: string[];
}

export interface ValidationIssue {
  severity: "info" | "warning" | "error";
  message: string;
}

export interface VideoAnalysisAgent {
  analyse(input: { platform: VideoPlatform; url: string }): Promise<VideoAnalysis>;
}

export interface RecipeExtractionAgent {
  extract(analysis: VideoAnalysis): Promise<Recipe>;
}

export interface RecipeValidationAgent {
  validate(recipe: Recipe): Promise<ValidationIssue[]>;
}

export interface CookingAssistantAgent {
  answer(question: string, context: ChatContext): Promise<string>;
}

export interface CookingGuidanceAgent {
  explainStep(step: CookingStep, recipe: Recipe): Promise<string>;
}
