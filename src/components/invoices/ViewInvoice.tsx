import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useSWR, { mutate } from 'swr';
import { ArrowLeft, Printer, Send, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { pb } from '@/lib/pocketbase';
import type { Invoice, Customer } from '@/lib/pocketbase';
import { useToast } from '@/lib/hooks/useToast';

export function ViewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: invoice } = useSWR<Invoice>(`invoices/${id}`);
  const { data: customer } = useSWR<Customer>(
    invoice ? `customers/${invoice.customerId}` : null
  );

  const handleStatusUpdate = async (newStatus: Invoice['status']) => {
    if (!invoice) return;
    try {
      await pb.collection('invoices').update(id!, {
        ...invoice,
        status: newStatus,
      });
      mutate(`invoices/${id}`);
      addToast(`Invoice status updated to ${newStatus}`, 'success');
    } catch (error) {
      addToast('Failed to update invoice status', 'error');
    }
  };

  if (!invoice || !customer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="bg-gray-50 min-h-screen"
    >
      <div className="max-w-5xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              className="mr-4"
              onClick={() => navigate('/invoices')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold text-gray-900">
              Invoice {invoice.number}
            </h1>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="outline"
              onClick={() => handleStatusUpdate('sent')}
              disabled={invoice.status !== 'draft'}
            >
              <Send className="h-4 w-4 mr-2" />
              Send
            </Button>
            <Button
              onClick={() => handleStatusUpdate('paid')}
              disabled={invoice.status === 'paid'}
            >
              Mark as Paid
            </Button>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-white shadow-xl"
        >
          <div className="p-8">
            <div className="flex justify-between mb-8">
              <div>
                <div className="text-4xl font-bold text-gray-900 mb-2">INVOICE</div>
                <div className="text-gray-500">{invoice.number}</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-semibold text-gray-900 mb-2">
                  {formatCurrency(invoice.total)}
                </div>
                <div className={`inline-flex items-center px-3 py-1 text-sm font-medium ${
                  invoice.status === 'paid'
                    ? 'bg-green-50 text-green-700'
                    : invoice.status === 'overdue'
                    ? 'bg-red-50 text-red-700'
                    : 'bg-yellow-50 text-yellow-700'
                }`}>
                  {invoice?.status?.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-8">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">From</div>
                <div className="text-lg font-semibold">Your Company Name</div>
                <div className="text-gray-600">123 Business Street</div>
                <div className="text-gray-600">City, Country</div>
                <div className="text-gray-600">VAT: 123456789</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Bill To</div>
                <div className="text-lg font-semibold">{customer.name}</div>
                <div className="text-gray-600">{customer.address}</div>
                <div className="text-gray-600">{customer.email}</div>
                <div className="text-gray-600">VAT: {customer.trn}</div>
              </div>
            </div>

            <div className="mb-8">
              <div className="grid grid-cols-2 gap-8 text-sm text-gray-500 mb-3">
                <div>
                  <div className="font-medium">Issue Date</div>
                  <div>{new Date(invoice.date).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="font-medium">Due Date</div>
                  <div>{new Date(invoice.dueDate).toLocaleDateString()}</div>
                </div>
              </div>
            </div>

            <table className="w-full mb-8">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 text-gray-500">Description</th>
                  <th className="text-right py-3 text-gray-500">Quantity</th>
                  <th className="text-right py-3 text-gray-500">Rate</th>
                  <th className="text-right py-3 text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4">{item.description}</td>
                    <td className="text-right py-4">{item.quantity}</td>
                    <td className="text-right py-4">{formatCurrency(item.price)}</td>
                    <td className="text-right py-4">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-72">
                <div className="flex justify-between mb-3">
                  <div className="text-gray-600">Subtotal</div>
                  <div className="font-medium">{formatCurrency(invoice.subtotal)}</div>
                </div>
                <div className="flex justify-between mb-3">
                  <div className="text-gray-600">VAT (5%)</div>
                  <div className="font-medium">{formatCurrency(invoice.vat)}</div>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200">
                  <div className="text-lg font-semibold">Total</div>
                  <div className="text-lg font-semibold">{formatCurrency(invoice.total)}</div>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-500 mb-2">Notes</div>
                <div className="text-gray-600">{invoice.notes}</div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
