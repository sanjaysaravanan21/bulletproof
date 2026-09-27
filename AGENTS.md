# AGENTS.md

This repository is a React + TypeScript application built with Vite, TanStack Query, React Router, Zustand, MSW, and Tailwind. The goal is to keep changes consistent with the existing architecture and quality bar.

## Project architecture

- `src/app/`: app shell, providers, and routing configuration.
- `src/features/*/`: feature-specific modules with API and components grouped by domain.
- `src/lib/`: shared infrastructure such as auth, client setup, authorization, and query config.
- `src/components/`: reusable UI primitives and layout wrappers.
- `src/testing/`: shared test utilities, MSW setup, and data generators.
- `src/config/`: environment and path configuration.
- `src/utils/`: small, reusable helper functions.

## Core conventions

- Use TypeScript and keep types explicit where they add clarity.
- Prefer the path alias `@/` instead of relative imports for src files.
- Favor feature-first organization; do not scatter unrelated logic across the app.
- Reuse existing UI primitives and shared hooks before creating new abstractions.
- Keep business logic close to the feature that owns it.
- Use existing patterns in the repo for data fetching, form handling, routing, and auth.

## Coding expectations

- Keep changes small and targeted.
- Preserve existing naming and folder conventions.
- When implementing a feature, update the route, feature module, and any relevant tests together.
- Avoid introducing new state libraries or frameworks unless the task specifically requires them.
- Keep Tailwind-driven styling consistent with the current component patterns.
- Prefer composition over bespoke logic when a reusable pattern already exists.

## Validation workflow

Run the smallest relevant verification before considering a task complete:

- `npm run check-types`
- `npm run lint`
- `npm run test -- --run`

For feature work that touches flows or browser behavior, also consider:

- `npm run test-e2e`

## Testing expectations

- Prefer real behavior over mocked assertions.
- Add or update unit tests when fixing bugs or adding features.
- Use the existing testing setup under `src/testing` and avoid custom test-only production code.
- Validate the behavior that users actually depend on rather than implementation details.

## Agentic workflow for Copilot

When responding to a request:

1. Read the narrowest relevant files first.
2. Identify the domain, route, or feature impacted.
3. Make the minimal fix that matches existing patterns.
4. Verify with the relevant command(s).
5. Summarize what changed and which validation checks ran.

If a request is ambiguous, first clarify the intended behavior, affected feature, and acceptance criteria before patching code.

## Commands

```bash
npm install
npm run dev
npm run build
npm run test -- --run
npm run check-types
npm run lint
```
