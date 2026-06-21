import { describe, expect, it } from "vitest";
import { filterCoffees } from "./filterCoffees";
import type { CoffeeItem } from "../types/coffee";

const make = (id: number, available: boolean): CoffeeItem => ({
  id,
  name: `Coffee ${id}`,
  image: "",
  price: "$1.00",
  rating: 4,
  votes: 10,
  popular: false,
  available,
});

const coffees: CoffeeItem[] = [make(1, true), make(2, false), make(3, true)];

describe("filterCoffees", () => {
  it('returns every item for the "all" filter', () => {
    expect(filterCoffees(coffees, "all")).toHaveLength(3);
  });

  it('returns only available items for the "available" filter', () => {
    const result = filterCoffees(coffees, "available");
    expect(result.map((c) => c.id)).toEqual([1, 3]);
  });

  it("does not mutate the original array", () => {
    const original = [...coffees];
    filterCoffees(coffees, "available");
    expect(coffees).toEqual(original);
  });

  it('returns the same reference for "all" (no needless copy)', () => {
    expect(filterCoffees(coffees, "all")).toBe(coffees);
  });
});
