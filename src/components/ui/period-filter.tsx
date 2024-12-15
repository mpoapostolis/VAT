import React from 'react';
import { Calendar } from 'lucide-react';
import { Select } from './select';
import type { DateRange } from '@/lib/utils/date-utils';
import { getFixedPeriodRange, getRelativePeriodRange } from '@/lib/utils/date-utils';

interface PeriodFilterProps {
  onChange: (range: DateRange) => void;
}

const periodOptions = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last-7-days', label: 'Last 7 Days' },
  { value: 'last-30-days', label: 'Last 30 Days' },
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'last-quarter', label: 'Last Quarter' },
  { value: 'this-year', label: 'This Year' },
  { value: 'last-year', label: 'Last Year' },
];

export function PeriodFilter({ onChange }: PeriodFilterProps) {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    let range: DateRange;

    switch (value) {
      case 'today':
        const today = new Date();
        range = { startDate: today, endDate: today };
        break;
      case 'yesterday':
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        range = { startDate: yesterday, endDate: yesterday };
        break;
      case 'last-7-days':
        range = getRelativePeriodRange(7, 'days');
        break;
      case 'last-30-days':
        range = getRelativePeriodRange(30, 'days');
        break;
      case 'this-month':
        range = getFixedPeriodRange('this-month');
        break;
      case 'last-month':
        range = getFixedPeriodRange('last-month');
        break;
      case 'this-quarter':
        range = getFixedPeriodRange('this-quarter');
        break;
      case 'last-quarter':
        range = getFixedPeriodRange('last-quarter');
        break;
      case 'this-year':
        range = getFixedPeriodRange('this-year');
        break;
      case 'last-year':
        range = getFixedPeriodRange('last-year');
        break;
      default:
        return;
    }

    onChange(range);
  };

  return (
    <div className="flex items-center gap-2">
      <Calendar className="w-4 h-4 text-gray-500" />
      <Select
        defaultValue="this-month"
        onChange={handleChange}
        className="w-40"
        options={periodOptions}
      />
    </div>
  );
}
