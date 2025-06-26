import { describe, it, expect, vi, beforeEach } from "vitest";
import { server } from "../test-setup";
import { http, HttpResponse } from "msw";

// Mock console.warn before importing the module
console.warn = vi.fn();

// Mock environment variables
vi.mock("import.meta.env", () => ({
  VITE_CURRENCY_API_KEY: "test-api-key",
}));

// Import after mocking
import { fetchCurrencies, convertCurrency } from "./currencyBeacon";
import type {
  CurrenciesResponse,
  ConversionRequest,
  ConversionResponse,
} from "./types";

describe("currencyBeacon API", () => {
  beforeEach(() => {
    server.resetHandlers();
    vi.clearAllMocks(); // Clear console.warn calls
  });

  describe("fetchCurrencies", () => {
    const mockCurrenciesResponse: CurrenciesResponse = {
      meta: {
        code: 200,
        disclaimer: "Test data",
      },
      response: [
        {
          id: 1,
          name: "US Dollar",
          short_code: "USD",
          symbol: "$",
          symbol_first: true,
        },
      ],
    };

    it("successfully fetches currencies", async () => {
      server.use(
        http.get("https://api.currencybeacon.com/v1/currencies", () => {
          return HttpResponse.json(mockCurrenciesResponse);
        })
      );

      const result = await fetchCurrencies();

      expect(result).toEqual(mockCurrenciesResponse);
    });

    it("throws error when API response is not ok", async () => {
      server.use(
        http.get("https://api.currencybeacon.com/v1/currencies", () => {
          return HttpResponse.json(
            { error: "Internal server error" },
            { status: 500 }
          );
        })
      );

      await expect(fetchCurrencies()).rejects.toThrow(
        "Failed to fetch currencies"
      );
    });

    it("throws error when fetch fails", async () => {
      server.use(
        http.get("https://api.currencybeacon.com/v1/currencies", () => {
          return HttpResponse.error();
        })
      );

      await expect(fetchCurrencies()).rejects.toThrow("Failed to fetch");
    });
  });

  describe("convertCurrency", () => {
    const mockConversionRequest: ConversionRequest = {
      from: "USD",
      to: "EUR",
      amount: 100,
    };

    const mockConversionResponse: ConversionResponse = {
      meta: {
        code: 200,
        disclaimer: "Test data",
      },
      response: {
        timestamp: 1702992600,
        date: "2024-12-19",
        from: "USD",
        to: "EUR",
        amount: 100,
        value: 85.5,
      },
    };

    it("successfully converts currency", async () => {
      server.use(
        http.get("https://api.currencybeacon.com/v1/convert", () => {
          return HttpResponse.json(mockConversionResponse);
        })
      );

      const result = await convertCurrency(mockConversionRequest);

      expect(result).toEqual(mockConversionResponse);
    });

    it("throws error when conversion API response is not ok", async () => {
      server.use(
        http.get("https://api.currencybeacon.com/v1/convert", () => {
          return HttpResponse.json(
            { error: "Invalid currency pair" },
            { status: 400 }
          );
        })
      );

      await expect(convertCurrency(mockConversionRequest)).rejects.toThrow(
        "Failed to convert currency"
      );
    });

    it("throws error when conversion fetch fails", async () => {
      server.use(
        http.get("https://api.currencybeacon.com/v1/convert", () => {
          return HttpResponse.error();
        })
      );

      await expect(convertCurrency(mockConversionRequest)).rejects.toThrow(
        "Failed to fetch"
      );
    });

    it("handles different currency pairs correctly", async () => {
      const differentRequest: ConversionRequest = {
        from: "EUR",
        to: "GBP",
        amount: 50,
      };

      server.use(
        http.get("https://api.currencybeacon.com/v1/convert", () => {
          return HttpResponse.json(mockConversionResponse);
        })
      );

      await convertCurrency(differentRequest);
      // Test passes if no error is thrown
    });

    it("handles decimal amounts correctly", async () => {
      const decimalRequest: ConversionRequest = {
        from: "USD",
        to: "EUR",
        amount: 99.99,
      };

      server.use(
        http.get("https://api.currencybeacon.com/v1/convert", () => {
          return HttpResponse.json(mockConversionResponse);
        })
      );

      await convertCurrency(decimalRequest);
      // Test passes if no error is thrown
    });
  });
});
