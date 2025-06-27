import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AmountInput } from "./AmountInput";

describe("AmountInput", () => {
  const defaultProps = {
    amount: "",
    onChange: vi.fn(),
    label: "Amount",
    id: "amount",
  };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("renders with label and placeholder", () => {
    render(<AmountInput {...defaultProps} />);

    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
  });

  it("displays the current amount value", () => {
    render(<AmountInput {...defaultProps} amount="123.45" />);

    expect(screen.getByDisplayValue("123.45")).toBeInTheDocument();
  });

  it("calls onChange with debouncing when value is entered", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "100" } });

    // onChange should not be called immediately due to debouncing
    expect(onChange).not.toHaveBeenCalled();

    // Fast-forward time to trigger debounced onChange
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledWith("100");
  });

  it("allows valid numeric input", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");

    // Test valid inputs
    fireEvent.change(input, { target: { value: "123" } });
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledWith("123");

    onChange.mockClear();

    fireEvent.change(input, { target: { value: "123.45" } });
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledWith("123.45");

    onChange.mockClear();

    fireEvent.change(input, { target: { value: "0.5" } });
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledWith("0.5");
  });

  it("rejects invalid non-numeric input", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");

    // Test invalid inputs
    fireEvent.change(input, { target: { value: "abc" } });
    vi.advanceTimersByTime(500);
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "123abc" } });
    vi.advanceTimersByTime(500);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("formats number on blur", () => {
    const onChange = vi.fn();
    render(
      <AmountInput {...defaultProps} amount="123.456" onChange={onChange} />
    );

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith("123.46");
  });

  it("does not format invalid numbers on blur", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} amount="abc" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("empty string input doesn't trigger onChange call", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "" } });
    vi.advanceTimersByTime(500);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("allows decimal point input", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123." } });
    vi.advanceTimersByTime(500);

    expect(onChange).toHaveBeenCalledWith("123.");
  });

  it("shows error message when provided", () => {
    const errorMessage = "Please enter a valid amount";
    render(<AmountInput {...defaultProps} error={errorMessage} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("is disabled when disabled prop is true", () => {
    render(<AmountInput {...defaultProps} disabled={true} />);

    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has proper accessibility attributes", () => {
    render(<AmountInput {...defaultProps} />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "amount");
    expect(input).toHaveAttribute("inputMode", "decimal");
    expect(input).toHaveAttribute("step", "0.01");
    expect(input).toHaveAttribute("min", "0");
  });

  it("has error accessibility attributes when error is present", () => {
    render(<AmountInput {...defaultProps} error="Test error" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-describedby", "amount-error");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("uses custom placeholder when provided", () => {
    render(<AmountInput {...defaultProps} placeholder="Custom placeholder" />);

    expect(
      screen.getByPlaceholderText("Custom placeholder")
    ).toBeInTheDocument();
  });

  it("cancels previous debounce when new input is entered", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");

    // Enter first value
    fireEvent.change(input, { target: { value: "100" } });

    // Enter second value before debounce completes
    fireEvent.change(input, { target: { value: "200" } });

    // Fast-forward to trigger only the second debounce
    vi.advanceTimersByTime(500);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("200");
  });

  it("updates local state immediately while debouncing onChange", () => {
    render(<AmountInput {...defaultProps} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "123.45" } });

    // Local state should update immediately
    expect(screen.getByDisplayValue("123.45")).toBeInTheDocument();
  });

  it("handles multiple rapid input changes", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");

    // Rapidly change input values
    fireEvent.change(input, { target: { value: "1" } });
    fireEvent.change(input, { target: { value: "12" } });
    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.change(input, { target: { value: "1234" } });

    // Only the last value should trigger onChange after debounce
    vi.advanceTimersByTime(500);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("1234");
  });

  it("handles blur formatting with multiple decimal places", () => {
    const onChange = vi.fn();
    render(
      <AmountInput {...defaultProps} amount="123.456789" onChange={onChange} />
    );

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith("123.46");
  });

  it("handles zero value formatting", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} amount="0" onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith("0.00");
  });

  it("handles very small decimal values", () => {
    const onChange = vi.fn();
    render(
      <AmountInput {...defaultProps} amount="0.001" onChange={onChange} />
    );

    const input = screen.getByRole("textbox");
    fireEvent.blur(input);

    expect(onChange).toHaveBeenCalledWith("0.00");
  });
});
