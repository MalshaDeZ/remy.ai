import type { CookingSession, Recipe } from "@/types";

// localStorage-backed persistence. Replace with API calls + Prisma later.
const KEYS = {
  recipes: "remy:recipes",
  saved: "remy:saved",
  session: (recipeId: string) => `remy:session:${recipeId}`,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

const CHANGE_EVENT = "remy:storage";

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* storage unavailable or full: ignore */
  }
}

export function subscribeStorage(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Raw stored string for a key (stable snapshot for useSyncExternalStore). */
export function getRawSnapshot(key: "recipes" | "saved"): string | null {
  try {
    return window.localStorage.getItem(KEYS[key]);
  } catch {
    return null;
  }
}

/** Recipes the user has extracted, most recent first. */
export function getRecentRecipes(): Recipe[] {
  return read<Recipe[]>(KEYS.recipes, []);
}

export function rememberRecipe(recipe: Recipe) {
  const rest = getRecentRecipes().filter((r) => r.id !== recipe.id);
  write(KEYS.recipes, [recipe, ...rest].slice(0, 20));
}

export function getSavedIds(): string[] {
  return read<string[]>(KEYS.saved, []);
}

export function toggleSaved(id: string): boolean {
  const ids = getSavedIds();
  const next = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
  write(KEYS.saved, next);
  return next.includes(id);
}

export function getSession(recipeId: string): CookingSession | null {
  return read<CookingSession | null>(KEYS.session(recipeId), null);
}

export function saveSession(session: CookingSession) {
  write(KEYS.session(session.recipeId), session);
}

export function clearSession(recipeId: string) {
  try {
    window.localStorage.removeItem(KEYS.session(recipeId));
  } catch {
    /* ignore */
  }
}
