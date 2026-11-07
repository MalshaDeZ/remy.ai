"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Link2, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { parseVideoUrl } from "@/lib/utils/video";
import { rememberRecipe } from "@/lib/services/storage";
import type { Recipe } from "@/types";

const PROGRESS_STEPS = [
  "Checking your video link",
  "Watching the video",
  "Spotting ingredients and techniques",
  "Writing your recipe",
];

export function VideoUrlForm() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!parseVideoUrl(url)) {
      setError("Please paste a valid YouTube, Instagram or TikTok video link.");
      return;
    }
    setProgress(0);
    const timer = setInterval(
      () => setProgress((p) => (p === null ? p : Math.min(p + 1, PROGRESS_STEPS.length - 1))),
      700
    );
    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      const recipe = data.recipe as Recipe;
      rememberRecipe(recipe);
      setProgress(PROGRESS_STEPS.length);
      router.push(`/recipes/${recipe.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setProgress(null);
    } finally {
      clearInterval(timer);
    }
  }

  if (progress !== null) {
    return (
      <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-sm" role="status" aria-live="polite">
        <p className="mb-4 flex items-center gap-2 font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-primary" aria-hidden /> Remy is on it…
        </p>
        <ul className="space-y-2 text-left text-sm">
          {PROGRESS_STEPS.map((label, i) => (
            <li key={label} className={`flex items-center gap-2 ${i > progress ? "text-muted" : ""}`}>
              {i < progress ? (
                <CheckCircle2 className="h-4 w-4 text-green-700" aria-hidden />
              ) : i === progress ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" aria-hidden />
              ) : (
                <span className="h-4 w-4 rounded-full border border-border" aria-hidden />
              )}
              {label}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl" noValidate>
      <div className="flex flex-col gap-3 rounded-[2rem] border border-border bg-card p-3 shadow-[0_8px_30px_rgba(120,70,30,0.12)] sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Link2 className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste a YouTube, Instagram or TikTok link"
            aria-label="Cooking video URL"
            aria-invalid={error ? true : undefined}
            className="border-transparent pl-12 focus:border-transparent"
          />
        </div>
        <Button type="submit" size="lg">
          <Sparkles className="h-5 w-5" aria-hidden /> Turn Video Into Recipe
        </Button>
      </div>
      {error && (
        <p role="alert" className="mt-3 flex items-center justify-center gap-2 text-sm font-medium text-red-700">
          <AlertCircle className="h-4 w-4" aria-hidden /> {error}
        </p>
      )}
      <p className="mt-3 text-sm text-muted">
        Try any link, e.g. a YouTube cooking video. The prototype uses sample recipes — no account or API key needed.
      </p>
    </form>
  );
}
