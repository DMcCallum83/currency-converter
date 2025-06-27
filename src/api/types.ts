/**
 * TypeScript interfaces for currencybeacon.com API responses
 */

interface CurrencyApiReturn {
  id: number;
  name: string;
  short_code: string;
  code: string;
  precision: number;
  subunit: number;
  symbol: string;
  symbol_first: boolean;
  decimal_mark: string;
  thousands_separator: string;
}
export type Currency = Pick<
  CurrencyApiReturn,
  "name" | "id" | "short_code" | "symbol" | "symbol_first"
>;

export interface SelectedCurrency {
  short_code: string;
  symbol: string;
  symbol_first: boolean;
}

export interface CurrenciesResponse {
  meta: {
    code: number;
    disclaimer: string;
  };
  response: Currency[];
}

export interface ConversionRequest {
  from: string;
  to: string;
  amount: number;
}

export type ConversionResponse = {
  meta: {
    code: number;
    disclaimer: string;
  };
  response: {
    timestamp: number;
    date: string;
    from: string;
    to: string;
    amount: number;
    value: number;
  };
};

export type ConversionResult = Pick<
  ConversionResponse["response"],
  "from" | "to" | "amount" | "value" | "date" | "timestamp"
>;

export interface ApiError {
  meta: {
    code: number;
    disclaimer: string;
  };
  response: {
    error: {
      code: string;
      message: string;
    };
  };
}
