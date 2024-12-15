import { startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, subDays, subMonths, subQuarters, subYears } from 'date-fns';

export type PeriodType = 'custom' | 'relative' | 'fixed';
export type RelativeUnit = 'days' | 'weeks' | 'months';
export type FixedPeriod = 
  | 'this-month' 
  | 'last-month' 
  | 'this-quarter' 
  | 'last-quarter' 
  | 'this-year' 
  | 'last-year';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function getFixedPeriodRange(period: FixedPeriod): DateRange {
  const now = new Date();

  switch (period) {
    case 'this-month':
      return {
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
      };
    case 'last-month':
      const lastMonth = subMonths(now, 1);
      return {
        startDate: startOfMonth(lastMonth),
        endDate: endOfMonth(lastMonth),
      };
    case 'this-quarter':
      return {
        startDate: startOfQuarter(now),
        endDate: endOfQuarter(now),
      };
    case 'last-quarter':
      const lastQuarter = subQuarters(now, 1);
      return {
        startDate: startOfQuarter(lastQuarter),
        endDate: endOfQuarter(lastQuarter),
      };
    case 'this-year':
      return {
        startDate: startOfYear(now),
        endDate: endOfYear(now),
      };
    case 'last-year':
      const lastYear = subYears(now, 1);
      return {
        startDate: startOfYear(lastYear),
        endDate: endOfYear(lastYear),
      };
  }
}

export function getRelativePeriodRange(value: number, unit: RelativeUnit): DateRange {
  const endDate = new Date();
  let startDate: Date;

  switch (unit) {
    case 'days':
      startDate = subDays(endDate, value);
      break;
    case 'weeks':
      startDate = subDays(endDate, value * 7);
      break;
    case 'months':
      startDate = subMonths(endDate, value);
      break;
  }

  return { startDate, endDate };
}

export function formatDateToISO(date: Date): string {
  return date.toISOString().split('T')[0];
}
