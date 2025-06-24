import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConversionResult } from "./ConversionResult";

const mockResult = {
  from: "USD",
  to: "EUR",
  amount: 100,
  converted: 85.5,
  rate: 0.855,
  last_updated: "2024-12-19T10:30:00Z",
};

describe("ConversionResult", () => {
  const defaultProps = {
    result: null,
    isLoading: false,
    error: null,
    fromCurrency: "",
    toCurrency: "",
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
        fromCurrency="USD"
        toCurrency="EUR"
        amount="100"
      />
    );

    // Check main conversion display
    expect(screen.getByText(/100\.00 USD =/)).toBeInTheDocument();
    expect(screen.getByText(/85\.50 EUR/)).toBeInTheDocument();

    // Check rate information
    expect(screen.getByText(/1 USD = 0\.855000 EUR/)).toBeInTheDocument();

    // Check timestamp
    expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
  });

  it("formats currency values correctly", () => {
    const resultWithDifferentAmounts = {
      ...mockResult,
      amount: 1234.56,
      converted: 1055.55,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={resultWithDifferentAmounts}
        fromCurrency="USD"
        toCurrency="EUR"
        amount="1234.56"
      />
    );

    expect(screen.getByText(/1,234\.56 USD =/)).toBeInTheDocument();
    expect(screen.getByText(/1,055\.55 EUR/)).toBeInTheDocument();
  });

  it("handles zero amount", () => {
    const zeroResult = {
      ...mockResult,
      amount: 0,
      converted: 0,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={zeroResult}
        fromCurrency="USD"
        toCurrency="EUR"
        amount="0"
      />
    );

    expect(screen.getByText(/0\.00 USD =/)).toBeInTheDocument();
    expect(screen.getByText(/0\.00 EUR/)).toBeInTheDocument();
  });

  it("displays rate with proper precision", () => {
    const resultWithLongRate = {
      ...mockResult,
      rate: 0.123456789,
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={resultWithLongRate}
        fromCurrency="USD"
        toCurrency="EUR"
        amount="100"
      />
    );

    expect(screen.getByText(/1 USD = 0\.123457 EUR/)).toBeInTheDocument();
  });

  it("formats date correctly", () => {
    const resultWithSpecificDate = {
      ...mockResult,
      last_updated: "2024-12-19T15:30:45Z",
    };

    render(
      <ConversionResult
        {...defaultProps}
        result={resultWithSpecificDate}
        fromCurrency="USD"
        toCurrency="EUR"
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
        fromCurrency="USD"
        toCurrency="EUR"
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
        fromCurrency="USD"
        toCurrency="EUR"
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
        fromCurrency=""
        toCurrency=""
        amount="100"
      />
    );

    expect(
      screen.getByText(
        "Enter an amount and select currencies to see the conversion"
      )
    ).toBeInTheDocument();
  });
});
