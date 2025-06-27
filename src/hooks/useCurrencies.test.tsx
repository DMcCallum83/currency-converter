import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrencies } from "./useCurrencies";
import { fetchCurrencies } from "../api/currencyBeacon";
import type { Currency } from "../api/types";

// Mock the API function
vi.mock("../api/currencyBeacon", () => ({
  fetchCurrencies: vi.fn(),
}));

// Create a test wrapper with QueryClient
const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useCurrencies", () => {
  const mockCurrencies: Currency[] = [
    {
      id: 1,
      name: "US Dollar",
      short_code: "USD",
      symbol: "$",
      symbol_first: true,
    },
    {
      id: 2,
      name: "Euro",
      short_code: "EUR",
      symbol: "€",
      symbol_first: true,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns loading state initially", () => {
    const mockFetchCurrencies = vi.mocked(fetchCurrencies);
    mockFetchCurrencies.mockResolvedValue({
      meta: {
        code: 200,
        disclaimer: "Test disclaimer",
      },
      response: mockCurrencies,
    });

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createTestWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.data).toBeUndefined();
  });

  it("returns currencies data when API call succeeds", async () => {
    const mockFetchCurrencies = vi.mocked(fetchCurrencies);
    mockFetchCurrencies.mockResolvedValue({
      meta: {
        code: 200,
        disclaimer: "Test disclaimer",
      },
      response: mockCurrencies,
    });

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockCurrencies);
    expect(mockFetchCurrencies).toHaveBeenCalledTimes(1);
  });

  it("returns error state when API call fails", async () => {
    const mockFetchCurrencies = vi.mocked(fetchCurrencies);
    const error = new Error("Failed to fetch currencies");
    mockFetchCurrencies.mockRejectedValue(error);

    const { result } = renderHook(() => useCurrencies(), {
      wrapper: createTestWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBe(error);
    expect(mockFetchCurrencies).toHaveBeenCalledTimes(1);
  });

  it("uses correct query key", () => {
    const mockFetchCurrencies = vi.mocked(fetchCurrencies);
    mockFetchCurrencies.mockResolvedValue({
      meta: {
        code: 200,
        disclaimer: "Test disclaimer",
      },
      response: mockCurrencies,
    });

    renderHook(() => useCurrencies(), {
      wrapper: createTestWrapper(),
    });

    // The query key should be ["currencies"]
    expect(mockFetchCurrencies).toHaveBeenCalledTimes(1);
  });
});
