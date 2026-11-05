"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BookOpen, Search } from "lucide-react";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RECIPE_CATEGORIES, SAMPLE_RECIPES } from "@/data/recipes";
import { cn } from "@/lib/utils/cn";
import { useRecentRecipes, useSavedIds } from "@/lib/utils/use-storage";

type Tab = "all" | "saved";

export function RecipeLibrary() {
  const recent = useRecentRecipes();
  const savedIds = useSavedIds();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tab, setTab] = useState<Tab>("all");

  const all = useMemo(() => {
    const ids = new Set(recent.map((r) => r.id));
    return [...recent, ...SAMPLE_RECIPES.filter((r) => !ids.has(r.id))];
  }, [recent]);

  const q = query.trim().toLowerCase();
  const filtered = all.filter(
    (r) =>
      (tab === "all" || savedIds.includes(r.id)) &&
      (category === "All" || r.category === category) &&
      (!q ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.name.toLowerCase().includes(q)))
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold">My Recipes</h1>
        <p className="mt-2 text-muted">Your saved and recently extracted recipes.</p>
      </div>

      {recent.length > 0 && (
        <section aria-labelledby="recent">
          <h2 id="recent" className="mb-4 font-serif text-2xl font-bold">Recent</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recent.slice(0, 4).map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      )}

      <section aria-labelledby="all">
        <h2 id="all" className="sr-only">All recipes</h2>
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" aria-hidden />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recipes or ingredients" aria-label="Search recipes" className="pl-12" type="search" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {(["all", "saved"] as Tab[]).map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} aria-pressed={tab === t} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-semibold", tab === t ? "bg-foreground text-white" : "bg-card border border-border")}>
              {t === "all" ? "All recipes" : `Saved (${savedIds.length})`}
            </button>
          ))}
          <span className="mx-2 hidden h-6 w-px bg-border sm:block" aria-hidden />
          {RECIPE_CATEGORIES.map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} aria-pressed={category === c} className={cn("cursor-pointer rounded-full px-4 py-2 text-sm font-semibold", category === c ? "bg-primary text-white" : "bg-primary-soft text-primary-dark")}>
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-10 flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border p-12 text-center">
            <BookOpen className="h-10 w-10 text-primary" aria-hidden />
            <p className="font-semibold">{tab === "saved" && !q ? "You haven't saved any recipes yet." : "No recipes match your search."}</p>
            <Link href="/" className={buttonVariants({ variant: "secondary" })}>Turn a video into a recipe</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {filtered.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        )}
      </section>
    </div>
  );
}
