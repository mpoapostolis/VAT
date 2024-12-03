import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { pb } from '@/lib/pocketbase';
import type { Invoice } from '@/lib/pocketbase';
import { useToast } from '@/lib/hooks/useToast';

export function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: invoice } = useSWR<Invoice>(`invoices/${id}`);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Invoice>({
    defaultValues: invoice,
  });

  const onSubmit = async (data: Invoice) => {
    try {
      await pb.collection('invoices').update(id!, data);
      addToast('Invoice updated successfully', 'success');
      navigate('/invoices');
    } catch (error) {
      addToast('Failed to update invoice', 'error');
    }
  };

  if (!invoice) return null;

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/invoices')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Invoice</h1>
            <p className="text-sm text-gray-500 mt-1">Update invoice details</p>
          </div>
        </div>

        <div className="bg-white p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Add form fields similar to CreateInvoice */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => navigate('/invoices')}>
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
