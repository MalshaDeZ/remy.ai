import Link from "next/link";
import { ChefHat } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white">
        <ChefHat className="h-5 w-5" aria-hidden />
      </span>
      Remy AI
    </Link>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Logo />
        <div className="flex items-center gap-1 text-sm font-medium sm:gap-6">
          <Link href="/#how-it-works" className="hidden hover:text-primary sm:block">How it works</Link>
          <Link href="/#features" className="hidden hover:text-primary sm:block">Features</Link>
          <Link href="/library" className="rounded-full bg-primary-soft px-4 py-2 text-primary-dark hover:bg-[#f0d0b9]">
            My Recipes
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <Logo />
        <p>Every cook deserves a little chef.</p>
        <p>© {new Date().getFullYear()} Remy AI</p>
      </div>
    </footer>
  );
}
