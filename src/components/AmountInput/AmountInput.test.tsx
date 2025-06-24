import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AmountInput } from "./AmountInput";

describe("AmountInput", () => {
  const defaultProps = {
    amount: "",
    onChange: vi.fn(),
    label: "Amount",
    id: "amount",
  };

  it("renders with label and placeholder", () => {
    render(<AmountInput {...defaultProps} />);

    expect(screen.getByLabelText("Amount")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter amount")).toBeInTheDocument();
  });

  it("displays the current amount value", () => {
    render(<AmountInput {...defaultProps} amount="123.45" />);

    expect(screen.getByDisplayValue("123.45")).toBeInTheDocument();
  });

  it("calls onChange when value is entered", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "100" } });

    expect(onChange).toHaveBeenCalledWith("100");
  });

  it("allows valid numeric input", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");

    // Test valid inputs
    fireEvent.change(input, { target: { value: "123" } });
    expect(onChange).toHaveBeenCalledWith("123");

    fireEvent.change(input, { target: { value: "123.45" } });
    expect(onChange).toHaveBeenCalledWith("123.45");

    fireEvent.change(input, { target: { value: "0.5" } });
    expect(onChange).toHaveBeenCalledWith("0.5");
  });

  it("rejects invalid non-numeric input", () => {
    const onChange = vi.fn();
    render(<AmountInput {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("textbox");

    // Test invalid inputs
    fireEvent.change(input, { target: { value: "abc" } });
    expect(onChange).not.toHaveBeenCalled();

    fireEvent.change(input, { target: { value: "123abc" } });
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
});
