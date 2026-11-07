import { RecipeDetail } from "@/components/recipe/recipe-detail";

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecipeDetail id={id} />;
}
