import type { ShoppegoCurrency } from '@models/shoppego';

const defaultCurrency: ShoppegoCurrency = {
  code: 'MYR',
  symbol: 'RM',
  decimal_digits: 2,
  thousand_separator: ',',
  locale: 'ms_MY'
};

export function formatMoney(amount: number, currency: ShoppegoCurrency = defaultCurrency): string {
  const decimals = Number.isInteger(currency.decimal_digits) ? currency.decimal_digits : 2;
  const fixed = Number(amount || 0).toFixed(decimals);
  const [whole, fraction] = fixed.split('.');
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, currency.thousand_separator || ',');

  return `${currency.symbol || ''}${grouped}${decimals > 0 ? `.${fraction}` : ''}`;
}

export function getCompareAtPrice(productPrice: number, compareAtPrice: number | null): number | null {
  if (compareAtPrice && compareAtPrice > productPrice) {
    return compareAtPrice;
  }

  return null;
}
