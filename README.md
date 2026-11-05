# Remy AI

> Every cook deserves a little chef.

Remy AI turns cooking videos (YouTube, Instagram Reels, TikTok) into structured recipes and guides you through cooking with an interactive, context-aware AI sous-chef.

This is a working prototype. **No API keys are required** — recipe extraction and the Ask Remy assistant use mock services with realistic sample recipes.

## Features

- Landing page with video URL input, example recipes, features and how-it-works
- Video-to-recipe flow with URL validation, progress states and error handling
- Recipe details: ingredient checklist, serving-size scaling, equipment, steps, tips, save recipe
- Cooking Mode: large step view, progress bar, step ingredients, optional timer, pause/resume, previous/next, session persistence
- Ask Remy: chat drawer (bottom sheet on mobile) with suggested questions. Each question is sent with the full recipe, current step, completed steps, servings and conversation history
- Voice prototype: browser speech recognition (mic) and speech synthesis (read aloud, voice guidance) where supported
- Recipe library: search, categories, saved and recent recipes (localStorage)

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm start`, `npm run lint`.

Optionally copy `.env.example` to `.env.local`. `OPENAI_API_KEY` and `DATABASE_URL` are not used by the prototype.

## Project structure

```
app/            Routes (landing, /recipes/[id], /cooking/[id], /library) and API routes (/api/extract, /api/chat)
components/     UI by area: landing, recipe, cooking, chat, layout, ui
lib/agents/     Agent interfaces (types.ts) and mock implementations
lib/services/   Video ingestion, extraction pipeline, assistant, storage, voice
lib/utils/      Helpers (formatting, scaling, URL parsing, hooks)
types/          Shared TypeScript models (Recipe, Ingredient, CookingStep, CookingSession, ChatMessage)
data/           Sample recipes
prisma/         Prisma schema prepared for PostgreSQL persistence
```

## AI architecture

`lib/agents/types.ts` defines the agent interfaces: `VideoAnalysisAgent`, `RecipeExtractionAgent`, `RecipeValidationAgent`, `CookingAssistantAgent` and `CookingGuidanceAgent`. The prototype ships mock implementations; replace them in `lib/services/recipe-extraction.ts` and `lib/services/assistant.ts` with LLM-backed agents (e.g. OpenAI) to go live.

Video ingestion (`lib/services/video-ingestion.ts`) only validates URLs. It does not download or scrape videos; a production pipeline should use authorised platform APIs, user-provided files or other permitted sources.

## Persistence and auth

Recipes, saved items and cooking sessions are stored in `localStorage` (`lib/services/storage.ts`). `prisma/schema.prisma` contains a PostgreSQL schema ready for a future migration (install `prisma` and `@prisma/client`, set `DATABASE_URL`). Models include optional `userId` fields so authentication can be added later.
