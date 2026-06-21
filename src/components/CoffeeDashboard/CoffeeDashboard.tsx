import type { CSSProperties } from "react";
import { useCoffeeList } from "../../hooks/useCoffeeList";
import { useCoffeeFilter } from "../../hooks/useCoffeeFilter";
import { CoffeeCard } from "../CoffeeCard/CoffeeCard";
import { CoffeeFilterTabs } from "../CoffeeFilterTabs/CoffeeFilterTabs";
import bgCafe from "../../assets/bg-cafe.jpg";
import swirl from "../../assets/vector.svg";
import "./CoffeeDashboard.css";

// Background images are passed as CSS variables so Vite resolves the bundled,
// base-aware asset URLs (the CSS only references the custom properties).
// The URLs are quoted because Vite inlines small SVGs as data URIs that
// contain single quotes, which would be invalid inside an unquoted url().
const dashboardStyle = {
  "--dashboard-bg": `url("${bgCafe}")`,
  "--dashboard-swirl": `url("${swirl}")`,
} as CSSProperties;

/**
 * Container/page component. Owns the view state (loading, error, active
 * filter) by composing `useCoffeeList` (data) and `useCoffeeFilter`
 * (derived view), and renders the listing panel.
 */
export const CoffeeDashboard = () => {
  const { coffees, isLoading, error, reload } = useCoffeeList();
  const { filter, setFilter, visibleCoffees } = useCoffeeFilter(coffees);

  return (
    <main className="dashboard" style={dashboardStyle}>
      <section className="dashboard__panel" aria-labelledby="dashboard-title">
        <header className="dashboard__intro">
          <h1 id="dashboard-title" className="dashboard__title">
            Our Collection
          </h1>
          <p className="dashboard__description">
            Introducing our Coffee Collection, a selection of unique coffees
            from different roast types and origins, expertly roasted in small
            batches and shipped fresh weekly.
          </p>
          <CoffeeFilterTabs active={filter} onChange={setFilter} />
        </header>

        {isLoading && (
          <p className="dashboard__status" role="status">
            Loading coffees…
          </p>
        )}

        {error && !isLoading && (
          <div className="dashboard__status" role="alert">
            <p>{error}</p>
            <button
              type="button"
              className="dashboard__retry"
              onClick={reload}
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !error && visibleCoffees.length === 0 && (
          <p className="dashboard__status" role="status">
            No coffees match this filter.
          </p>
        )}

        {!isLoading && !error && visibleCoffees.length > 0 && (
          <ul className="dashboard__grid">
            {visibleCoffees.map((coffee) => (
              <li key={coffee.id} className="dashboard__grid-item">
                <CoffeeCard coffee={coffee} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
};
