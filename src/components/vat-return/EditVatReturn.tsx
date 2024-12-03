import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { pb } from '@/lib/pocketbase';
import { useToast } from '@/lib/hooks/useToast';
import useSWR from 'swr';

const periodOptions = [
  { value: 'Q1', label: 'Q1 2024' },
  { value: 'Q2', label: 'Q2 2024' },
  { value: 'Q3', label: 'Q3 2024' },
  { value: 'Q4', label: 'Q4 2024' },
];

export function EditVatReturn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: vatReturn } = useSWR(`vat-returns/${id}`);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: vatReturn,
  });

  const onSubmit = async (data: any) => {
    try {
      await pb.collection('vat-returns').update(id!, data);
      addToast('VAT return updated successfully', 'success');
      navigate('/vat-return');
    } catch (error) {
      addToast('Failed to update VAT return', 'error');
    }
  };

  if (!vatReturn) return null;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/vat-return')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit VAT Return</h1>
            <p className="text-sm text-gray-500 mt-1">Update VAT return details</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select
                  options={periodOptions}
                  value={vatReturn.period}
                  onChange={(value) => setValue('period', value)}
                  error={!!errors.period}
                />
                {errors.period && <FormMessage>{errors.period.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  {...register('startDate', { required: 'Start date is required' })}
                  defaultValue={vatReturn.startDate}
                />
                {errors.startDate && (
                  <FormMessage>{errors.startDate.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  {...register('endDate', { required: 'End date is required' })}
                  defaultValue={vatReturn.endDate}
                />
                {errors.endDate && <FormMessage>{errors.endDate.message}</FormMessage>}
              </FormItem>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Sales VAT</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register('salesVat', {
                    required: 'Sales VAT is required',
                    min: 0,
                  })}
                  defaultValue={vatReturn.salesVat}
                />
                {errors.salesVat && (
                  <FormMessage>{errors.salesVat.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Purchases VAT</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register('purchasesVat', {
                    required: 'Purchases VAT is required',
                    min: 0,
                  })}
                  defaultValue={vatReturn.purchasesVat}
                />
                {errors.purchasesVat && (
                  <FormMessage>{errors.purchasesVat.message}</FormMessage>
                )}
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Notes</FormLabel>
              <textarea
                {...register('notes')}
                defaultValue={vatReturn.notes}
                className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-none"
              />
            </FormItem>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/vat-return')}
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