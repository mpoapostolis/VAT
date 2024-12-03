import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useSWR from 'swr';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PageHeader } from '@/components/ui/page-header';
import { customerService } from '@/lib/services/customer-service';
import { useToast } from '@/lib/hooks/useToast';
import type { Customer } from '@/lib/pocketbase';

export function EditCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: customer } = useSWR<Customer>(
    id ? `customers/${id}` : null,
    () => customerService.getById(id!)
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Customer>({
    defaultValues: customer,
  });

  const onSubmit = async (data: Partial<Customer>) => {
    if (!id) return;
    try {
      await customerService.update(id, data);
      addToast('Customer updated successfully', 'success');
      navigate('/customers');
    } catch (error) {
      addToast('Failed to update customer', 'error');
    }
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const headerActions = (
    <>
      <Button variant="outline" onClick={() => navigate('/customers')}>
        Cancel
      </Button>
      <Button type="submit" form="customer-form">
        Save Changes
      </Button>
    </>
  );

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <PageHeader
          title="Edit Customer"
          subtitle="Update customer information"
          onBack={() => navigate('/customers')}
          actions={headerActions}
        />

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
          <form id="customer-form" onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
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
                className="w-full h-24 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-none"
              />
            </FormItem>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}