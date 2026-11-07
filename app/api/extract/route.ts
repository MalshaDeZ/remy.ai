import { NextResponse } from "next/server";
import { extractRecipeFromUrl } from "@/lib/services/recipe-extraction";
import { VideoIngestionError } from "@/lib/services/video-ingestion";

export async function POST(request: Request) {
  let body: { url?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  if (typeof body.url !== "string" || !body.url.trim()) {
    return NextResponse.json({ error: "Please provide a video URL." }, { status: 400 });
  }
  try {
    // Small delay so the prototype's progress UI is visible
    await new Promise((r) => setTimeout(r, 800));
    const result = await extractRecipeFromUrl(body.url);
    return NextResponse.json(result);
  } catch (err) {
    if (err instanceof VideoIngestionError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Remy couldn't extract a recipe from this video. Please try again." },
      { status: 500 }
    );
  }
}
