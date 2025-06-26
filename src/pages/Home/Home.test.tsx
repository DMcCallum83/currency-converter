import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Home } from "./Home";
import { server } from "../../test-setup";

// Create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

// Wrapper component for tests
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = createTestQueryClient();
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("Home", () => {
  beforeEach(() => {
    // Clear any previous handlers
    server.resetHandlers();
    vi.clearAllTimers();
  });

  it("has access to DOM environment", () => {
    expect(document).toBeDefined();
    expect(window).toBeDefined();
    expect(document.createElement).toBeDefined();
  });

  it("renders the main page structure", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    expect(screen.getByText("Currency Converter")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Convert between different currencies using real-time exchange rates"
      )
    ).toBeInTheDocument();
  }, 10000);

  it("renders all child components and loads currencies", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Check for currency selectors
    expect(screen.getByLabelText("From Currency")).toBeInTheDocument();
    expect(screen.getByLabelText("To Currency")).toBeInTheDocument();

    // Check for amount input
    expect(screen.getByLabelText("Amount")).toBeInTheDocument();

    // Check for swap button
    expect(
      screen.getByRole("button", { name: "Swap currencies" })
    ).toBeInTheDocument();

    // Check for conversion result placeholder
    expect(
      screen.getByText(
        "Enter an amount and select currencies to see the conversion"
      )
    ).toBeInTheDocument();

    // Wait for currencies to load and verify they appear in the from selector
    await waitFor(
      () => {
        const fromSelector = screen.getByLabelText("From Currency");
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("handles currency selection", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for currencies to load
    await waitFor(
      () => {
        const fromSelector = screen.getByLabelText("From Currency");
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    const fromSelector = screen.getByLabelText("From Currency");
    fireEvent.change(fromSelector, { target: { value: "USD" } });

    await waitFor(
      () => {
        expect(fromSelector).toHaveValue("USD");
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("handles amount input", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    const amountInput = screen.getByLabelText("Amount");
    fireEvent.change(amountInput, { target: { value: "100" } });

    await waitFor(
      () => {
        expect(amountInput).toHaveValue("100");
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("swaps currencies when swap button is clicked", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for currencies to load
    await waitFor(
      () => {
        const fromSelector = screen.getByLabelText("From Currency");
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    // Select currencies first
    const fromSelector = screen.getByLabelText("From Currency");
    const toSelector = screen.getByLabelText("To Currency");

    fireEvent.change(fromSelector, { target: { value: "USD" } });
    fireEvent.change(toSelector, { target: { value: "EUR" } });

    await waitFor(
      () => {
        expect(fromSelector).toHaveValue("USD");
        expect(toSelector).toHaveValue("EUR");
      },
      { timeout: 5000 }
    );

    // Click swap button
    const swapButton = screen.getByRole("button", { name: "Swap currencies" });
    fireEvent.click(swapButton);

    await waitFor(
      () => {
        expect(fromSelector).toHaveValue("EUR");
        expect(toSelector).toHaveValue("USD");
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("disables swap button when currencies are not selected", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    const swapButton = screen.getByRole("button", { name: "Swap currencies" });
    expect(swapButton).toBeDisabled();
  }, 10000);

  it("enables swap button when both currencies are selected", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for currencies to load
    await waitFor(
      () => {
        const fromSelector = screen.getByLabelText("From Currency");
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    const fromSelector = screen.getByLabelText("From Currency");
    const toSelector = screen.getByLabelText("To Currency");

    fireEvent.change(fromSelector, { target: { value: "USD" } });
    fireEvent.change(toSelector, { target: { value: "EUR" } });

    await waitFor(
      () => {
        const swapButton = screen.getByRole("button", {
          name: "Swap currencies",
        });
        expect(swapButton).not.toBeDisabled();
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("clears amount when currency is changed", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    const amountInput = screen.getByLabelText("Amount");
    const fromSelector = screen.getByLabelText("From Currency");

    // Wait for currencies to load first
    await waitFor(
      () => {
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    // Enter amount
    fireEvent.change(amountInput, { target: { value: "100" } });
    await waitFor(
      () => {
        expect(amountInput).toHaveValue("100");
      },
      { timeout: 5000 }
    );

    // Wait for the debounced onChange to fire (500ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Change currency - this should clear the amount
    fireEvent.change(fromSelector, { target: { value: "USD" } });

    // Wait for the currency selection to complete
    await waitFor(
      () => {
        expect(fromSelector).toHaveValue("USD");
      },
      { timeout: 5000 }
    );

    // Wait for the amount to be cleared
    await waitFor(
      () => {
        expect(amountInput).toHaveValue("");
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("displays conversion result when available", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for currencies to load
    await waitFor(
      () => {
        const fromSelector = screen.getByLabelText("From Currency");
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    // Select currencies and enter amount
    const fromSelector = screen.getByLabelText("From Currency");
    const toSelector = screen.getByLabelText("To Currency");
    const amountInput = screen.getByLabelText("Amount");

    fireEvent.change(fromSelector, { target: { value: "USD" } });
    fireEvent.change(toSelector, { target: { value: "EUR" } });
    fireEvent.change(amountInput, { target: { value: "100" } });

    // Wait for conversion result
    await waitFor(
      () => {
        expect(screen.getByText(/\$100\.00 =/)).toBeInTheDocument();
        expect(screen.getByText(/€85\.50/)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  }, 10000);

  it("handles invalid amount input", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    const amountInput = screen.getByLabelText("Amount");
    fireEvent.change(amountInput, { target: { value: "abc" } });

    // Should not trigger conversion for invalid amount
    expect(
      screen.getByText(
        "Enter an amount and select currencies to see the conversion"
      )
    ).toBeInTheDocument();
  }, 10000);

  it("handles zero amount", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for currencies to load
    await waitFor(
      () => {
        const fromSelector = screen.getByLabelText("From Currency");
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    const fromSelector = screen.getByLabelText("From Currency");
    const toSelector = screen.getByLabelText("To Currency");
    const amountInput = screen.getByLabelText("Amount");

    fireEvent.change(fromSelector, { target: { value: "USD" } });
    fireEvent.change(toSelector, { target: { value: "EUR" } });
    fireEvent.change(amountInput, { target: { value: "0" } });

    // Should not trigger conversion for zero amount
    expect(
      screen.getByText(
        "Enter an amount and select currencies to see the conversion"
      )
    ).toBeInTheDocument();
  }, 10000);

  it("maintains state correctly during currency swaps", async () => {
    render(
      <TestWrapper>
        <Home />
      </TestWrapper>
    );

    // Wait for currencies to load
    await waitFor(
      () => {
        const fromSelector = screen.getByLabelText("From Currency");
        fireEvent.click(fromSelector);
        const usdOptions = screen.getAllByText("US Dollar | USD | $");
        expect(usdOptions.length).toBeGreaterThan(0);
      },
      { timeout: 5000 }
    );

    const fromSelector = screen.getByLabelText("From Currency");
    const toSelector = screen.getByLabelText("To Currency");
    const amountInput = screen.getByLabelText("Amount");
    const swapButton = screen.getByRole("button", { name: "Swap currencies" });

    // Set up initial state
    fireEvent.change(fromSelector, { target: { value: "USD" } });
    fireEvent.change(toSelector, { target: { value: "EUR" } });
    fireEvent.change(amountInput, { target: { value: "100" } });

    await waitFor(
      () => {
        expect(fromSelector).toHaveValue("USD");
        expect(toSelector).toHaveValue("EUR");
        expect(amountInput).toHaveValue("100");
      },
      { timeout: 5000 }
    );

    // Swap currencies
    fireEvent.click(swapButton);

    await waitFor(
      () => {
        expect(fromSelector).toHaveValue("EUR");
        expect(toSelector).toHaveValue("USD");
        expect(amountInput).toHaveValue("100");
      },
      { timeout: 5000 }
    );
  }, 10000);
});
