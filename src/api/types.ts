/**
 * TypeScript interfaces for currencybeacon.com API responses
 */

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  decimal_digits: number;
  rounding: number;
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

export interface ConversionResponse {
  meta: {
    code: number;
    disclaimer: string;
  };
  response: {
    from: string;
    to: string;
    amount: number;
    value: number;
    converted: number;
    rate: number;
    last_updated: string;
  };
}

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
