import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from './button';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

export function DateRangePicker() {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: null,
    endDate: null,
  });

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({
      ...prev,
      startDate: e.target.value ? new Date(e.target.value) : null,
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange(prev => ({
      ...prev,
      endDate: e.target.value ? new Date(e.target.value) : null,
    }));
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="date"
          value={dateRange.startDate?.toISOString().split('T')[0] || ''}
          onChange={handleStartDateChange}
          className="pl-10 pr-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <span className="text-gray-500">to</span>
      <div className="relative">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="date"
          value={dateRange.endDate?.toISOString().split('T')[0] || ''}
          onChange={handleEndDateChange}
          className="pl-10 pr-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    </div>
  );
}