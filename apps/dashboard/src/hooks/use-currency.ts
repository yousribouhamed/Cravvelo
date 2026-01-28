"use client";

import { trpc } from "@/src/app/_trpc/client";
import { formatCurrency } from "@/src/lib/utils";
import { useCallback, useMemo } from "react";

export interface CurrencyConfig {
  currency: string;
  currencySymbol: string;
  formatPrice: (amount: number) => string;
  isLoading: boolean;
}

/**
 * Hook to get the website's currency settings and provide formatting utilities.
 * Uses the website settings to ensure consistent currency display across the dashboard.
 *
 * @example
 * const { currency, formatPrice } = useCurrency();
 * return <span>{formatPrice(100)}</span>; // "100.00 DA" or "$100.00" etc.
 */
export function useCurrency(): CurrencyConfig {
  const { data: website, isLoading } = trpc.getWebsiteAssets.useQuery(
    undefined,
    {
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
      refetchOnWindowFocus: false,
    }
  );

  const currency = website?.currency || "DZD";
  const currencySymbol = website?.currencySymbol || "DA";

  const formatPrice = useCallback(
    (amount: number): string => {
      return formatCurrency(amount, currency, currencySymbol);
    },
    [currency, currencySymbol]
  );

  return useMemo(
    () => ({
      currency,
      currencySymbol,
      formatPrice,
      isLoading,
    }),
    [currency, currencySymbol, formatPrice, isLoading]
  );
}

/**
 * Get currency configuration from server-side data
 * Use this in server components or when you already have website data
 */
export function getCurrencyConfig(website: {
  currency?: string | null;
  currencySymbol?: string | null;
} | null): Omit<CurrencyConfig, "isLoading"> {
  const currency = website?.currency || "DZD";
  const currencySymbol = website?.currencySymbol || "DA";

  return {
    currency,
    currencySymbol,
    formatPrice: (amount: number) =>
      formatCurrency(amount, currency, currencySymbol),
  };
}
