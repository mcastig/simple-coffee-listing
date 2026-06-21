# Simple Coffee Listing

A small coffee-collection page that fetches products from a remote API, renders
reusable cards, lets you filter by availability, and supports a light/dark
theme. Built for the [devChallenges](https://devchallenges.io) "Simple Coffee
Listing" challenge.

## Tech stack

- **React 19** + **TypeScript**
- **Vite 8** for dev/build tooling
- Plain **CSS** with **BEM** naming and design tokens (CSS custom properties)
- **Vitest** + **React Testing Library** for tests

## Getting started

```bash
npm install
npm run dev      # start the dev server with HMR
```

| Script             | What it does                                      |
| ------------------ | ------------------------------------------------- |
| `npm run dev`      | Start the Vite dev server                         |
| `npm run build`    | Type-check (`tsc -b`) and produce a prod build    |
| `npm run preview`  | Serve the production build locally                |
| `npm run lint`     | Run ESLint over the repo                          |
| `npm run test`     | Run Vitest in watch mode                          |
| `npm run test:run` | Run the test suite once (CI)                      |

Run with coverage via `npx vitest run --coverage`.

## Architecture

Data flows one way: **service → hooks → container → presentational components.**

```
src/
├── components/
│   ├── CoffeeCard/          # Presentational card (badge, price, rating)
│   ├── CoffeeDashboard/     # Container: owns view state, composes hooks
│   ├── CoffeeFilterTabs/    # Filter controls (All Products / Available Now)
│   └── ThemeToggle/         # Light/dark switch
├── hooks/
│   ├── useCoffeeList.ts     # Fetch lifecycle: loading / error / data + reload
│   ├── useCoffeeFilter.ts   # Memoized, non-mutating filter state
│   └── useTheme.ts          # Theme state, persisted to localStorage
├── lib/
│   └── filterCoffees.ts     # Pure filter function + filter metadata
├── services/
│   └── coffeeService.ts     # Fetches and normalizes the API data
├── styles/
│   └── tokens.css           # Brand palette → semantic tokens (light/dark)
└── types/
    └── coffee.ts            # RawCoffeeItem (wire) → CoffeeItem (domain)
```

### Notable decisions

- **The API is messy, the UI is not.** `rating` arrives as a number, a numeric
  string (`"4.65"`), or `null`. `coffeeService` normalizes the wire shape
  (`RawCoffeeItem`) into a clean domain type (`CoffeeItem`) so components can
  trust `rating: number | null`.
- **Container vs. presentational.** `CoffeeDashboard` is the only component that
  knows hooks exist; cards and tabs receive plain props and own no data.
- **Filtering never mutates** the fetched array — `filterCoffees` is pure and
  wrapped in `useMemo`.
- **Theming is token-only.** Components reference semantic `--color-*` tokens, so
  switching themes just re-points tokens under `[data-theme="light"]`. An inline
  script in `index.html` sets the theme before first paint to avoid a flash.
- **Accessibility:** semantic landmarks and list markup, `aria-pressed` filter
  tabs, decorative icons hidden from screen readers, visible focus rings, and
  `prefers-reduced-motion` support.

## Data source

Products are fetched from the challenge's
[JSON endpoint](https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json).

## Testing

[Vitest](https://vitest.dev) + [React Testing Library](https://testing-library.com/react)
with a jsdom environment. 44 tests cover the data normalizer and service, the
hooks (fetch lifecycle, filtering, theming), every `CoffeeCard` conditional
branch, the filter tabs, and the dashboard's loading/data/empty/error flow (with
a mocked `fetch`).

Coverage is enforced at **100%** (lines, functions, branches, statements) via the
threshold config in `vite.config.ts`. Run `npm run test:run`, or
`npx vitest run --coverage` for the report.
