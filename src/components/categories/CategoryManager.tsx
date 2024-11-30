import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '@/lib/hooks/useCategories';
import { AccountingCategory } from '@/types';
import { CategoryForm } from './CategoryForm';
import { CategoryFilters } from './CategoryFilters';
import { CategoryCard } from './CategoryCard';
import { ViewToggle } from '../ui/ViewToggle';
import { 
  PlusIcon, 
  FunnelIcon,
  FolderIcon 
} from '@heroicons/react/24/outline';

interface CategoryFilters {
  type?: string;
  search?: string;
  parentId?: string;
}

export function CategoryManager() {
  const { categories } = useCategories();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CategoryFilters>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AccountingCategory | null>(null);

  const filteredCategories = categories.filter(category => {
    if (filters.type && category.type !== filters.type) return false;
    if (filters.parentId && category.parentId !== filters.parentId) return false;
    if (filters.search && !category.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent font-display">
            Categories
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Manage your accounting categories
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <ViewToggle view={view} onViewChange={setView} />
          <button
            onClick={() => {
              setEditingCategory(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Category
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <CategoryFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      {filteredCategories.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FolderIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No categories</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new category
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              New Category
            </button>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className={
              view === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'space-y-4'
            }
          >
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                layout={view}
                onEdit={() => {
                  setEditingCategory(category);
                  setIsFormOpen(true);
                }}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <CategoryForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingCategory(null);
        }}
        category={editingCategory}
      />
    </div>
  );
}