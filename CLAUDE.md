# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

A completed implementation of the devChallenges "Simple Coffee Listing" challenge: a coffee-collection page that fetches products from a remote JSON API, renders reusable cards, filters by availability, and supports a light/dark theme. The original Vite starter content has been fully replaced.

## Commands

- `npm run dev` — start the Vite dev server with HMR
- `npm run build` — type-check the whole project (`tsc -b`) then produce a production build
- `npm run lint` — run ESLint over the repo
- `npm run preview` — serve the production build locally
- `npm run test` — run Vitest in watch mode
- `npm run test:run` — run the test suite once (CI)
- `npx vitest run --coverage` — run tests with a coverage report

## Architecture

Stack: React 19 + TypeScript + Vite 8. Entry point is `index.html` → `src/main.tsx`, which mounts `<App />` into `#root` inside `<StrictMode>`. `App` renders the `ThemeToggle` and the `CoffeeDashboard`.

Data flows one way: **service → hooks → container → presentational components.**

- `services/coffeeService.ts` — framework-free data layer. Fetches the API and normalizes each record. The API is inconsistent: `rating` arrives as a number, a numeric **string** (`"4.65"`), or `null`. The service maps the loose wire shape (`RawCoffeeItem`) into a clean domain type (`CoffeeItem`) where `rating` is always `number | null`. Keep this normalization at the boundary — components must not deal with raw shapes.
- `types/coffee.ts` — `RawCoffeeItem` (wire) and `CoffeeItem` (domain), plus `normalizeCoffeeItem` and the `hasRating` helper (the single source of truth for the "No ratings" branch: `rating !== null && votes > 0`).
- `hooks/` — `useCoffeeList` (fetch lifecycle: loading/error/data + `reload`, aborts on unmount), `useCoffeeFilter` (memoized, non-mutating filter state), `useTheme` (theme state persisted to `localStorage`).
- `lib/filterCoffees.ts` — pure, non-mutating filter function + filter tab metadata.
- `components/` — each component lives in its own folder with a colocated `.tsx`, `.css`, and `.test.tsx`. `CoffeeDashboard` is the only component that knows hooks exist; `CoffeeCard` and `CoffeeFilterTabs` are presentational and receive plain props.

- **TypeScript** uses project references: `tsconfig.json` is a thin root that delegates to `tsconfig.app.json` (browser/`src` code) and `tsconfig.node.json` (Vite config tooling). Edit the relevant child config, not the root. `tsconfig.app.json` includes `vitest/globals` in `types`.
- **Static assets**: imported assets are bundled by Vite; files in `public/` (`favicon.ico`, `bg-cafe.jpg`, `vector.svg`, `star-fill.svg`, `star.svg`) are served from the root path and referenced absolutely, e.g. `src="/star-fill.svg"`.
- **Styling** is plain CSS with **BEM** naming. `src/styles/tokens.css` maps the brand palette to semantic `--color-*` tokens; components reference only the semantic tokens. `src/index.css` holds the global reset, focus ring, and reduced-motion handling. Each component has its own colocated `.css`.

## Theming

Components never hardcode colors — they use semantic tokens. Switching theme just re-points tokens under `[data-theme="light"]` in `tokens.css`. `useTheme` sets `data-theme` on `<html>` and persists the choice; an inline script in `index.html` sets it before first paint to avoid a flash of the wrong theme. First-time visitors get their OS `prefers-color-scheme`.

## Testing

Vitest + React Testing Library, jsdom environment. Setup file `src/test/setup.ts` registers jest-dom matchers. Tests are colocated as `*.test.{ts,tsx}`. Coverage is configured in `vite.config.ts` with **100% thresholds** (lines/functions/branches/statements); `main.tsx`, the test setup, and test files are excluded from the coverage scope. When adding code, add tests to keep coverage at 100% (or it will fail the threshold gate).

## Notes

- The React Compiler is intentionally not enabled.
- ESLint config (`eslint.config.js`) uses the non-type-checked recommended ruleset.
- `npm run build` runs `tsc -b`, which type-checks test files too (they are under `src`), but Vite does not bundle them since they are not imported by the entry.
