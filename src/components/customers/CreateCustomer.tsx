import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { pb } from '@/lib/pocketbase';
import type { Customer } from '@/lib/pocketbase';

type CustomerFormData = Omit<Customer, 'id'>;

export function CreateCustomer() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerFormData>();

  const onSubmit = async (data: CustomerFormData) => {
    try {
      await pb.collection('customers').create(data);
      navigate('/customers');
    } catch (error) {
      console.error('Failed to create customer:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/customers')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">New Customer</h1>
            <p className="text-sm text-gray-500 mt-1">Add a new customer to your list</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <FormItem>
              <FormLabel>Company Name</FormLabel>
              <Input
                {...register('name', { required: 'Company name is required' })}
                placeholder="Enter company name"
                className="border-gray-200"
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
                placeholder="Enter email address"
                className="border-gray-200"
              />
              {errors.email && <FormMessage>{errors.email.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <Input
                {...register('phone', { required: 'Phone number is required' })}
                placeholder="Enter phone number"
                className="border-gray-200"
              />
              {errors.phone && <FormMessage>{errors.phone.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel>Tax Registration Number</FormLabel>
              <Input
                {...register('trn', { required: 'TRN is required' })}
                placeholder="Enter tax registration number"
                className="border-gray-200"
              />
              {errors.trn && <FormMessage>{errors.trn.message}</FormMessage>}
            </FormItem>
          </div>

          <FormItem>
            <FormLabel>Address</FormLabel>
            <Input
              {...register('address', { required: 'Address is required' })}
              placeholder="Enter complete address"
              className="border-gray-200"
            />
            {errors.address && <FormMessage>{errors.address.message}</FormMessage>}
          </FormItem>

          <FormItem>
            <FormLabel>Notes</FormLabel>
            <Input
              {...register('notes')}
              placeholder="Enter additional notes"
              className="border-gray-200"
            />
          </FormItem>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/customers')}
              className="border-gray-200 hover:border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#0066FF] hover:bg-blue-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Customer'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}