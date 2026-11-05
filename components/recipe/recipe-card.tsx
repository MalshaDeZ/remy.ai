import Link from "next/link";
import { Clock, Flame } from "lucide-react";
import { Badge, Card } from "@/components/ui/card";
import { formatMinutes } from "@/lib/utils/format";
import type { Recipe } from "@/types";

export function RecipeCard({ recipe }: { recipe: Recipe }) {
  return (
    <Link href={`/recipes/${recipe.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-transform group-hover:-translate-y-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={recipe.thumbnailUrl} alt="" className="aspect-video w-full object-cover" />
        <div className="space-y-2 p-5">
          <Badge>{recipe.category}</Badge>
          <h3 className="font-serif text-xl font-bold">{recipe.title}</h3>
          <p className="line-clamp-2 text-sm text-muted">{recipe.description}</p>
          <div className="flex items-center gap-4 pt-1 text-sm text-muted">
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" aria-hidden /> {formatMinutes(recipe.totalTime)}</span>
            <span className="flex items-center gap-1"><Flame className="h-4 w-4" aria-hidden /> {recipe.difficulty}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
