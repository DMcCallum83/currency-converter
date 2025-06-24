import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencySelector } from "./CurrencySelector";
import type { Currency } from "../../api/types";

// Mock currencies for testing
const mockCurrencies: Currency[] = [
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    flag: "🇺🇸",
    decimal_digits: 2,
    rounding: 0,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    flag: "🇪🇺",
    decimal_digits: 2,
    rounding: 0,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    flag: "🇬🇧",
    decimal_digits: 2,
    rounding: 0,
  },
];

describe("CurrencySelector", () => {
  const defaultProps = {
    currencies: mockCurrencies,
    selectedCurrency: "",
    onChange: vi.fn(),
    label: "Test Currency",
    id: "test-currency",
  };

  it("renders with label and placeholder", () => {
    render(<CurrencySelector {...defaultProps} />);

    expect(screen.getByLabelText("Test Currency")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
    expect(screen.getByText("Select a currency")).toBeInTheDocument();
  });

  it("displays all currencies in dropdown", () => {
    render(<CurrencySelector {...defaultProps} />);

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    expect(screen.getByText("🇺🇸 USD - US Dollar")).toBeInTheDocument();
    expect(screen.getByText("🇪🇺 EUR - Euro")).toBeInTheDocument();
    expect(screen.getByText("🇬🇧 GBP - British Pound")).toBeInTheDocument();
  });

  it("calls onChange when currency is selected", () => {
    const onChange = vi.fn();
    render(<CurrencySelector {...defaultProps} onChange={onChange} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "USD" } });

    expect(onChange).toHaveBeenCalledWith("USD");
  });

  it("displays selected currency", () => {
    render(<CurrencySelector {...defaultProps} selectedCurrency="EUR" />);

    expect(screen.getByDisplayValue("EUR")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<CurrencySelector {...defaultProps} isLoading={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("shows error message", () => {
    const errorMessage = "Failed to load currencies";
    render(<CurrencySelector {...defaultProps} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
  });

  it("is disabled when disabled prop is true", () => {
    render(<CurrencySelector {...defaultProps} disabled={true} />);

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("has proper accessibility attributes", () => {
    render(<CurrencySelector {...defaultProps} />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("id", "test-currency");
    expect(select).toHaveAttribute("aria-describedby", undefined);
  });

  it("has error accessibility attributes when error is present", () => {
    render(<CurrencySelector {...defaultProps} error="Test error" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveAttribute("aria-describedby", "test-currency-error");
    expect(select).toHaveAttribute("aria-invalid", "true");
  });
});
