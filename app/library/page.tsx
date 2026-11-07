import { Footer, Navbar } from "@/components/layout/navbar";
import { RecipeLibrary } from "@/components/recipe/recipe-library";

export const metadata = { title: "My Recipes — Remy AI" };

export default function LibraryPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
        <RecipeLibrary />
      </main>
      <Footer />
    </>
  );
}
