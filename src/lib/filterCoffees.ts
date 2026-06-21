import type { CoffeeItem } from "../types/coffee";

/** The two filter controls at the top of the listing. */
export type CoffeeFilter = "all" | "available";

/** UI metadata for rendering the filter tabs in order. */
export const COFFEE_FILTERS: ReadonlyArray<{
  value: CoffeeFilter;
  label: string;
}> = [
  { value: "all", label: "All Products" },
  { value: "available", label: "Available Now" },
];

/**
 * Pure, non-mutating filter. Returns the same reference for "all" (no work
 * needed) or a new array for "available" — never modifies the input.
 */
export const filterCoffees = (
  coffees: CoffeeItem[],
  filter: CoffeeFilter,
): CoffeeItem[] =>
  filter === "available"
    ? coffees.filter((coffee) => coffee.available)
    : coffees;
