"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MessageCircleQuestion, Pause, Play, RotateCcw, Timer, Volume2, VolumeX } from "lucide-react";
import { ChatPanel } from "@/components/chat/chat-panel";
import { RecipeLoading, RecipeNotFound } from "@/components/layout/not-found-recipe";
import { Logo } from "@/components/layout/navbar";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";
import { formatTimer, scaleIngredient } from "@/lib/utils/format";
import { useRecipe } from "@/lib/utils/use-recipe";
import { getSession, saveSession } from "@/lib/services/storage";
import { speak, stopSpeaking, voiceOutputSupported } from "@/lib/services/voice";
import type { ChatMessage, CookingSession, Recipe } from "@/types";

export function CookingMode({ id }: { id: string }) {
  const { recipe, loading } = useRecipe(id);
  if (loading) return <RecipeLoading />;
  if (!recipe) return <RecipeNotFound />;
  return <CookingSessionView recipe={recipe} />;
}

function newSession(recipe: Recipe): CookingSession {
  return {
    id: crypto.randomUUID(),
    recipeId: recipe.id,
    currentStep: 0,
    completedSteps: [],
    servings: recipe.servings,
    startedAt: new Date().toISOString(),
    conversationHistory: [],
  };
}

function CookingSessionView({ recipe }: { recipe: Recipe }) {
  const [session, setSession] = useState<CookingSession>(() => {
    const stored = getSession(recipe.id);
    if (stored && stored.currentStep < recipe.instructions.length) return stored;
    return newSession(recipe);
  });
  const [paused, setPaused] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [voiceGuide, setVoiceGuide] = useState(false);
  const [finished, setFinished] = useState(false);

  const total = recipe.instructions.length;
  const step = recipe.instructions[session.currentStep];
  const stepIngredients = step.ingredients
    .map((iid) => recipe.ingredients.find((i) => i.id === iid))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  useEffect(() => { saveSession(session); }, [session]);

  useEffect(() => {
    if (voiceGuide && !paused) speak(`Step ${step.stepNumber}. ${step.instruction}`);
    return () => stopSpeaking();
  }, [voiceGuide, paused, step]);

  const go = useCallback((delta: number) => {
    setSession((s) => {
      const next = Math.min(Math.max(s.currentStep + delta, 0), total - 1);
      const completed = delta > 0 && !s.completedSteps.includes(s.currentStep)
        ? [...s.completedSteps, s.currentStep] : s.completedSteps;
      return { ...s, currentStep: next, completedSteps: completed };
    });
  }, [total]);

  function finish() {
    setSession((s) => ({ ...s, completedSteps: Array.from(new Set([...s.completedSteps, s.currentStep])) }));
    setFinished(true);
  }

  function restart() {
    setSession({ ...newSession(recipe), servings: session.servings });
    setFinished(false);
  }

  const setMessages = (conversationHistory: ChatMessage[]) =>
    setSession((s) => ({ ...s, conversationHistory }));

  if (finished) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-5 p-6 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white"><Check className="h-10 w-10" aria-hidden /></span>
        <h1 className="font-serif text-4xl font-bold">Bon appétit!</h1>
        <p className="max-w-md text-lg text-muted">You cooked {recipe.title}. Nicely done, chef.</p>
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={restart}><RotateCcw className="h-5 w-5" aria-hidden /> Cook again</Button>
          <Link href="/library" className={buttonVariants({ size: "lg" })}>My recipes</Link>
        </div>
      </main>
    );
  }

  const isLast = session.currentStep === total - 1;

  return (
    <div className={cn("flex min-h-screen flex-col transition-[padding] md:pr-0", chatOpen && "md:pr-[26rem]")}>
      <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
        <Logo />
        <Link href={`/recipes/${recipe.id}`} className="text-sm font-medium text-primary hover:underline">Exit cooking mode</Link>
      </header>

      <div className="px-4 pt-4 sm:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold">
            <span>Step {session.currentStep + 1} of {total}</span>
            <span className="text-muted">{recipe.title} · {session.servings} servings</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-primary-soft" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={session.currentStep + 1} aria-label="Cooking progress">
            <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${((session.currentStep + 1) / total) * 100}%` }} />
          </div>
        </div>
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-5 px-4 py-6 sm:px-8">
        {paused && (
          <div role="status" className="rounded-2xl bg-primary-soft p-3 text-center font-semibold text-primary-dark">
            Paused — take your time. Resume when you&apos;re ready.
          </div>
        )}
        <Card className={cn("p-6 sm:p-10", paused && "opacity-60")}>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">Step {step.stepNumber} · about {step.duration} min</p>
          <p className="font-serif text-2xl font-semibold leading-snug sm:text-4xl">{step.instruction}</p>
          {step.tips?.map((t) => <p key={t} className="mt-4 rounded-2xl bg-primary-soft/60 p-3 text-base">💡 {t}</p>)}
        </Card>

        {stepIngredients.length > 0 && (
          <Card className="p-5">
            <h2 className="mb-2 font-bold">You&apos;ll need</h2>
            <ul className="flex flex-wrap gap-2">
              {stepIngredients.map((ing) => (
                <li key={ing.id} className="rounded-full bg-primary-soft px-4 py-2 text-base">
                  <strong>{scaleIngredient(ing, recipe.servings, session.servings)}</strong> {ing.name}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <StepTimer key={step.id} minutes={step.duration} paused={paused} />

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setPaused(!paused)} aria-pressed={paused}>
            {paused ? <Play className="h-5 w-5" aria-hidden /> : <Pause className="h-5 w-5" aria-hidden />}
            {paused ? "Resume" : "Pause"}
          </Button>
          <Button variant="outline" size="lg" className="flex-1" onClick={() => setVoiceGuide(!voiceGuide)} aria-pressed={voiceGuide} disabled={!voiceOutputSupported()} title={voiceOutputSupported() ? undefined : "Voice guidance isn't supported in this browser"}>
            {voiceGuide ? <Volume2 className="h-5 w-5" aria-hidden /> : <VolumeX className="h-5 w-5" aria-hidden />}
            Voice guidance {voiceGuide ? "on" : "off"}
          </Button>
          <Button variant="secondary" size="lg" className="flex-1" onClick={() => setChatOpen(true)}>
            <MessageCircleQuestion className="h-5 w-5" aria-hidden /> Ask Remy
          </Button>
        </div>
      </main>

      <nav className="sticky bottom-0 border-t border-border bg-card p-4" aria-label="Step navigation">
        <div className="mx-auto flex max-w-3xl gap-3">
          <Button variant="outline" size="lg" className="h-16 flex-1 text-lg" onClick={() => go(-1)} disabled={session.currentStep === 0}>
            <ArrowLeft className="h-6 w-6" aria-hidden /> Previous
          </Button>
          {isLast ? (
            <Button size="lg" className="h-16 flex-1 text-lg" onClick={finish}><Check className="h-6 w-6" aria-hidden /> Finish</Button>
          ) : (
            <Button size="lg" className="h-16 flex-1 text-lg" onClick={() => go(1)}>Next <ArrowRight className="h-6 w-6" aria-hidden /></Button>
          )}
        </div>
      </nav>

      {chatOpen && (
        <ChatPanel
          recipe={recipe}
          currentStep={session.currentStep}
          completedSteps={session.completedSteps}
          servings={session.servings}
          messages={session.conversationHistory}
          onMessages={setMessages}
          onClose={() => setChatOpen(false)}
        />
      )}
    </div>
  );
}

function StepTimer({ minutes, paused }: { minutes: number; paused: boolean }) {
  const [on, setOn] = useState(false);
  const [remaining, setRemaining] = useState(minutes * 60);

  useEffect(() => {
    if (!on || paused) return;
    const t = setInterval(() => {
      setRemaining((r) => Math.max(r - 1, 0));
    }, 1000);
    return () => clearInterval(t);
  }, [on, paused]);

  const running = on && remaining > 0;

  return (
    <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="flex items-center gap-3">
        <Timer className="h-6 w-6 text-primary" aria-hidden />
        <span className="font-mono text-3xl font-bold">{formatTimer(remaining)}</span>
        {on && remaining === 0 && <span role="status" className="font-semibold text-primary">Time&apos;s up!</span>}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => setOn(!running)} disabled={remaining === 0}>{running ? "Stop timer" : "Start timer"}</Button>
        <Button variant="ghost" onClick={() => { setOn(false); setRemaining(minutes * 60); }}>Reset</Button>
      </div>
    </Card>
  );
}
