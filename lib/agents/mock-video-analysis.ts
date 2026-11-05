import { SAMPLE_RECIPES } from "@/data/recipes";
import type { VideoAnalysisAgent } from "./types";

/** Picks a sample recipe from URL keywords, otherwise deterministically from a hash. */
export function pickSampleIndex(url: string): number {
  const lower = url.toLowerCase();
  const keyword = SAMPLE_RECIPES.findIndex((r) =>
    r.id.split("-").some((w) => w.length > 4 && lower.includes(w))
  );
  if (keyword >= 0) return keyword;
  let hash = 0;
  for (let i = 0; i < lower.length; i++) hash = (hash * 31 + lower.charCodeAt(i)) >>> 0;
  return hash % SAMPLE_RECIPES.length;
}

export class MockVideoAnalysisAgent implements VideoAnalysisAgent {
  async analyse({ platform, url }: { platform: "youtube" | "instagram" | "tiktok"; url: string }) {
    const sample = SAMPLE_RECIPES[pickSampleIndex(url)];
    return {
      platform,
      sourceUrl: url,
      title: sample.title,
      ingredients: sample.ingredients.map((i) => i.name),
      actions: sample.instructions.map((s) => ({
        action: s.instruction,
        timestamp: s.videoTimestamp ?? 0,
      })),
      techniques: [],
    };
  }
}
