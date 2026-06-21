import { useMemo, useState } from "react";
import { filterCoffees, type CoffeeFilter } from "../lib/filterCoffees";
import type { CoffeeItem } from "../types/coffee";

interface UseCoffeeFilterResult {
  filter: CoffeeFilter;
  setFilter: (filter: CoffeeFilter) => void;
  visibleCoffees: CoffeeItem[];
}

/**
 * Owns the active filter and derives the visible list with `useMemo`,
 * recomputing only when the source data or the filter changes. The original
 * `coffees` array is never mutated.
 */
export const useCoffeeFilter = (
  coffees: CoffeeItem[],
): UseCoffeeFilterResult => {
  const [filter, setFilter] = useState<CoffeeFilter>("all");

  const visibleCoffees = useMemo(
    () => filterCoffees(coffees, filter),
    [coffees, filter],
  );

  return { filter, setFilter, visibleCoffees };
};
