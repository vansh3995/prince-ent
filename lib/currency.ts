export const CURRENCY_CODES = {
  INR: "₹",
  USD: "$",
  EUR: "",
  GBP: "",
  JPY: "",
  CAD: "C$",
  AUD: "A$",
  SGD: "S$",
  AED: "د.إ",
  SAR: ""
} as const

export type CurrencyCode = keyof typeof CURRENCY_CODES

export function formatCurrency(amount: number, currency: CurrencyCode = "INR"): string {
  const symbol = CURRENCY_CODES[currency]
  
  // Format number with commas
  const formattedAmount = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return `${symbol}${formattedAmount}`
}

export function parseCurrency(currencyString: string): number {
  // Remove currency symbols and commas, then parse
  const numericString = currencyString.replace(/[^\d.-]/g, "")
  return parseFloat(numericString) || 0
}

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode,
  exchangeRate: number = 1
): number {
  if (fromCurrency === toCurrency) {
    return amount
  }
  
  return amount * exchangeRate
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return CURRENCY_CODES[currency] || "₹"
}