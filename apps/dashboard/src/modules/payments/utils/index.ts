const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  EUR: "€",
  DZD: "د.ج",
};

export const formatCurrency = ({
  amount,
  currency,
  fractionDigits = 2,
}: {
  amount: number;
  currency: string;
  fractionDigits?: number;
}) => {
  const symbol = CURRENCY_SYMBOLS[currency] ?? currency;
  const value =
    fractionDigits === 0
      ? Math.round(amount).toLocaleString()
      : amount.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
  return `${value} ${symbol}`.trim();
};

/** Format amount with no decimals and currency symbol (e.g. "46 000 د.ج") */
export const formatCurrencyCompact = ({
  amount,
  currency,
}: {
  amount: number;
  currency: string;
}) => formatCurrency({ amount, currency, fractionDigits: 0 });
