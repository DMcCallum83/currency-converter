interface ConversionResultProps {
  result: {
    from: string;
    to: string;
    amount: number;
    converted: number;
    rate: number;
    last_updated: string;
  } | null;
  isLoading: boolean;
  error: string | null;
  fromCurrency: string;
  toCurrency: string;
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

  const formatCurrency = (value: number, currencyCode: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
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
          {formatCurrency(Number(amount), fromCurrency)} ={" "}
          <span className="conversion-result__converted">
            {formatCurrency(result.converted, toCurrency)}
          </span>
        </div>
      </div>

      <div className="conversion-result__details">
        <div className="conversion-result__rate">
          1 {fromCurrency} = {result.rate.toFixed(6)} {toCurrency}
        </div>
        <div className="conversion-result__timestamp">
          Last updated: {formatDate(result.last_updated)}
        </div>
      </div>
    </div>
  );
}
