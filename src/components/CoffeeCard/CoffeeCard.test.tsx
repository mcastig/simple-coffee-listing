import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoffeeCard } from "./CoffeeCard";
import type { CoffeeItem } from "../../types/coffee";

const base: CoffeeItem = {
  id: 1,
  name: "Cappuccino",
  image: "https://example.com/cappuccino.jpg",
  price: "$5.20",
  rating: 4.7,
  votes: 65,
  popular: false,
  available: true,
};

const renderCard = (overrides: Partial<CoffeeItem> = {}) =>
  render(<CoffeeCard coffee={{ ...base, ...overrides }} />);

describe("CoffeeCard", () => {
  it("renders name, price and the image labelled by name", () => {
    renderCard();
    expect(screen.getByText("Cappuccino")).toBeInTheDocument();
    expect(screen.getByText("$5.20")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Cappuccino" })).toBeInTheDocument();
  });

  it("shows the Popular badge only when popular", () => {
    const { rerender } = renderCard({ popular: true });
    expect(screen.getByText("Popular")).toBeInTheDocument();

    rerender(<CoffeeCard coffee={{ ...base, popular: false }} />);
    expect(screen.queryByText("Popular")).not.toBeInTheDocument();
  });

  it('shows "Sold out" only when unavailable', () => {
    renderCard({ available: false });
    expect(screen.getByText("Sold out")).toBeInTheDocument();
  });

  it("does not show availability text when available", () => {
    renderCard({ available: true });
    expect(screen.queryByText("Sold out")).not.toBeInTheDocument();
  });

  it("renders rating and vote count when rated", () => {
    renderCard({ rating: 4.85, votes: 14 });
    expect(screen.getByText("4.85")).toBeInTheDocument();
    expect(screen.getByText("(14 votes)")).toBeInTheDocument();
  });

  it("formats an integer rating with one decimal place", () => {
    renderCard({ rating: 5, votes: 23 });
    expect(screen.getByText("5.0")).toBeInTheDocument();
  });

  it('shows "No ratings" when rating is null', () => {
    renderCard({ rating: null, votes: 0 });
    expect(screen.getByText("No ratings")).toBeInTheDocument();
  });

  it('shows "No ratings" when there are zero votes', () => {
    renderCard({ rating: 4.5, votes: 0 });
    expect(screen.getByText("No ratings")).toBeInTheDocument();
    expect(screen.queryByText(/votes\)/)).not.toBeInTheDocument();
  });
});
