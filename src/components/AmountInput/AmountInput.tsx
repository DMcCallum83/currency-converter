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
 * Features validation, accessibility, and proper number handling
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // Allow empty string, numbers, and decimal points
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onChange(value);
    }
  };

  const handleBlur = () => {
    // Format the number to have at most 2 decimal places
    if (amount && !isNaN(Number(amount))) {
      const formatted = Number(amount).toFixed(2);
      if (formatted !== amount) {
        onChange(formatted);
      }
    }
  };

  return (
    <div className="amount-input">
      <label htmlFor={id} className="amount-input__label">
        {label}
      </label>

      <input
        type="text"
        id={id}
        value={amount}
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
