import { useQuery } from "@tanstack/react-query";
import { fetchCurrencies } from "../api/currencyBeacon";
import type { Currency } from "../api/types";

/**
 * Custom hook to fetch and cache the list of available currencies
 * Uses React Query for caching, loading states, and error handling
 */
export function useCurrencies() {
  return useQuery({
    queryKey: ["currencies"],
    queryFn: fetchCurrencies,
    staleTime: 1000 * 60 * 60, // 1 hour - currency list doesn't change often
    select: (data) => data.response as Currency[],
  });
}
