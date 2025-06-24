# Currency Converter App – Project Plan

## Overview
A modern, accessible, and user-friendly currency converter built with Vite, React, TypeScript, React Query, and Vitest. The app fetches currency data and conversion rates from currencybeacon.com, focusing on clean code, best practices, and a pleasant user experience.

---

## 1. Project Structure

```
src/
  api/
    currencyBeacon.ts         // API functions for currencybeacon.com
    types.ts                  // TypeScript types for API responses
  components/
    CurrencySelector/
      CurrencySelector.tsx
      CurrencySelector.test.tsx
      index.ts
    AmountInput/
      AmountInput.tsx
      AmountInput.test.tsx
      index.ts
    ConversionResult/
      ConversionResult.tsx
      ConversionResult.test.tsx
      index.ts
  hooks/
    useCurrencies.ts          // Fetches currency list
    useConvertCurrency.ts     // Fetches conversion result
  pages/
    Home/
      Home.tsx
      index.ts
  App.tsx
  main.tsx
  styles/
    (optional: global styles, theme, etc.)
  tests/
    (optional: integration tests)
.env
.vitest.config.ts
vite.config.ts
README.md
PLAN.md
PLAN_PROGRESS.md
```

---

## 2. Components

### CurrencySelector
- Props: `currencies`, `selectedCurrency`, `onChange`
- Renders a select dropdown for currency choice.
- Accessible with proper labels and keyboard navigation.

### AmountInput
- Props: `amount`, `onChange`
- Renders a numeric input for the amount.
- Accessible with labels and input validation.

### ConversionResult
- Props: `result`, `isLoading`, `error`
- Displays the converted value, loading spinner, or error message.
- Accessible and clear feedback for all states.

---

## 3. Custom Hooks

### useCurrencies
- Uses React Query to fetch and cache the list of currencies.
- Returns: `{ data, isLoading, error }`

### useConvertCurrency
- Uses React Query to fetch the conversion result based on selected currencies and amount.
- Returns: `{ data, isLoading, error }`

---

## 4. API Layer

### currencyBeacon.ts
- Functions to call `/v1/currencies` and `/v1/convert` endpoints.
- Handles API key from environment variable.

### types.ts
- TypeScript interfaces/types for API responses.

---

## 5. State Management
- Use React state for selected currencies and amount input.
- Use React Query for currencies list and conversion result.

---

## 6. Testing
- Use Vitest and @testing-library/react for:
  - Component unit tests
  - Custom hook tests (with mocked API)
  - (Optional) Integration tests

---

## 7. Styling
- Use a consistent styling method (CSS Modules, styled-components, or Tailwind).
- Ensure accessibility (labels, aria attributes, color contrast, etc.)
- Responsive design for all devices.

---

## 8. API Key Handling
- Store API key in `.env` as `VITE_CURRENCY_API_KEY`.
- Document in README that the key is exposed in the frontend and why.
- (Optional) Add a note about backend proxy as a future improvement.

---

## 9. README & Documentation
- Clear setup instructions.
- How to run and test the app.
- Document API key handling and any assumptions.

---

## 10. User Experience
- Show loading and error states for all async actions.
- Disable convert button if input is invalid.
- Responsive and accessible UI.

---

## 11. (Optional) Enhancements
- Swap currencies button.
- Persist last used currencies/amount in localStorage.
- Dark mode.

---

## Progress Tracking
- See PLAN_PROGRESS.md for a log of completed steps and next actions. 