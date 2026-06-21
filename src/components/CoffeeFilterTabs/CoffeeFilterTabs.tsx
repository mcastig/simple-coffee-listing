import { COFFEE_FILTERS, type CoffeeFilter } from "../../lib/filterCoffees";
import "./CoffeeFilterTabs.css";

interface CoffeeFilterTabsProps {
  active: CoffeeFilter;
  onChange: (filter: CoffeeFilter) => void;
}

/** Presentational filter controls: "All Products" / "Available Now". */
export const CoffeeFilterTabs = ({ active, onChange }: CoffeeFilterTabsProps) => (
  <div className="coffee-tabs" role="group" aria-label="Filter coffees">
    {COFFEE_FILTERS.map(({ value, label }) => {
      const isActive = value === active;
      return (
        <button
          key={value}
          type="button"
          className={
            isActive ? "coffee-tabs__tab coffee-tabs__tab--active" : "coffee-tabs__tab"
          }
          aria-pressed={isActive}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      );
    })}
  </div>
);
