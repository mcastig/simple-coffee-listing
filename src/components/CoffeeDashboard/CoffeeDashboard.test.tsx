import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoffeeDashboard } from "./CoffeeDashboard";
import type { RawCoffeeItem } from "../../types/coffee";

const sample: RawCoffeeItem[] = [
  {
    id: 1,
    name: "Cappuccino",
    image: "https://example.com/cappuccino.jpg",
    price: "$5.20",
    rating: 4.7,
    votes: 65,
    popular: true,
    available: true,
  },
  {
    id: 2,
    name: "Chocolate Coffee",
    image: "https://example.com/chocolate.jpg",
    price: "$4.00",
    rating: 4.65,
    votes: 122,
    popular: false,
    available: false,
  },
];

const mockFetch = (body: unknown, ok = true) =>
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue({
      ok,
      status: ok ? 200 : 500,
      statusText: ok ? "OK" : "Server Error",
      json: () => Promise.resolve(body),
    } as Response),
  );

afterEach(() => vi.unstubAllGlobals());

describe("CoffeeDashboard", () => {
  it("shows a loading state, then renders the fetched coffees", async () => {
    mockFetch(sample);
    render(<CoffeeDashboard />);

    expect(screen.getByText("Loading coffees…")).toBeInTheDocument();
    expect(await screen.findByText("Cappuccino")).toBeInTheDocument();
    expect(screen.getByText("Chocolate Coffee")).toBeInTheDocument();
  });

  it('hides unavailable coffees under the "Available Now" filter', async () => {
    mockFetch(sample);
    const user = userEvent.setup();
    render(<CoffeeDashboard />);

    await screen.findByText("Chocolate Coffee");
    await user.click(screen.getByRole("button", { name: "Available Now" }));

    expect(screen.getByText("Cappuccino")).toBeInTheDocument();
    expect(screen.queryByText("Chocolate Coffee")).not.toBeInTheDocument();
  });

  it("shows an empty-state message when no coffees match", async () => {
    mockFetch([]);
    render(<CoffeeDashboard />);

    expect(
      await screen.findByText("No coffees match this filter."),
    ).toBeInTheDocument();
  });

  it("renders an error alert with a retry button on failure", async () => {
    mockFetch(null, false);
    render(<CoffeeDashboard />);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toBeInTheDocument(),
    );
    expect(
      screen.getByRole("button", { name: "Try again" }),
    ).toBeInTheDocument();
  });
});
