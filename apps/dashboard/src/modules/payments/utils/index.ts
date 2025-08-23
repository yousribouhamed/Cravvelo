export const formatCurrency = ({
  amount,
  currency,
}: {
  amount: number;
  currency: "DZD";
}) => {
  const currencySymbols = {
    USD: "$",
    EUR: "€",
    DZD: "د.ج",
  };
  const symbol = currencySymbols[currency] || currency;
  return `${amount.toFixed(2)}${symbol}`;
};
