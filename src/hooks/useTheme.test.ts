import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useTheme } from "./useTheme";

const mockPrefersLight = (prefersLight: boolean) => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: prefersLight }),
  );
};

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-theme");
});

afterEach(() => vi.unstubAllGlobals());

describe("useTheme", () => {
  it("uses an explicitly stored theme over the OS preference", () => {
    localStorage.setItem("coffee-theme", "light");
    mockPrefersLight(false); // OS says dark, but stored wins

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("falls back to the OS light preference on first visit", () => {
    mockPrefersLight(true);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("light");
  });

  it("falls back to dark when the OS does not prefer light", () => {
    mockPrefersLight(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");
    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  });

  it("toggles the theme and persists the choice", () => {
    mockPrefersLight(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe("dark");

    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("light");
    expect(localStorage.getItem("coffee-theme")).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");

    // Toggle back to cover the reverse direction.
    act(() => result.current.toggleTheme());

    expect(result.current.theme).toBe("dark");
    expect(localStorage.getItem("coffee-theme")).toBe("dark");
  });
});
