import { describe, it, expect, vi } from "vitest";
import { useCurrencies } from "./useCurrencies";

// Mock the API function
vi.mock("../api/currencyBeacon", () => ({
  fetchCurrencies: vi.fn(),
}));

describe("useCurrencies", () => {
  it("is a function that can be called", () => {
    // Test that the hook is a function
    expect(typeof useCurrencies).toBe("function");

    // Test that it can be called without throwing
    expect(() => useCurrencies()).not.toThrow();
  });
});
