import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { InvoiceForm } from './create/invoice-form';
import { useToast } from '@/lib/hooks/useToast';
import useSWR from 'swr';
import type { Customer, Invoice } from '@/lib/pocketbase';
import { invoiceService } from '@/lib/services/invoice-service';

export function CreateInvoice() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: customersData } = useSWR<{ items: Customer[] }>('customers');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: Omit<Invoice, 'id'>) => {
    setIsSubmitting(true);
    try {
      await invoiceService.create(data);
      addToast('Invoice created successfully', 'success');
      navigate('/invoices');
    } catch (error) {
      addToast('Failed to create invoice', 'error');
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="max-w-5xl mx-auto space-y-6">
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

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-lg p-6">
          <InvoiceForm
            customers={customersData?.items || []}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            onCancel={() => navigate('/invoices')}
          />
        </div>
      </div>
    </AnimatedPage>
  );
}