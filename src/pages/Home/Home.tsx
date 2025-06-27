import { useState, useCallback } from "react";
import { CurrencySelector } from "../../components/CurrencySelector";
import { AmountInput } from "../../components/AmountInput";
import { ConversionResult } from "../../components/ConversionResult";
import { useCurrencies } from "../../hooks/useCurrencies";
import { useConvertCurrency } from "../../hooks/useConvertCurrency";
import type { ConversionRequest, SelectedCurrency } from "../../api/types";
import "./Home.scss";

/**
 * Home page component - Main currency converter interface
 * Integrates all components and manages application state
 */
export function Home() {
  const [fromCurrency, setFromCurrency] = useState<SelectedCurrency | null>(
    null
  );
  const [toCurrency, setToCurrency] = useState<SelectedCurrency | null>(null);
  const [amount, setAmount] = useState("");

  // Fetch currencies
  const {
    data: currencies = [],
    isLoading: currenciesLoading,
    error: currenciesError,
  } = useCurrencies();

  // Helper function to find currency by short_code
  const findCurrencyByCode = useCallback(
    (shortCode: string): SelectedCurrency | null => {
      const currency = currencies.find((c) => c.short_code === shortCode);
      return currency
        ? {
            short_code: currency.short_code,
            symbol: currency.symbol,
            symbol_first: currency.symbol_first,
          }
        : null;
    },
    [currencies]
  );

  // Prepare conversion request
  const conversionRequest: ConversionRequest | null =
    fromCurrency &&
    toCurrency &&
    amount &&
    !isNaN(Number(amount)) &&
    Number(amount) > 0
      ? {
          from: fromCurrency.short_code,
          to: toCurrency.short_code,
          amount: Number(amount),
        }
      : null;

  // Fetch conversion result
  const {
    data: conversionResult,
    isLoading: conversionLoading,
    error: conversionError,
  } = useConvertCurrency(conversionRequest);

  const handleFromCurrencyChange = useCallback(
    (shortCode: string) => {
      setAmount("");
      const foundCurrency = findCurrencyByCode(shortCode);
      setFromCurrency(foundCurrency);
    },
    [findCurrencyByCode]
  );

  const handleToCurrencyChange = useCallback(
    (shortCode: string) => {
      setAmount("");
      setToCurrency(findCurrencyByCode(shortCode));
    },
    [findCurrencyByCode]
  );

  const handleSwapCurrencies = useCallback(() => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  }, [fromCurrency, toCurrency]);

  const isSwapDisabled = !fromCurrency || !toCurrency;

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Currency Converter</h1>
        <p className="home__subtitle">
          Convert between different currencies using real-time exchange rates
        </p>
      </header>

      <main className="home__main">
        <div className="converter-form">
          <div className="converter-form__row">
            <CurrencySelector
              currencies={currencies}
              selectedCurrency={fromCurrency?.short_code || ""}
              onChange={handleFromCurrencyChange}
              label="From Currency"
              id="from-currency"
              isLoading={currenciesLoading}
              error={currenciesError?.message || null}
            />

            <button
              type="button"
              onClick={handleSwapCurrencies}
              disabled={isSwapDisabled}
              className="converter-form__swap-btn"
              aria-label="Swap currencies"
            >
              ↔
            </button>

            <CurrencySelector
              currencies={currencies}
              selectedCurrency={toCurrency?.short_code || ""}
              onChange={handleToCurrencyChange}
              label="To Currency"
              id="to-currency"
              isLoading={currenciesLoading}
              error={currenciesError?.message || null}
            />
          </div>

          <div className="converter-form__row">
            <AmountInput
              amount={amount}
              onChange={setAmount}
              label="Amount"
              id="amount"
              placeholder="0.00"
              disabled={currenciesLoading}
            />
          </div>

          <div className="converter-form__result">
            <ConversionResult
              result={conversionResult}
              isLoading={conversionLoading}
              error={conversionError?.message || null}
              fromCurrency={fromCurrency}
              toCurrency={toCurrency}
              amount={amount}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
