/**
 * German/European EUR display format: comma decimal separator, symbol
 * after the amount with a space (e.g. "5,99 €", not "€5.99" or "5.99 EUR").
 */
export function formatEur(amount: string | number): string {
  const value = typeof amount === "number" ? amount.toFixed(2) : amount;
  return `${value.replace(".", ",")} €`;
}
