import React from 'react';
import { motion } from 'framer-motion';
import { DatePicker } from '@/components/ui/DatePicker';
import { CategorySelect } from '@/components/categories/CategorySelect';
import {
  FunnelIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface InvoiceFilters {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
}

interface InvoiceFiltersProps {
  filters: InvoiceFilters;
  onFilterChange: (filters: InvoiceFilters) => void;
  onReset: () => void;
}

export function InvoiceFilters({ filters, onFilterChange, onReset }: InvoiceFiltersProps) {
  const handleChange = (key: keyof InvoiceFilters, value: any) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Filters</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <ArrowPathIcon className="h-4 w-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={onReset}
            className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleChange('status', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category
          </label>
          <CategorySelect
            value={filters.categoryId}
            onChange={(value) => handleChange('categoryId', value)}
            type="REVENUE"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date From
          </label>
          <DatePicker
            value={filters.dateFrom as Date}
            onChange={(date) => handleChange('dateFrom', date)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Date To
          </label>
          <DatePicker
            value={filters.dateTo as Date}
            onChange={(date) => handleChange('dateTo', date)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min Amount
          </label>
          <input
            type="number"
            value={filters.minAmount || ''}
            onChange={(e) => handleChange('minAmount', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            placeholder="0.00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Amount
          </label>
          <input
            type="number"
            value={filters.maxAmount || ''}
            onChange={(e) => handleChange('maxAmount', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2"
            placeholder="0.00"
          />
        </div>
      </div>
    </motion.div>
  );
}