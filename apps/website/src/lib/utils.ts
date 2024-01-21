export function translateCurrency(amount, toCurrency) {
  // Exchange rates (as of the last available data, you might want to update them)
  const usdToEurRate = 0.92; // 1 USD = 0.88 EUR
  const usdToDzdRate = 199; // 1 USD = 135.5 DZD

  // Check if the input amount is a valid number
  if (typeof amount !== "number" || isNaN(amount)) {
    throw new Error("Amount must be a valid number");
  }

  // Check if the target currency is valid
  const validCurrencies = ["USD", "EUR", "DZD"];
  if (!validCurrencies.includes(toCurrency)) {
    throw new Error('Invalid currency. Use "USD", "EUR", or "DZD"');
  }

  // Convert amount to the target currency
  switch (toCurrency) {
    case "EUR":
      return amount * usdToEurRate;
    case "DZD":
      return amount * usdToDzdRate;
    // If the target currency is the same as the source currency, return the original amount
    case "USD":
    default:
      return amount;
  }
}
