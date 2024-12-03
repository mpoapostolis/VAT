import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { ArrowLeft } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { pb } from '@/lib/pocketbase';
import type { Category } from '@/lib/pocketbase';
import { useToast } from '@/lib/hooks/useToast';

const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: category } = useSWR<Category>(`categories/${id}`);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Category>({
    defaultValues: category,
  });

  const onSubmit = async (data: Category) => {
    try {
      await pb.collection('categories').update(id!, data);
      addToast('Category updated successfully', 'success');
      navigate('/categories');
    } catch (error) {
      addToast('Failed to update category', 'error');
    }
  };

  if (!category) return null;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/categories')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
            <p className="text-sm text-gray-500 mt-1">Update category details</p>
          </div>
        </div>

        <div className="bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <Input
                  {...register('name', { required: 'Category name is required' })}
                  defaultValue={category.name}
                />
                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  options={typeOptions}
                  value={category.type}
                  onChange={(value) => setValue('type', value as 'income' | 'expense')}
                  error={!!errors.type}
                />
                {errors.type && <FormMessage>{errors.type.message}</FormMessage>}
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <Input
                {...register('description', { required: 'Description is required' })}
                defaultValue={category.description}
              />
              {errors.description && (
                <FormMessage>{errors.description.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Monthly Budget (Optional)</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register('budget', { min: 0 })}
                defaultValue={category.budget}
              />
            </FormItem>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/categories')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
