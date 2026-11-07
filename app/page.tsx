import { ChefHat, Link2, MessageCircleHeart, Mic, ScanSearch, Timer, UtensilsCrossed } from "lucide-react";
import { Footer, Navbar } from "@/components/layout/navbar";
import { VideoUrlForm } from "@/components/landing/video-url-form";
import { RecipeCard } from "@/components/recipe/recipe-card";
import { Card } from "@/components/ui/card";
import { SAMPLE_RECIPES } from "@/data/recipes";

const FEATURES = [
  { icon: ScanSearch, title: "Video to recipe", text: "Ingredients, quantities, steps and timestamps — pulled from the video and neatly structured." },
  { icon: UtensilsCrossed, title: "Guided Cooking Mode", text: "Big, readable steps with the exact ingredients you need, right when you need them." },
  { icon: MessageCircleHeart, title: "Ask Remy anything", text: "Too watery? Too salty? Out of butter? Remy knows your recipe and your current step." },
  { icon: Timer, title: "Built-in timers", text: "Optional step timers so you can focus on the pan, not the clock." },
  { icon: Mic, title: "Hands-free voice", text: "Speak your questions and have Remy read answers aloud while your hands are messy." },
  { icon: ChefHat, title: "Scale servings", text: "Cooking for two or ten? Ingredient quantities adjust automatically." },
];

const STEPS = [
  { n: 1, title: "Paste a video link", text: "From YouTube, Instagram Reels or TikTok." },
  { n: 2, title: "Get your recipe", text: "Remy turns it into a clear, structured recipe." },
  { n: 3, title: "Cook with Remy", text: "Follow step by step and ask for help any time." },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary-soft blur-3xl" aria-hidden />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-4 pb-20 pt-16 text-center sm:px-6 sm:pt-24">
            <span className="mb-5 rounded-full bg-primary-soft px-4 py-1.5 text-sm font-semibold text-primary-dark">
              Your personal AI sous-chef
            </span>
            <h1 className="font-serif text-4xl font-bold leading-tight sm:text-6xl">
              Every cook deserves a <span className="text-primary">little chef.</span>
            </h1>
            <p className="mb-10 mt-5 max-w-2xl text-lg text-muted">
              Turn your favourite cooking videos into recipes, and cook confidently with your personal AI sous-chef.
            </p>
            <VideoUrlForm />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6" aria-labelledby="examples">
          <h2 id="examples" className="font-serif text-3xl font-bold">Recipes Remy has cooked up</h2>
          <p className="mb-8 mt-2 text-muted">Explore a few examples and try Cooking Mode.</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SAMPLE_RECIPES.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>

        <section id="features" className="bg-card py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="mb-10 text-center font-serif text-3xl font-bold">Everything you need in the kitchen</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map(({ icon: Icon, title, text }) => (
                <Card key={title} className="p-6">
                  <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-lg font-bold">{title}</h3>
                  <p className="mt-1 text-muted">{text}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="mb-10 text-center font-serif text-3xl font-bold">How it works</h2>
          <ol className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <li key={s.n} className="text-center">
                <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">{s.n}</span>
                <h3 className="text-lg font-bold">{s.title}</h3>
                <p className="mt-1 text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
          <p className="mt-10 flex items-center justify-center gap-2 text-sm text-muted">
            <Link2 className="h-4 w-4" aria-hidden /> Remy only works with videos you&apos;re allowed to use.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}
