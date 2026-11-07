import type { ChatContext } from "@/types";
import { MockCookingAssistantAgent } from "@/lib/agents/mock-cooking-assistant";
import type { CookingAssistantAgent } from "@/lib/agents/types";

// Replace with an OpenAI-backed agent when OPENAI_API_KEY is configured.
const agent: CookingAssistantAgent = new MockCookingAssistantAgent();

export async function askRemy(question: string, context: ChatContext): Promise<string> {
  return agent.answer(question, context);
}
