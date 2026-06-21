import { describe, expect, it } from "vitest";
import {
  hasRating,
  normalizeCoffeeItem,
  type CoffeeItem,
  type RawCoffeeItem,
} from "./coffee";

const rawBase: RawCoffeeItem = {
  id: 1,
  name: "Cappuccino",
  image: "https://example.com/cappuccino.jpg",
  price: "$5.20",
  rating: 4.7,
  votes: 65,
  popular: true,
  available: true,
};

describe("normalizeCoffeeItem", () => {
  it("keeps a numeric rating as-is", () => {
    expect(normalizeCoffeeItem(rawBase).rating).toBe(4.7);
  });

  it("coerces a numeric string rating to a number", () => {
    const result = normalizeCoffeeItem({ ...rawBase, rating: "4.65" });
    expect(result.rating).toBe(4.65);
  });

  it("passes through a null rating", () => {
    const result = normalizeCoffeeItem({ ...rawBase, rating: null });
    expect(result.rating).toBeNull();
  });

  it("treats an unparseable rating as null", () => {
    const result = normalizeCoffeeItem({ ...rawBase, rating: "not-a-number" });
    expect(result.rating).toBeNull();
  });

  it("preserves all other fields unchanged", () => {
    const result = normalizeCoffeeItem(rawBase);
    expect(result).toMatchObject({
      id: 1,
      name: "Cappuccino",
      price: "$5.20",
      votes: 65,
      popular: true,
      available: true,
    });
  });
});

describe("hasRating", () => {
  const item = (overrides: Partial<CoffeeItem>): CoffeeItem => ({
    ...normalizeCoffeeItem(rawBase),
    ...overrides,
  });

  it("is true when rating and votes are present", () => {
    expect(hasRating(item({ rating: 4.7, votes: 65 }))).toBe(true);
  });

  it("is false when rating is null", () => {
    expect(hasRating(item({ rating: null, votes: 65 }))).toBe(false);
  });

  it("is false when there are no votes", () => {
    expect(hasRating(item({ rating: 4.7, votes: 0 }))).toBe(false);
  });
});
