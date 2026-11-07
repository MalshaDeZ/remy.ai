import Link from "next/link";
import { Loader2, SearchX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function RecipeLoading() {
  return (
    <div className="flex flex-1 items-center justify-center p-10" role="status">
      <Loader2 className="h-8 w-8 animate-spin text-primary" aria-label="Loading" />
    </div>
  );
}

export function RecipeNotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-10 text-center">
      <SearchX className="h-12 w-12 text-primary" aria-hidden />
      <h1 className="font-serif text-2xl font-bold">We couldn&apos;t find that recipe</h1>
      <p className="text-muted">It may have been removed or saved on another device.</p>
      <Link href="/" className={buttonVariants()}>Back home</Link>
    </div>
  );
}
