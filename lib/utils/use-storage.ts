"use client";

import { useMemo, useSyncExternalStore } from "react";
import { getRawSnapshot, subscribeStorage } from "@/lib/services/storage";
import type { Recipe } from "@/types";

function useStored<T>(key: "recipes" | "saved", fallback: T): T {
  const raw = useSyncExternalStore(
    subscribeStorage,
    () => getRawSnapshot(key),
    () => null
  );
  return useMemo(() => {
    try {
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raw]);
}

const NO_RECIPES: Recipe[] = [];
const NO_IDS: string[] = [];

export const useRecentRecipes = () => useStored<Recipe[]>("recipes", NO_RECIPES);
export const useSavedIds = () => useStored<string[]>("saved", NO_IDS);

/** False on the server and during hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
