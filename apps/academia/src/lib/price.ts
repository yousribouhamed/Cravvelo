interface PriceFormatterOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formats a price value to Algerian Dinar (DZD) currency format
 */
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("ar-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Creates a configurable price formatter
 */
const createPriceFormatter = (options: PriceFormatterOptions = {}) => {
  const defaultOptions: Required<PriceFormatterOptions> = {
    locale: "ar-DZ",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  const config = { ...defaultOptions, ...options };

  return (price: number): string => {
    return new Intl.NumberFormat(config.locale, {
      style: "currency",
      currency: config.currency,
      minimumFractionDigits: config.minimumFractionDigits,
      maximumFractionDigits: config.maximumFractionDigits,
    }).format(price);
  };
};

export { formatPrice, createPriceFormatter };
export type { PriceFormatterOptions };
