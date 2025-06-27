import type { ConversionResult, SelectedCurrency } from "../../api/types";
import "./ConversionResult.scss";

interface ConversionResultProps {
  result: ConversionResult | undefined;
  isLoading: boolean;
  error: string | null;
  fromCurrency: SelectedCurrency | null;
  toCurrency: SelectedCurrency | null;
  amount: string;
}

/**
 * ConversionResult component for displaying currency conversion results
 * Features loading states, error handling, and formatted display
 */
export function ConversionResult({
  result,
  isLoading,
  error,
  fromCurrency,
  toCurrency,
  amount,
}: ConversionResultProps) {
  if (isLoading) {
    return (
      <div className="conversion-result">
        <div
          className="conversion-result__loading"
          role="status"
          aria-live="polite"
        >
          Converting...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="conversion-result">
        <div className="conversion-result__error" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!result || !fromCurrency || !toCurrency || !amount) {
    return (
      <div className="conversion-result">
        <div className="conversion-result__placeholder">
          Enter an amount and select currencies to see the conversion
        </div>
      </div>
    );
  }

  const formatCurrency = (
    value: number,
    currencyCode: string,
    symbol: string,
    symbolFirst: boolean
  ) => {
    const formattedValue = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

    // Remove the currency symbol from the formatted value and add it in the correct position
    const valueWithoutSymbol = formattedValue.replace(/[^\d.,]/g, "");
    return symbolFirst
      ? `${symbol}${valueWithoutSymbol}`
      : `${valueWithoutSymbol}${symbol}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="conversion-result">
      <div className="conversion-result__main">
        <div className="conversion-result__amount">
          {formatCurrency(
            Number(amount),
            fromCurrency.short_code,
            fromCurrency.symbol,
            fromCurrency.symbol_first
          )}{" "}
          ={" "}
          <span className="conversion-result__converted">
            {formatCurrency(
              result.value,
              toCurrency.short_code,
              toCurrency.symbol,
              toCurrency.symbol_first
            )}
          </span>
        </div>
      </div>

      <div className="conversion-result__details">
        <div className="conversion-result__rate">
          1 {fromCurrency.short_code} = {result.value.toFixed(6)}{" "}
          {toCurrency.short_code}
        </div>
        <div className="conversion-result__timestamp">
          Last updated: {formatDate(result.timestamp)}
        </div>
      </div>
    </div>
  );
}
