import type {
  CurrenciesResponse,
  ConversionRequest,
  ConversionResponse,
} from "./types";

const API_BASE_URL = "https://api.currencybeacon.com/v1";
const API_KEY = import.meta.env.VITE_CURRENCY_API_KEY;

if (!API_KEY) {
  console.warn(
    "VITE_CURRENCY_API_KEY is not set. Please add your API key to .env file."
  );
}

/**
 * Fetches the list of available currencies from currencybeacon.com
 */
export async function fetchCurrencies(): Promise<CurrenciesResponse> {
  const url = `${API_BASE_URL}/currencies?api_key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to fetch currencies");
  }

  return response.json();
}

/**
 * Converts an amount from one currency to another
 */
export async function convertCurrency(
  params: ConversionRequest
): Promise<ConversionResponse> {
  const { from, to, amount } = params;
  const url = `${API_BASE_URL}/convert?from=${from}&to=${to}&amount=${amount}&api_key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to convert currency");
  }

  return response.json();
}
