import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/ui/page-header';
import { categoryService } from '@/lib/services/category-service';
import { useToast } from '@/lib/hooks/useToast';
import type { Category } from '@/lib/pocketbase';

const typeOptions = [
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expense' },
];

export function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: category } = useSWR<Category>(
    id ? `categories/${id}` : null,
    () => categoryService.getById(id!)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Category>({
    defaultValues: category,
  });

  const onSubmit = async (data: Partial<Category>) => {
    if (!id) return;
    try {
      await categoryService.update(id, data);
      addToast('Category updated successfully', 'success');
      navigate('/categories');
    } catch (error) {
      addToast('Failed to update category', 'error');
    }
  };

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const headerActions = (
    <>
      <Button variant="outline" onClick={() => navigate('/categories')}>
        Cancel
      </Button>
      <Button type="submit" form="category-form">
        Save Changes
      </Button>
    </>
  );

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <PageHeader
          title="Edit Category"
          subtitle="Update category details"
          onBack={() => navigate('/categories')}
          actions={headerActions}
        />

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
          <form id="category-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
              <textarea
                {...register('description', { required: 'Description is required' })}
                defaultValue={category.description}
                className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-none"
              />
              {errors.description && (
                <FormMessage>{errors.description.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Budget (Optional)</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register('budget', { min: 0 })}
                defaultValue={category.budget}
              />
            </FormItem>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}