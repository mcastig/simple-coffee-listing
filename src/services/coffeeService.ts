import {
  normalizeCoffeeItem,
  type CoffeeItem,
  type RawCoffeeItem,
} from "../types/coffee";

const COFFEE_API_URL =
  "https://raw.githubusercontent.com/devchallenges-io/curriculum/refs/heads/main/4-frontend-libaries/challenges/group_1/data/simple-coffee-listing-data.json";

/**
 * Fetch and normalize the coffee listing.
 *
 * Pure data layer — no React. Throws on network/HTTP/shape errors so the
 * caller (hook or test) decides how to surface them.
 *
 * @param signal Optional AbortSignal to cancel an in-flight request.
 */
export const fetchCoffeeList = async (
  signal?: AbortSignal,
): Promise<CoffeeItem[]> => {
  const response = await fetch(COFFEE_API_URL, { signal });

  if (!response.ok) {
    throw new Error(
      `Failed to load coffees: ${response.status} ${response.statusText}`,
    );
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected API response: expected an array of coffees.");
  }

  return (data as RawCoffeeItem[]).map(normalizeCoffeeItem);
};
