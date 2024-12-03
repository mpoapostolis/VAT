import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { pb } from '@/lib/pocketbase';
import { generateInvoiceNumber } from '@/lib/utils';
import type { Invoice, Customer } from '@/lib/pocketbase';

type InvoiceFormData = Omit<Invoice, 'id'>;

export function CreateInvoice() {
  const navigate = useNavigate();
  const { data: customersData } = useSWR<{ items: Customer[] }>('customers');
  
  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceFormData>({
    defaultValues: {
      number: generateInvoiceNumber(),
      status: 'draft',
      items: [{ description: '', quantity: 1, price: 0, vat: 0, total: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = watch('items');
  
  React.useEffect(() => {
    const subtotal = items.reduce((sum, item) => {
      const total = (item.quantity || 0) * (item.price || 0);
      return sum + total;
    }, 0);

    const vat = items.reduce((sum, item) => {
      const total = (item.quantity || 0) * (item.price || 0);
      return sum + (total * (item.vat || 0)) / 100;
    }, 0);

    setValue('subtotal', subtotal);
    setValue('vat', vat);
    setValue('total', subtotal + vat);
  }, [items, setValue]);

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      await pb.collection('invoices').create(data);
      navigate('/invoices');
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/invoices')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">New Invoice</h1>
            <p className="text-sm text-gray-500 mt-1">Create a new invoice</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
          <div className="grid grid-cols-2 gap-6">
            <FormItem>
              <FormLabel>Invoice Number</FormLabel>
              <Input {...register('number')} readOnly className="bg-gray-50" />
            </FormItem>

            <FormItem>
              <FormLabel>Customer</FormLabel>
              <select
                {...register('customerId', { required: 'Customer is required' })}
                className="w-full h-10 bg-white border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select a customer</option>
                {customersData?.items.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <FormMessage>{errors.customerId.message}</FormMessage>
              )}
            </FormItem>

            <FormItem>
              <FormLabel>Date</FormLabel>
              <Input
                type="date"
                {...register('date', { required: 'Date is required' })}
                className="border-gray-200"
              />
              {errors.date && <FormMessage>{errors.date.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel>Due Date</FormLabel>
              <Input
                type="date"
                {...register('dueDate', { required: 'Due date is required' })}
                className="border-gray-200"
              />
              {errors.dueDate && (
                <FormMessage>{errors.dueDate.message}</FormMessage>
              )}
            </FormItem>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Items</h2>
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  append({
                    description: '',
                    quantity: 1,
                    price: 0,
                    vat: 0,
                    total: 0,
                  })
                }
                className="border-gray-200 hover:border-gray-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="border border-gray-200">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 last:border-0"
                >
                  <div className="col-span-4">
                    <Input
                      {...register(`items.${index}.description` as const, {
                        required: 'Description is required',
                      })}
                      placeholder="Item description"
                      className="border-gray-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      {...register(`items.${index}.quantity` as const, {
                        valueAsNumber: true,
                        min: 1,
                      })}
                      placeholder="Qty"
                      className="border-gray-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`items.${index}.price` as const, {
                        valueAsNumber: true,
                        min: 0,
                      })}
                      placeholder="Price"
                      className="border-gray-200"
                    />
                  </div>
                  <div className="col-span-2">
                    <Input
                      type="number"
                      {...register(`items.${index}.vat` as const, {
                        valueAsNumber: true,
                        min: 0,
                        max: 100,
                      })}
                      placeholder="VAT %"
                      className="border-gray-200"
                    />
                  </div>
                  <div className="col-span-2 flex items-center justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/invoices')}
              className="border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#0066FF] hover:bg-blue-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}