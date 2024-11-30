import React from 'react';
import { motion } from 'framer-motion';
import { AccountingCategory } from '@/types';
import { useCategories } from '@/lib/hooks/useCategories';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface CategoryCardProps {
  category: AccountingCategory;
  layout?: 'grid' | 'list';
  onEdit: () => void;
}

export function CategoryCard({ category, layout = 'grid', onEdit }: CategoryCardProps) {
  const { categories, deleteCategory } = useCategories();
  const parentCategory = categories.find(c => c.id === category.parentId);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteCategory(category.id);
    }
  };

  if (layout === 'list') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {category.name}
                </h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {category.type}
                  </span>
                  {parentCategory && (
                    <>
                      <span className="text-gray-400 dark:text-gray-600">•</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Parent: {parentCategory.name}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onEdit}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          {category.description && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {category.description}
            </p>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.color }}
            />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {category.name}
            </h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onEdit}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400">Type</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {category.type}
            </span>
          </div>

          {parentCategory && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Parent</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {parentCategory.name}
              </span>
            </div>
          )}

          {category.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 border-t border-gray-100 dark:border-gray-700 pt-3">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div
        className="h-1"
        style={{ backgroundColor: category.color }}
      />
    </motion.div>
  );
}