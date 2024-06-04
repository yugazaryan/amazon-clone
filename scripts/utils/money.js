export function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2);
}
// priceCents, using toFixed(2) to show price with 2 decimals after the dot
