export const supportedCurrencies = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  GBP: { symbol: '£', rate: 0.0095 }
}

export type CurrencyCode = keyof typeof supportedCurrencies;

export function convertPrice(amount: number, from: CurrencyCode, to: CurrencyCode) {
  const baseAmount = amount / supportedCurrencies[from].rate
  return baseAmount * supportedCurrencies[to].rate
}