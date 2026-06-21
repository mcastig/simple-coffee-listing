import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCoffeeList } from "./coffeeService";
import type { RawCoffeeItem } from "../types/coffee";

const raw: RawCoffeeItem[] = [
  {
    id: 1,
    name: "Cappuccino",
    image: "https://example.com/c.jpg",
    price: "$5.20",
    rating: "4.65",
    votes: 65,
    popular: true,
    available: true,
  },
];

const mockFetch = (impl: Partial<Response>) =>
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(impl as Response));

afterEach(() => vi.unstubAllGlobals());

describe("fetchCoffeeList", () => {
  it("fetches and normalizes the coffee list", async () => {
    mockFetch({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve(raw),
    });

    const result = await fetchCoffeeList();
    expect(result).toHaveLength(1);
    // The "4.65" string rating is normalized to a number.
    expect(result[0].rating).toBe(4.65);
  });

  it("forwards the abort signal to fetch", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve(raw),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const controller = new AbortController();
    await fetchCoffeeList(controller.signal);

    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {
      signal: controller.signal,
    });
  });

  it("throws with status text on a non-ok response", async () => {
    mockFetch({
      ok: false,
      status: 500,
      statusText: "Server Error",
      json: () => Promise.resolve(null),
    });

    await expect(fetchCoffeeList()).rejects.toThrow(
      "Failed to load coffees: 500 Server Error",
    );
  });

  it("throws when the payload is not an array", async () => {
    mockFetch({
      ok: true,
      status: 200,
      statusText: "OK",
      json: () => Promise.resolve({ not: "an array" }),
    });

    await expect(fetchCoffeeList()).rejects.toThrow(
      "Unexpected API response: expected an array of coffees.",
    );
  });
});
