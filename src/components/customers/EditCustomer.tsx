import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { ArrowLeft } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { pb } from '@/lib/pocketbase';
import type { Customer } from '@/lib/pocketbase';
import { useToast } from '@/lib/hooks/useToast';

export function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: customer } = useSWR<Customer>(`customers/${id}`);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Customer>({
    defaultValues: customer,
  });

  const onSubmit = async (data: Customer) => {
    try {
      await pb.collection('customers').update(id!, data);
      addToast('Customer updated successfully', 'success');
      navigate('/customers');
    } catch (error) {
      addToast('Failed to update customer', 'error');
    }
  };

  if (!customer) return null;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/customers')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Customer</h1>
            <p className="text-sm text-gray-500 mt-1">Update customer information</p>
          </div>
        </div>

        <div className="bg-white">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <Input
                  {...register('name', { required: 'Company name is required' })}
                  defaultValue={customer.name}
                />
                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  defaultValue={customer.email}
                />
                {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <Input
                  {...register('phone', { required: 'Phone number is required' })}
                  defaultValue={customer.phone}
                />
                {errors.phone && <FormMessage>{errors.phone.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel>Tax Registration Number</FormLabel>
                <Input
                  {...register('trn', { required: 'TRN is required' })}
                  defaultValue={customer.trn}
                />
                {errors.trn && <FormMessage>{errors.trn.message}</FormMessage>}
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Address</FormLabel>
              <Input
                {...register('address', { required: 'Address is required' })}
                defaultValue={customer.address}
              />
              {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel>Notes</FormLabel>
              <textarea
                {...register('notes')}
                defaultValue={customer.notes}
                className="w-full h-24 px-3 py-2 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </FormItem>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/customers')}
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
