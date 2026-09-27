# GitHub Copilot Instructions for bulletproof-react

## Project profile

This repository is a React + TypeScript application using Vite, React Router, TanStack Query, Redux-like state patterns through Zustand, MSW for API mocking, and TailwindCSS for styling.

## Architectural guidance

- Keep features organized by domain under `src/features`.
- Keep app-level routing and providers under `src/app`.
- Put shared app infrastructure in `src/lib`.
- Reuse design-system primitives in `src/components` rather than duplicating patterns.
- Use `@/` imports for code inside `src`.
- Follow the existing folder conventions when adding new screens or API modules.

## Code quality rules

- Prefer explicit TypeScript types and small, focused functions.
- Avoid broad refactors unrelated to the task.
- Prefer existing abstractions over introducing new ones.
- Keep components composable and readable.
- Match the current styling approach: Tailwind utility classes and consistent UI composition.

## Validation expectations

Before finishing work, run the relevant checks:

```bash
npm run check-types
npm run lint
npm run test -- --run
```

If browser behavior is affected, consider Playwright coverage as well.

## Testing philosophy

- Test behavior and user-facing outcomes.
- Avoid mock-only assertions that do not verify real app behavior.
- Use the repo’s shared test helpers in `src/testing`.
- Keep tests close to the feature they describe.

## Delivery standard

When proposing or implementing a change, explain:

1. The affected feature or route.
2. The implementation approach.
3. The validation command(s) used.

Keep changes aligned with the repository's existing architecture and conventions.

## Issue-driven delivery

For work requested from a Jira or GitHub issue, use the `Issue Pipeline` custom agent in `.github/agents/issue-pipeline.agent.md`. It coordinates the issue planner, implementation, quality gate, preview deployment, and CI repair agents. Follow `.github/issue-pipeline.md` for integration prerequisites, approval gates, and the required handoff artifacts. Do not claim an issue was read or a preview was deployed unless the connected integration or deployment provider confirms it.
