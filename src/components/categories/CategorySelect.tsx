import React from 'react';
import { useCategories } from '@/lib/hooks/useCategories';
import { AccountingCategory } from '@/types';
import { motion } from 'framer-motion';

interface CategorySelectProps {
  value?: string;
  onChange: (categoryId: string) => void;
  type?: AccountingCategory['type'];
  className?: string;
}

export function CategorySelect({ value, onChange, type, className }: CategorySelectProps) {
  const { categories } = useCategories();
  const filteredCategories = type 
    ? categories.filter(c => c.type === type)
    : categories;

  return (
    <div className="relative">
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-gray-900 dark:text-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${className}`}
      >
        <option value="">Select category...</option>
        {filteredCategories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.parentId ? '↳ ' : ''}{category.name}
          </option>
        ))}
      </select>
      <motion.div
        className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none"
        initial={false}
        animate={{
          rotate: value ? 180 : 0
        }}
      >
        <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </motion.div>
    </div>
  );
}