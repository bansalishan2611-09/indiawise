export function formatIndianCurrency(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatIndianNumber(value: number): string {
  if (isNaN(value) || !isFinite(value)) return '0';
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(value);
}

export function parseInputValue(val: string | number): number {
  const parsed = typeof val === 'string' ? parseFloat(val.replace(/,/g, '')) : val;
  return isNaN(parsed) ? 0 : parsed;
}
