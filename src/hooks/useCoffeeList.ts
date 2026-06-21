import { useCallback, useEffect, useState } from "react";
import { fetchCoffeeList } from "../services/coffeeService";
import type { CoffeeItem } from "../types/coffee";

interface CoffeeListState {
  coffees: CoffeeItem[];
  isLoading: boolean;
  error: string | null;
}

interface UseCoffeeListResult extends CoffeeListState {
  /** Re-run the fetch (used by the error-state retry button). */
  reload: () => void;
}

const INITIAL_STATE: CoffeeListState = {
  coffees: [],
  isLoading: true,
  error: null,
};

/**
 * Owns the coffee-listing fetch lifecycle: loading, error and data.
 * Cancels the request on unmount to avoid setting state after teardown.
 */
export const useCoffeeList = (): UseCoffeeListResult => {
  const [state, setState] = useState<CoffeeListState>(INITIAL_STATE);
  // Bumping this re-runs the effect, giving us a clean retry.
  const [attempt, setAttempt] = useState(0);

  const reload = useCallback(() => {
    // Reset to loading here (an event) rather than inside the effect, so the
    // effect only ever sets state from the resolved/rejected fetch.
    setState(INITIAL_STATE);
    setAttempt((n) => n + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchCoffeeList(controller.signal)
      .then((coffees) => {
        setState({ coffees, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        // An abort is an intentional cancel, not a user-facing error.
        if (controller.signal.aborted) return;
        setState({
          coffees: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Something went wrong while loading coffees.",
        });
      });

    return () => controller.abort();
  }, [attempt]);

  return { ...state, reload };
};
