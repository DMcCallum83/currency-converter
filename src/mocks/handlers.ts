import { http, HttpResponse } from "msw";
import type { Currency } from "../api/types";

// Mock data
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
  {
    id: 3,
    name: "British Pound",
    short_code: "GBP",
    symbol: "£",
    symbol_first: true,
  },
  {
    id: 4,
    name: "Japanese Yen",
    short_code: "JPY",
    symbol: "¥",
    symbol_first: true,
  },
  {
    id: 5,
    name: "Canadian Dollar",
    short_code: "CAD",
    symbol: "C$",
    symbol_first: true,
  },
];

export const handlers = [
  // Mock currencies endpoint
  http.get("https://api.currencybeacon.com/v1/currencies", ({ request }) => {
    const url = new URL(request.url);
    const error = url.searchParams.get("error");

    if (error === "network") {
      return HttpResponse.error();
    }

    if (error === "server") {
      return HttpResponse.json(
        {
          meta: {
            code: 500,
            disclaimer: "Internal server error",
          },
          response: {
            error: {
              code: "INTERNAL_ERROR",
              message: "Internal server error",
            },
          },
        },
        { status: 500 }
      );
    }

    return HttpResponse.json({
      meta: {
        code: 200,
        disclaimer: "Test data for development",
      },
      response: mockCurrencies,
    });
  }),

  // Mock conversion endpoint
  http.get("https://api.currencybeacon.com/v1/convert", ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const amount = url.searchParams.get("amount");

    if (!from || !to || !amount) {
      return HttpResponse.json(
        {
          meta: {
            code: 400,
            disclaimer: "Missing required parameters",
          },
          response: {
            error: {
              code: "MISSING_PARAMS",
              message: "Missing required parameters: from, to, amount",
            },
          },
        },
        { status: 400 }
      );
    }

    // Simulate different conversion rates based on currency pairs
    const conversionRates: Record<string, number> = {
      "USD-EUR": 0.855,
      "EUR-USD": 1.17,
      "USD-GBP": 0.73,
      "GBP-USD": 1.37,
      "USD-JPY": 110.5,
      "JPY-USD": 0.009,
      "USD-CAD": 1.25,
      "CAD-USD": 0.8,
      "EUR-GBP": 0.85,
      "GBP-EUR": 1.18,
    };

    const rateKey = `${from}-${to}`;
    const rate = conversionRates[rateKey] || 1.0;
    const convertedAmount = parseFloat(amount) * rate;

    return HttpResponse.json({
      meta: {
        code: 200,
        disclaimer: "Test data for development",
      },
      response: {
        timestamp: Math.floor(Date.now() / 1000),
        date: new Date().toISOString().split("T")[0],
        from,
        to,
        amount: parseFloat(amount),
        value: convertedAmount,
      },
    });
  }),
];
