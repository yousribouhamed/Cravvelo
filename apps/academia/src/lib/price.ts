interface PriceFormatterOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Formats a price value to currency format
 * @param price - The price value to format
 * @param currency - Optional currency code (default: "DZD")
 * @param locale - Optional locale code (default: "ar-DZ")
 */
const formatPrice = (
  price: number,
  currency: string = "DZD",
  locale: string = "ar-DZ"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
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
