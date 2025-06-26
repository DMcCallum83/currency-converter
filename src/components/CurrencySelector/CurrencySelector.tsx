import type { Currency } from "../../api/types";
import "./CurrencySelector.scss";

interface CurrencySelectorProps {
  currencies: Currency[];
  selectedCurrency: string; // This will be the short_code
  onChange: (currencyCode: string) => void;
  label: string;
  id: string;
  isLoading?: boolean;
  error?: string | null;
  disabled?: boolean;
}

/**
 * CurrencySelector component for selecting currencies from a dropdown
 * Features accessibility, loading states, and error handling
 */
export function CurrencySelector({
  currencies,
  selectedCurrency,
  onChange,
  label,
  id,
  isLoading = false,
  error = null,
  disabled = false,
}: CurrencySelectorProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="currency-selector">
      <label htmlFor={id} className="currency-selector__label">
        {label}
      </label>

      <div className="currency-selector__container">
        <select
          id={id}
          value={selectedCurrency}
          onChange={handleChange}
          disabled={disabled || isLoading}
          className="currency-selector__select"
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
        >
          <option value="">Select a currency</option>
          {currencies.map((currency) => (
            <option key={currency.id} value={currency.short_code}>
              {currency.name} | {`${currency.short_code} | ${currency.symbol}`}
            </option>
          ))}
        </select>

        {isLoading && (
          <div className="currency-selector__loading" aria-hidden="true">
            Loading...
          </div>
        )}
      </div>

      {error && (
        <div
          id={`${id}-error`}
          className="currency-selector__error"
          role="alert"
        >
          {error}
        </div>
      )}
    </div>
  );
}
