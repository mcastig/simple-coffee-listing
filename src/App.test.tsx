import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

afterEach(() => vi.unstubAllGlobals());

describe("App", () => {
  it("renders the coffee dashboard", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: "OK",
        json: () => Promise.resolve([]),
      } as Response),
    );

    render(<App />);

    expect(screen.getByText("Our Collection")).toBeInTheDocument();
  });
});
