/**
 * Domain types for the Simple Coffee Listing.
 *
 * The live API is inconsistent: `rating` arrives as a number, a numeric
 * *string* ("4.65"), or `null`. We isolate that mess in `RawCoffeeItem`
 * (the wire shape) and expose a clean, trustworthy `CoffeeItem` to the UI.
 */

/** Exact shape the API sends — intentionally loose to mirror reality. */
export interface RawCoffeeItem {
  id: number;
  name: string;
  image: string;
  /** Currency-prefixed string, e.g. "$5.20". */
  price: string;
  /** number | numeric string | null in the live data. */
  rating: number | string | null;
  votes: number;
  popular: boolean;
  available: boolean;
}

/** Normalized shape every component can rely on. */
export interface CoffeeItem {
  id: number;
  name: string;
  image: string;
  price: string;
  /** Always a number or `null` — never a string, never undefined. */
  rating: number | null;
  votes: number;
  popular: boolean;
  available: boolean;
}

/** A coffee has a usable rating only when it has both a score and votes. */
export const hasRating = (coffee: CoffeeItem): boolean =>
  coffee.rating !== null && coffee.votes > 0;

/** Coerce the loose API `rating` into a strict `number | null`. */
const normalizeRating = (rating: RawCoffeeItem["rating"]): number | null => {
  if (rating === null) return null;
  const value = typeof rating === "string" ? Number(rating) : rating;
  return Number.isFinite(value) ? value : null;
};

/** Map a single raw API record to a clean domain object. */
export const normalizeCoffeeItem = (raw: RawCoffeeItem): CoffeeItem => ({
  ...raw,
  rating: normalizeRating(raw.rating),
});
