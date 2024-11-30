import React from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from '@/components/ui/Modal';
import { useCategories } from '@/lib/hooks/useCategories';
import { AccountingCategory } from '@/types';
import { toast } from 'react-hot-toast';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  category?: AccountingCategory | null;
}

export function CategoryForm({ isOpen, onClose, category }: CategoryFormProps) {
  const { categories, addCategory, updateCategory } = useCategories();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: category || {
      name: '',
      type: 'REVENUE',
      description: '',
      color: '#4F46E5',
      parentId: ''
    }
  });

  const onSubmit = async (data: any) => {
    try {
      if (category) {
        updateCategory(category.id, data);
        toast.success('Category updated successfully');
      } else {
        addCategory(data);
        toast.success('Category created successfully');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={category ? 'Edit Category' : 'New Category'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Name
          </label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Type
          </label>
          <select
            {...register('type')}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="REVENUE">Revenue</option>
            <option value="EXPENSE">Expense</option>
            <option value="VAT">VAT</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Parent Category (Optional)
          </label>
          <select
            {...register('parentId')}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          >
            <option value="">None</option>
            {categories
              .filter(c => c.id !== category?.id)
              .map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))
            }
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Color
          </label>
          <input
            type="color"
            {...register('color')}
            className="w-full h-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          >
            {category ? 'Update Category' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}