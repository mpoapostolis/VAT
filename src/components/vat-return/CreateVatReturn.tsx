import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface VatReturnFormData {
  period: string;
  startDate: string;
  endDate: string;
  salesVat: number;
  purchasesVat: number;
  notes?: string;
}

const periodOptions = [
  { value: 'Q1', label: 'Q1 2024' },
  { value: 'Q2', label: 'Q2 2024' },
  { value: 'Q3', label: 'Q3 2024' },
  { value: 'Q4', label: 'Q4 2024' },
];

export function CreateVatReturn() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VatReturnFormData>();

  const salesVat = watch('salesVat', 0);
  const purchasesVat = watch('purchasesVat', 0);
  const netVat = (salesVat || 0) - (purchasesVat || 0);

  const onSubmit = async (data: VatReturnFormData) => {
    try {
      // Handle VAT return creation
      navigate('/vat-return');
    } catch (error) {
      console.error('Failed to create VAT return:', error);
    }
  };

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
            <h1 className="text-2xl font-semibold text-gray-900">New VAT Return</h1>
            <p className="text-sm text-gray-500 mt-1">Prepare a new VAT return</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Select
                  options={periodOptions}
                  placeholder="Select period"
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
                  placeholder="Enter sales VAT amount"
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
                  placeholder="Enter purchases VAT amount"
                />
                {errors.purchasesVat && (
                  <FormMessage>{errors.purchasesVat.message}</FormMessage>
                )}
              </FormItem>
            </div>

            <div className="bg-gray-50 p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Net VAT</span>
                <span className="text-lg font-bold text-gray-900">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(netVat)}
                </span>
              </div>
            </div>

            <FormItem>
              <FormLabel>Notes</FormLabel>
              <textarea
                {...register('notes')}
                className="w-full h-24 border border-gray-200 px-3 py-2"
                placeholder="Enter any additional notes"
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
                {isSubmitting ? 'Creating...' : 'Create VAT Return'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}