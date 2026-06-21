import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoffeeFilterTabs } from "./CoffeeFilterTabs";

describe("CoffeeFilterTabs", () => {
  it("renders both filter controls", () => {
    render(<CoffeeFilterTabs active="all" onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: "All Products" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Available Now" }),
    ).toBeInTheDocument();
  });

  it("marks the active tab via aria-pressed", () => {
    render(<CoffeeFilterTabs active="available" onChange={() => {}} />);
    expect(
      screen.getByRole("button", { name: "Available Now" }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: "All Products" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the selected filter value", async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<CoffeeFilterTabs active="all" onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Available Now" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("available");
  });
});
