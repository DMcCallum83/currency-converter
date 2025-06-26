import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CurrencySelector } from "./CurrencySelector";
import type { Currency } from "../../api/types";

// Mock currencies for testing
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
    expect(screen.getByText("Select a currency")).toBeInTheDocument();
  });

  it("displays all currencies in dropdown", () => {
    render(<CurrencySelector {...defaultProps} />);

    const select = screen.getByRole("combobox");
    fireEvent.click(select);

    expect(screen.getByText("US Dollar | USD | $")).toBeInTheDocument();
    expect(screen.getByText("Euro | EUR | €")).toBeInTheDocument();
    expect(screen.getByText("British Pound | GBP | £")).toBeInTheDocument();
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

    expect(screen.getByDisplayValue("Euro | EUR | €")).toBeInTheDocument();
  });

  it("sets correct value attribute when currency is selected", () => {
    render(<CurrencySelector {...defaultProps} selectedCurrency="EUR" />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("EUR");
  });

  it("shows placeholder when no currency is selected", () => {
    render(<CurrencySelector {...defaultProps} selectedCurrency="" />);

    expect(screen.getByDisplayValue("Select a currency")).toBeInTheDocument();
    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("");
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

  it("is disabled when both disabled and loading are true", () => {
    render(
      <CurrencySelector {...defaultProps} disabled={true} isLoading={true} />
    );

    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("handles empty currencies array", () => {
    render(<CurrencySelector {...defaultProps} currencies={[]} />);

    expect(screen.getByText("Select a currency")).toBeInTheDocument();
    expect(screen.queryByText("US Dollar | USD | $")).not.toBeInTheDocument();
  });
});
