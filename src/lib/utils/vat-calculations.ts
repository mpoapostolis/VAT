import Decimal from 'decimal.js';

export const calculateVat = (amount: number, vatRate: number): number => {
  const decimalAmount = new Decimal(amount);
  const decimalVatRate = new Decimal(vatRate).dividedBy(100);
  return decimalAmount.times(decimalVatRate).toNumber();
};

export const calculateTotalWithVat = (amount: number, vatRate: number): number => {
  const vat = calculateVat(amount, vatRate);
  return new Decimal(amount).plus(vat).toNumber();
};

export const calculateNetAmount = (grossAmount: number, vatRate: number): number => {
  const decimalGross = new Decimal(grossAmount);
  const decimalVatRate = new Decimal(vatRate).dividedBy(100).plus(1);
  return decimalGross.dividedBy(decimalVatRate).toNumber();
};