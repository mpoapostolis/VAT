import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { CategoryForm } from './CategoryForm';
import { useCategories } from '@/lib/hooks/useCategories';
import { AccountingCategory, LogisticsCategoryType } from '@/types';
import { toast } from 'react-hot-toast';
import { resetCategoryForm } from '@/lib/state/atoms';
import { 
  FolderIcon,
  PlusIcon,
  TagIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  TruckIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';

const LOGISTICS_TYPES: { type: LogisticsCategoryType; label: string; icon: string; color: string }[] = [
  { type: 'TRANSPORTATION', label: 'Transportation', icon: '', color: 'from-blue-500 to-blue-600' },
  { type: 'WAREHOUSING', label: 'Warehousing', icon: '', color: 'from-amber-500 to-amber-600' },
  { type: 'FREIGHT', label: 'Freight', icon: '', color: 'from-emerald-500 to-emerald-600' },
  { type: 'CUSTOMS', label: 'Customs', icon: '', color: 'from-purple-500 to-purple-600' },
  { type: 'PACKAGING', label: 'Packaging', icon: '', color: 'from-pink-500 to-pink-600' },
  { type: 'HANDLING', label: 'Handling', icon: '', color: 'from-orange-500 to-orange-600' },
  { type: 'DISTRIBUTION', label: 'Distribution', icon: '', color: 'from-teal-500 to-teal-600' },
  { type: 'OTHER', label: 'Other', icon: '', color: 'from-gray-500 to-gray-600' }
];

export function CategoryList() {
  const { categories, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AccountingCategory | null>(null);
  const [, resetForm] = useAtom(resetCategoryForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'REVENUE' | 'EXPENSE' | ''>('');
  const [logisticsTypeFilter, setLogisticsTypeFilter] = useState<LogisticsCategoryType | ''>('');

  const handleSubmit = async (data: Partial<AccountingCategory>) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
        toast.success('Category updated successfully');
      } else {
        await createCategory(data);
        toast.success('Category created successfully');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    resetForm();
  };

  const handleOpenModal = (category?: AccountingCategory) => {
    resetForm();
    setEditingCategory(category || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (category: AccountingCategory) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(category.id);
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Failed to delete category');
      }
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = !searchTerm || 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.metadata?.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = !typeFilter || category.type === typeFilter;
    const matchesLogistics = !logisticsTypeFilter || category.logisticsType === logisticsTypeFilter;
    return matchesSearch && matchesType && matchesLogistics;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your logistics and accounting categories
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleOpenModal()}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Category
        </motion.button>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          />
          <FunnelIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <div className="flex space-x-4">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'REVENUE' | 'EXPENSE' | '')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          >
            <option value="">All Types</option>
            <option value="REVENUE">Revenue</option>
            <option value="EXPENSE">Expense</option>
          </select>
          <select
            value={logisticsTypeFilter}
            onChange={(e) => setLogisticsTypeFilter(e.target.value as LogisticsCategoryType | '')}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          >
            <option value="">All Logistics Types</option>
            {LOGISTICS_TYPES.map(({ type, label }) => (
              <option key={type} value={type}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <AnimatePresence>
        {filteredCategories.map((category) => {
          const logisticsType = LOGISTICS_TYPES.find(t => t.type === category.logisticsType);
          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200"
            >
              <div className="flex items-center p-4">
                {/* Left Side - Icon & Type Indicator */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    logisticsType 
                      ? `bg-gradient-to-br ${logisticsType.color}`
                      : category.type === 'REVENUE'
                        ? 'bg-gradient-to-br from-green-500 to-green-600'
                        : 'bg-gradient-to-br from-red-500 to-red-600'
                  }`}>
                    {logisticsType ? (
                      <span className="text-2xl">{logisticsType.icon}</span>
                    ) : (
                      <FolderIcon className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                    category.type === 'REVENUE'
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-red-100 dark:bg-red-900'
                  }`}>
                    <ChartBarIcon className={`h-4 w-4 ${
                      category.type === 'REVENUE'
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                </div>

                {/* Middle - Main Content */}
                <div className="flex-1 ml-4">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {category.name}
                    </h3>
                    {category.vatRate && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                        {category.vatRate}% VAT
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    {logisticsType && (
                      <span className="flex items-center">
                        <TruckIcon className="h-4 w-4 mr-1" />
                        {logisticsType.label}
                      </span>
                    )}
                    {category.parentId && (
                      <span className="flex items-center">
                        <ArrowUpIcon className="h-4 w-4 mr-1" />
                        {categories.find(c => c.id === category.parentId)?.name}
                      </span>
                    )}
                  </div>

                  {category.description && (
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                      {category.description}
                    </p>
                  )}

                  {category.metadata?.tags && category.metadata.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {category.metadata.tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            logisticsType
                              ? `bg-${logisticsType.color.split('-')[1]}-100 dark:bg-${logisticsType.color.split('-')[1]}-900/20 
                                 text-${logisticsType.color.split('-')[1]}-800 dark:text-${logisticsType.color.split('-')[1]}-200`
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right Side - Actions */}
                <div className="ml-4 flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleOpenModal(category)}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(category)}
                    className="p-2 rounded-full text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Edit Category' : 'Add Category'}
        maxWidth="xl"
      >
        <CategoryForm
          onSubmit={handleSubmit}
          initialData={editingCategory || undefined}
        />
      </Modal>
    </div>
  );
}
