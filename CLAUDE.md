# CLAUDE.md

## Project Overview

Packing Assistant — a full-stack TypeScript web app that generates personalized packing lists and daily clothing suggestions based on weather forecasts, trip duration, activities, and luggage constraints.

## Tech Stack

- **Frontend:** React 18 + TypeScript, Vite, Tailwind CSS, Radix UI / shadcn/ui, Wouter (routing), React Query, React Hook Form + Zod, Framer Motion
- **Backend:** Express.js + TypeScript, Drizzle ORM, SQLite (dev) / PostgreSQL via Neon (prod)
- **APIs:** Open-Meteo (weather), OpenAI GPT-4 (optional AI recommendations)

## Project Structure

```
client/src/           # React frontend
  pages/              # Route pages (TripDetails, Index, NotFound)
  components/         # Reusable components
  components/ui/      # shadcn/ui primitives
  lib/                # API clients and utilities
  hooks/              # Custom React hooks
server/               # Express backend
  routes.ts           # API route definitions
  weatherService.ts   # Weather API + caching
  smartRecommendationEngine.ts  # Core recommendation logic
  aiRecommendationService.ts    # Optional OpenAI integration
  storage.ts          # Database access layer
shared/               # Code shared between client & server
  schema.ts           # Zod schemas and DB schema (Drizzle)
```

## Commands

- `npm run dev` — Start dev server (port 3000)
- `npm run build` — Build frontend (Vite) and backend (esbuild) to `dist/`
- `npm start` — Run production server from `dist/`
- `npm run check` — TypeScript type checking (`tsc --noEmit`)
- `npm run db:push` — Push Drizzle schema changes to database

## Path Aliases

- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`

## Coding Conventions

- **TypeScript strict mode** enabled — no `any` types without justification
- **Components:** PascalCase filenames and exports
- **Functions/variables:** camelCase
- **Database columns:** snake_case
- **Async/await** over `.then()` chains
- **Zod validation** on all API endpoints and form inputs
- **Error handling:** Custom error classes (WeatherApiError, AgentRecommendationApiError)
- **Styling:** Tailwind CSS utility classes with `cn()` helper for conditional classes
- **shadcn/ui style:** new-york variant with CSS variables for theming

## Architecture Notes

- Shared Zod schemas in `shared/schema.ts` serve as both runtime validation and Drizzle ORM table definitions
- Weather data is cached in the database by location/date to reduce API calls
- The recommendation engine (`smartRecommendationEngine.ts`) is the core business logic — dataset-driven, not AI-dependent
- AI recommendations via OpenAI are optional and additive; the app works fully without `OPENAI_API_KEY`
- Multi-destination trips use a timeline-based approach with per-destination weather and suggestions

## Environment Variables

- `NODE_ENV` — `development` or `production`
- `PORT` — Server port (default 3000)
- `OPENAI_API_KEY` — Optional, enables AI-enhanced recommendations
- `DATABASE_URL` — PostgreSQL connection string (production only)

## Testing

No test framework is currently configured. Type safety is enforced via `tsc` strict mode and Zod runtime validation.

## Deployment

**Production build and start:**
```bash
npm run build && npm start
# or
node start-prod.js   # builds then starts in one step
```

**Environment variables required for production:**
- `DATABASE_URL` — PostgreSQL connection string (Neon)
- `NODE_ENV=production`
- `OPENAI_API_KEY` — optional

**Replit deployment note:** `.replit` deployment section must use `npm run build && npm start`, not `npm run dev`.
