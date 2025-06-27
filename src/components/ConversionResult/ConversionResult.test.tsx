import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConversionResult } from "./ConversionResult";
import type {
  ConversionResult as ConversionResultType,
  SelectedCurrency,
} from "../../api/types";

const mockResult: ConversionResultType = {
  from: "USD",
  to: "EUR",
  amount: 100,
  value: 85.5,
  date: "2024-12-19",
  timestamp: 1702992600,
};

const mockFromCurrency: SelectedCurrency = {
  short_code: "USD",
  symbol: "$",
  symbol_first: true,
};

const mockToCurrency: SelectedCurrency = {
  short_code: "EUR",
  symbol: "€",
  symbol_first: true,
};

describe("ConversionResult", () => {
  const defaultProps = {
    result: undefined,
    isLoading: false,
    error: null,
    fromCurrency: null,
    toCurrency: null,
    amount: "",
  };

  it("shows placeholder when no data is provided", () => {
    render(<ConversionResult {...defaultProps} />);

    expect(
      screen.getByText(
        "Enter an amount and select currencies to see the conversion"
      )
    ).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<ConversionResult {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Converting...")).toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("shows error message", () => {
    const errorMessage = "Failed to convert currency";
    render(<ConversionResult {...defaultProps} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("displays conversion result correctly", () => {
    render(
      <ConversionResult
        {...defaultProps}
        result={mockResult}
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount="100"
      />
    );

    // Check main conversion display
    expect(screen.getByText(/\$100\.00 =/)).toBeInTheDocument();
    expect(screen.getByText(/€85\.50/)).toBeInTheDocument();

    // Check rate information
    expect(screen.getByText(/1 USD = 85\.500000 EUR/i)).toBeInTheDocument();

    // Check timestamp
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it("formats currency values correctly", () => {
    const resultWithDifferentAmounts = {
      ...mockResult,
      amount: 1234.56,
      value: 1055.55,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={resultWithDifferentAmounts}
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount="1234.56"
      />
    );

    expect(screen.getByText(/\$1,234\.56 =/)).toBeInTheDocument();
    expect(screen.getByText(/€1,055\.55/)).toBeInTheDocument();
  });

  it("handles zero amount", () => {
    const zeroResult = {
      ...mockResult,
      amount: 0,
      value: 0,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={zeroResult}
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount="0"
      />
    );

    expect(screen.getByText(/\$0\.00 =/)).toBeInTheDocument();
    expect(screen.getByText(/€0\.00/)).toBeInTheDocument();
  });

  it("displays rate with proper precision", () => {
    const resultWithLongRate = {
      ...mockResult,
      value: 0.123456789,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={resultWithLongRate}
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount="100"
      />
    );

    expect(screen.getByText(/1 USD = 0\.123457 EUR/)).toBeInTheDocument();
  });

  it("formats date correctly", () => {
    const resultWithSpecificDate = {
      ...mockResult,
      timestamp: 1702992645,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={resultWithSpecificDate}
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount="100"
      />
    );

    // The date should be formatted to a readable format
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it("prioritizes loading state over other states", () => {
    render(
      <ConversionResult
        {...defaultProps}
        result={mockResult}
        isLoading={true}
        error="Some error"
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount="100"
      />
    );

    expect(screen.getByText("Converting...")).toBeInTheDocument();
    expect(screen.queryByText("Some error")).not.toBeInTheDocument();
    expect(screen.queryByText(/100\.00 USD =/)).not.toBeInTheDocument();
  });

  it("prioritizes error state over result display", () => {
    render(
      <ConversionResult
        {...defaultProps}
        result={mockResult}
        error="API Error"
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount="100"
      />
    );

    expect(screen.getByText("API Error")).toBeInTheDocument();
    expect(screen.queryByText(/100\.00 USD =/)).not.toBeInTheDocument();
  });

  it("shows placeholder when currencies are not selected", () => {
    render(
      <ConversionResult
        {...defaultProps}
        result={mockResult}
        fromCurrency={null}
        toCurrency={null}
        amount="100"
      />
    );

    expect(
      screen.getByText(
        "Enter an amount and select currencies to see the conversion"
      )
    ).toBeInTheDocument();
  });

  it("shows placeholder when amount is empty", () => {
    render(
      <ConversionResult
        {...defaultProps}
        result={mockResult}
        fromCurrency={mockFromCurrency}
        toCurrency={mockToCurrency}
        amount=""
      />
    );

    expect(
      screen.getByText(
        "Enter an amount and select currencies to see the conversion"
      )
    ).toBeInTheDocument();
  });

  it("handles symbol positioning correctly", () => {
    const fromCurrencySymbolLast: SelectedCurrency = {
      short_code: "USD",
      symbol: "$",
      symbol_first: false,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={mockResult}
        fromCurrency={fromCurrencySymbolLast}
        toCurrency={mockToCurrency}
        amount="100"
      />
    );

    expect(screen.getByText(/100\.00\$ =/)).toBeInTheDocument();
  });
});
