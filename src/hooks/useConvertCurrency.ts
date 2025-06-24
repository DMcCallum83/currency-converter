import { useQuery } from "@tanstack/react-query";
import { convertCurrency } from "../api/currencyBeacon";
import type { ConversionRequest } from "../api/types";

/**
 * Custom hook to convert currency amounts
 * Uses React Query for caching, loading states, and error handling
 */
export function useConvertCurrency(params: ConversionRequest | null) {
  return useQuery({
    queryKey: ["convert", params],
    queryFn: () => convertCurrency(params!),
    enabled: Boolean(params && params.from && params.to && params.amount > 0),
    staleTime: 1000 * 60 * 5, // 5 minutes - exchange rates change frequently
    select: (data) => data.response,
  });
}
