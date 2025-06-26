import { useEffect, useRef, useState } from "react";
import "./AmountInput.scss";

interface AmountInputProps {
  amount: string;
  onChange: (amount: string) => void;
  label: string;
  id: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string | null;
}

/**
 * AmountInput component for entering currency amounts
 * Features validation, accessibility, proper number handling, and debouncing
 */
export function AmountInput({
  amount,
  onChange,
  label,
  id,
  placeholder = "Enter amount",
  disabled = false,
  error = null,
}: AmountInputProps) {
  const debounceTimeoutRef = useRef<number | null>(null);
  const [localAmount, setLocalAmount] = useState(amount);

  // Update local amount when prop changes
  useEffect(() => {
    setLocalAmount(amount);
  }, [amount]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Allow empty string, numbers, and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setLocalAmount(value);

      // Clear existing timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Set new timeout
      debounceTimeoutRef.current = setTimeout(() => {
        onChange(value);
      }, 500);
    }
  };

  const handleBlur = () => {
    // Clear any pending debounce
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
      debounceTimeoutRef.current = null;
    }

    // Format the number to have at most 2 decimal places
    if (localAmount && !isNaN(Number(localAmount))) {
      const formatted = Number(localAmount).toFixed(2);
      setLocalAmount(formatted);
      onChange(formatted);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="amount-input">
      <label htmlFor={id} className="amount-input__label">
        {label}
      </label>

      <input
        type="text"
        id={id}
        value={localAmount}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="amount-input__field"
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={!!error}
        inputMode="decimal"
        step="0.01"
        min="0"
      />

      {error && (
        <div id={`${id}-error`} className="amount-input__error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
