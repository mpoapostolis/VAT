import React from 'react';
import { motion } from 'framer-motion';
import {
  FunnelIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { useCategories } from '@/lib/hooks/useCategories';

interface CategoryFilters {
  type?: string;
  search?: string;
  parentId?: string;
}

interface CategoryFiltersProps {
  filters: CategoryFilters;
  onFilterChange: (filters: CategoryFilters) => void;
  onReset: () => void;
}

export function CategoryFilters({ filters, onFilterChange, onReset }: CategoryFiltersProps) {
  const { categories } = useCategories();
  const parentCategories = categories.filter(c => !c.parentId);

  const handleChange = (key: keyof CategoryFilters, value: any) => {
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search
          </label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => handleChange('search', e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => handleChange('type', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5"
          >
            <option value="">All Types</option>
            <option value="REVENUE">Revenue</option>
            <option value="EXPENSE">Expense</option>
            <option value="VAT">VAT</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Parent Category
          </label>
          <select
            value={filters.parentId || ''}
            onChange={(e) => handleChange('parentId', e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2.5"
          >
            <option value="">All Categories</option>
            {parentCategories.map(category => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}