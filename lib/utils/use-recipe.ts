"use client";

import { getRecipeById } from "@/data/recipes";
import type { Recipe } from "@/types";
import { useHydrated, useRecentRecipes } from "./use-storage";

/** Loads a recipe from extracted (local) recipes first, then samples. */
export function useRecipe(id: string): { recipe: Recipe | null; loading: boolean } {
  const hydrated = useHydrated();
  const recent = useRecentRecipes();
  const recipe = recent.find((r) => r.id === id) ?? getRecipeById(id) ?? null;
  return { recipe, loading: !hydrated };
}
