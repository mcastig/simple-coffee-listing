import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useCoffeeList } from "./useCoffeeList";
import type { RawCoffeeItem } from "../types/coffee";

const raw: RawCoffeeItem[] = [
  {
    id: 1,
    name: "Cappuccino",
    image: "https://example.com/c.jpg",
    price: "$5.20",
    rating: 4.7,
    votes: 65,
    popular: true,
    available: true,
  },
];

const okResponse = (body: unknown) =>
  ({
    ok: true,
    status: 200,
    statusText: "OK",
    json: () => Promise.resolve(body),
  }) as Response;

afterEach(() => vi.unstubAllGlobals());

describe("useCoffeeList", () => {
  it("loads, then exposes the fetched coffees", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(okResponse(raw)));
    const { result } = renderHook(() => useCoffeeList());

    expect(result.current.isLoading).toBe(true);
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.coffees).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it("surfaces an Error message on failure", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Server Error",
        json: () => Promise.resolve(null),
      } as Response),
    );
    const { result } = renderHook(() => useCoffeeList());

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toContain("500");
  });

  it("falls back to a generic message for non-Error rejections", async () => {
    // Reject with a non-Error value to exercise the fallback branch.
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue("boom"));
    const { result } = renderHook(() => useCoffeeList());

    await waitFor(() =>
      expect(result.current.error).toBe(
        "Something went wrong while loading coffees.",
      ),
    );
  });

  it("reload() resets to loading and refetches", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Server Error",
        json: () => Promise.resolve(null),
      } as Response)
      .mockResolvedValueOnce(okResponse(raw));
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useCoffeeList());
    await waitFor(() => expect(result.current.error).not.toBeNull());

    act(() => result.current.reload());
    expect(result.current.isLoading).toBe(true);

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.coffees).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it("aborts the request on unmount without setting error state", async () => {
    // A fetch that only settles when its signal aborts.
    vi.stubGlobal(
      "fetch",
      vi.fn(
        (_url: string, init?: { signal?: AbortSignal }) =>
          new Promise((_resolve, reject) => {
            init?.signal?.addEventListener("abort", () =>
              reject(new DOMException("Aborted", "AbortError")),
            );
          }),
      ),
    );

    const { result, unmount } = renderHook(() => useCoffeeList());
    expect(result.current.isLoading).toBe(true);

    unmount();
    // Let the aborted rejection flush; the hook must swallow it.
    await act(async () => {
      await Promise.resolve();
    });
    expect(result.current.error).toBeNull();
  });
});
