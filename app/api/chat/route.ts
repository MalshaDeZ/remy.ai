import { NextResponse } from "next/server";
import { askRemy } from "@/lib/services/assistant";
import type { ChatContext } from "@/types";

export async function POST(request: Request) {
  let body: { question?: unknown; context?: ChatContext };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }
  const { question, context } = body;
  if (
    typeof question !== "string" ||
    !question.trim() ||
    question.length > 1000 ||
    !context?.recipe?.instructions?.length ||
    !Number.isInteger(context.currentStep)
  ) {
    return NextResponse.json({ error: "Invalid question or context." }, { status: 400 });
  }
  try {
    const reply = await askRemy(question.trim(), {
      ...context,
      history: Array.isArray(context.history) ? context.history : [],
      completedSteps: Array.isArray(context.completedSteps) ? context.completedSteps : [],
    });
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "Remy is having trouble right now." }, { status: 500 });
  }
}
