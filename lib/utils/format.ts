import type { Ingredient } from "@/types";

export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}

export function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

const FRACTIONS: [number, string][] = [
  [0.25, "¼"],
  [1 / 3, "⅓"],
  [0.5, "½"],
  [2 / 3, "⅔"],
  [0.75, "¾"],
];

export function formatQuantity(q: number): string {
  const whole = Math.floor(q);
  const frac = q - whole;
  if (frac < 0.05) return String(whole);
  const match = FRACTIONS.find(([v]) => Math.abs(v - frac) < 0.06);
  if (match) return whole ? `${whole}${match[1]}` : match[1];
  if (frac > 0.95) return String(whole + 1);
  return String(Math.round(q * 10) / 10);
}

export function scaleIngredient(
  ing: Ingredient,
  baseServings: number,
  servings: number
): string {
  if (ing.quantity === null) return ing.unit;
  const scaled = (ing.quantity * servings) / baseServings;
  return `${formatQuantity(scaled)}${ing.unit ? " " + ing.unit : ""}`;
}
