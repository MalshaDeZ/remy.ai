export type Difficulty = "Easy" | "Medium" | "Hard";

export interface Ingredient {
  id: string;
  name: string;
  quantity: number | null;
  unit: string;
  optional: boolean;
  preparationNotes?: string;
}

export interface CookingStep {
  id: string;
  stepNumber: number;
  instruction: string;
  /** Ids of ingredients used in this step */
  ingredients: string[];
  /** Estimated duration in minutes */
  duration: number;
  /** Timestamp in the original video, in seconds */
  videoTimestamp?: number;
  tips?: string[];
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  sourceUrl: string;
  thumbnailUrl: string;
  ingredients: Ingredient[];
  /** Minutes */
  preparationTime: number;
  /** Minutes */
  cookingTime: number;
  /** Minutes */
  totalTime: number;
  servings: number;
  difficulty: Difficulty;
  equipment: string[];
  instructions: CookingStep[];
  tips: string[];
  category: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface CookingSession {
  id: string;
  recipeId: string;
  currentStep: number;
  completedSteps: number[];
  servings: number;
  startedAt: string;
  conversationHistory: ChatMessage[];
}

export type VideoPlatform = "youtube" | "instagram" | "tiktok";

export interface ChatContext {
  recipe: Recipe;
  currentStep: number;
  completedSteps: number[];
  servings: number;
  history: ChatMessage[];
}
