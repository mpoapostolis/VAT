import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VatReturn } from '@/types';

const vatReturnSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
  salesVat: z.number().min(0, 'Sales VAT must be non-negative'),
  purchasesVat: z.number().min(0, 'Purchases VAT must be non-negative'),
  adjustments: z.number(),
  notes: z.string().optional()
});

type VatReturnFormData = z.infer<typeof vatReturnSchema>;

interface VatReturnFormProps {
  initialData?: Partial<VatReturn>;
  onSubmit: (data: VatReturnFormData) => void;
}

export function VatReturnForm({ initialData, onSubmit }: VatReturnFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<VatReturnFormData>({
    resolver: zodResolver(vatReturnSchema),
    defaultValues: initialData
  });

  const salesVat = watch('salesVat') || 0;
  const purchasesVat = watch('purchasesVat') || 0;
  const adjustments = watch('adjustments') || 0;
  const netVatDue = salesVat - purchasesVat + adjustments;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            {...register('startDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.startDate && (
            <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            {...register('endDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.endDate && (
            <p className="mt-1 text-sm text-red-600">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            VAT on Sales
          </label>
          <input
            type="number"
            step="0.01"
            {...register('salesVat')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.salesVat && (
            <p className="mt-1 text-sm text-red-600">{errors.salesVat.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            VAT on Purchases
          </label>
          <input
            type="number"
            step="0.01"
            {...register('purchasesVat')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          {errors.purchasesVat && (
            <p className="mt-1 text-sm text-red-600">{errors.purchasesVat.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Adjustments
        </label>
        <input
          type="number"
          step="0.01"
          {...register('adjustments')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.adjustments && (
          <p className="mt-1 text-sm text-red-600">{errors.adjustments.message}</p>
        )}
      </div>

      <div className="bg-gray-50 p-4 rounded-md">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Net VAT Due:</span>
          <span className="text-xl font-bold">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'EUR'
            }).format(netVatDue)}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          {...register('notes')}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit VAT Return
        </button>
      </div>
    </form>
  );
}