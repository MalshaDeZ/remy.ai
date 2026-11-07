"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, BookmarkCheck, Clock, ExternalLink, Flame, Lightbulb, Minus, Play, Plus, Users, Wrench } from "lucide-react";
import { Footer, Navbar } from "@/components/layout/navbar";
import { RecipeLoading, RecipeNotFound } from "@/components/layout/not-found-recipe";
import { Button } from "@/components/ui/button";
import { Badge, Card } from "@/components/ui/card";
import { formatMinutes, scaleIngredient } from "@/lib/utils/format";
import { useRecipe } from "@/lib/utils/use-recipe";
import { useSavedIds } from "@/lib/utils/use-storage";
import { saveSession, toggleSaved } from "@/lib/services/storage";
import { cn } from "@/lib/utils/cn";

export function RecipeDetail({ id }: { id: string }) {
  const router = useRouter();
  const { recipe, loading } = useRecipe(id);
  const [servings, setServings] = useState<number | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const saved = useSavedIds().includes(id);

  if (loading) return (<><Navbar /><RecipeLoading /></>);
  if (!recipe) return (<><Navbar /><RecipeNotFound /></>);

  const current = servings ?? recipe.servings;

  function toggle(ingId: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(ingId)) next.delete(ingId);
      else next.add(ingId);
      return next;
    });
  }

  function startCooking() {
    if (!recipe) return;
    saveSession({
      id: crypto.randomUUID(),
      recipeId: recipe.id,
      currentStep: 0,
      completedSteps: [],
      servings: current,
      startedAt: new Date().toISOString(),
      conversationHistory: [],
    });
    router.push(`/cooking/${recipe.id}`);
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={recipe.thumbnailUrl} alt={`${recipe.title} video preview`} className="aspect-video w-full rounded-3xl object-cover shadow-md" />
            <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
              <ExternalLink className="h-4 w-4" aria-hidden /> Watch original video
            </a>
          </div>
          <div className="space-y-4">
            <Badge>{recipe.category}</Badge>
            <h1 className="font-serif text-4xl font-bold">{recipe.title}</h1>
            <p className="text-lg text-muted">{recipe.description}</p>
            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={startCooking}><Play className="h-5 w-5" aria-hidden /> Start Cooking</Button>
              <Button size="lg" variant="outline" onClick={() => toggleSaved(recipe.id)} aria-pressed={saved}>
                {saved ? <BookmarkCheck className="h-5 w-5" aria-hidden /> : <Bookmark className="h-5 w-5" aria-hidden />}
                {saved ? "Saved" : "Save recipe"}
              </Button>
            </div>
          </div>
        </div>

        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            ["Prep", formatMinutes(recipe.preparationTime), Clock],
            ["Cook", formatMinutes(recipe.cookingTime), Flame],
            ["Total", formatMinutes(recipe.totalTime), Clock],
            ["Difficulty", recipe.difficulty, Flame],
          ].map(([label, value, Icon]) => {
            const I = Icon as typeof Clock;
            return (
              <Card key={label as string} className="p-4">
                <dt className="flex items-center gap-1 text-sm text-muted"><I className="h-4 w-4" aria-hidden /> {label as string}</dt>
                <dd className="mt-1 text-lg font-bold">{value as string}</dd>
              </Card>
            );
          })}
        </dl>

        <div className="mt-10 grid gap-8 md:grid-cols-5">
          <section className="md:col-span-2" aria-labelledby="ingredients">
            <Card className="p-6">
              <h2 id="ingredients" className="font-serif text-2xl font-bold">Ingredients</h2>
              <div className="my-4 flex items-center justify-between rounded-2xl bg-primary-soft p-3">
                <span className="flex items-center gap-2 font-semibold"><Users className="h-5 w-5" aria-hidden /> Servings</span>
                <div className="flex items-center gap-3">
                  <Button size="icon" variant="outline" className="h-9 w-9" aria-label="Decrease servings" disabled={current <= 1} onClick={() => setServings(current - 1)}><Minus className="h-4 w-4" /></Button>
                  <span className="w-6 text-center text-lg font-bold" aria-live="polite">{current}</span>
                  <Button size="icon" variant="outline" className="h-9 w-9" aria-label="Increase servings" disabled={current >= 24} onClick={() => setServings(current + 1)}><Plus className="h-4 w-4" /></Button>
                </div>
              </div>
              <ul className="space-y-2">
                {recipe.ingredients.map((ing) => (
                  <li key={ing.id}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl p-2 hover:bg-primary-soft/50">
                      <input type="checkbox" checked={checked.has(ing.id)} onChange={() => toggle(ing.id)} className="mt-1 h-5 w-5 accent-[#b9501f]" />
                      <span className={cn(checked.has(ing.id) && "text-muted line-through")}>
                        <strong>{scaleIngredient(ing, recipe.servings, current)}</strong> {ing.name}
                        {ing.preparationNotes && <span className="text-muted">, {ing.preparationNotes}</span>}
                        {ing.optional && <span className="text-muted"> (optional)</span>}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="mt-6 p-6">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold"><Wrench className="h-5 w-5 text-primary" aria-hidden /> Equipment</h2>
              <ul className="mt-3 list-inside list-disc space-y-1 text-muted">
                {recipe.equipment.map((e) => <li key={e}>{e}</li>)}
              </ul>
            </Card>
          </section>

          <section className="md:col-span-3" aria-labelledby="instructions">
            <h2 id="instructions" className="font-serif text-2xl font-bold">Instructions</h2>
            <ol className="mt-4 space-y-4">
              {recipe.instructions.map((s) => (
                <li key={s.id} className="flex gap-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-white">{s.stepNumber}</span>
                  <div>
                    <p>{s.instruction}</p>
                    <p className="mt-1 text-sm text-muted">~{s.duration} min</p>
                  </div>
                </li>
              ))}
            </ol>
            <Card className="mt-8 bg-primary-soft/60 p-6">
              <h2 className="flex items-center gap-2 font-serif text-xl font-bold"><Lightbulb className="h-5 w-5 text-primary" aria-hidden /> Cooking tips</h2>
              <ul className="mt-3 list-inside list-disc space-y-1">
                {recipe.tips.map((t) => <li key={t}>{t}</li>)}
              </ul>
            </Card>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
