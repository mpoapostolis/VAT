export const currencies = {
  AED: { symbol: 'AED', name: 'UAE Dirham', rate: 1 },
  USD: { symbol: '$', name: 'US Dollar', rate: 3.6725 },
  EUR: { symbol: '€', name: 'Euro', rate: 4.0123 },
  GBP: { symbol: '£', name: 'British Pound', rate: 4.6789 },
};

export function convertCurrency(
  amount: number,
  fromCurrency: keyof typeof currencies,
  toCurrency: keyof typeof currencies
): number {
  const fromRate = currencies[fromCurrency].rate;
  const toRate = currencies[toCurrency].rate;
  return (amount * toRate) / fromRate;
}

export function formatCurrencyWithSymbol(
  amount: number,
  currency: keyof typeof currencies
): string {
  return `${currencies[currency].symbol} ${amount.toFixed(2)}`;
}