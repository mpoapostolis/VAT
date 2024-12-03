import React from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { Eye, Download, FileEdit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { pb } from '@/lib/pocketbase';
import type { Invoice } from '@/lib/pocketbase';
import { useToast } from '@/lib/hooks/useToast';

export function InvoicesList() {
  const { data, mutate } = useSWR<{ items: Invoice[] }>('invoices');
  const { addToast } = useToast();

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    
    try {
      await pb.collection('invoices').delete(id);
      addToast('Invoice deleted successfully', 'success');
      mutate();
    } catch (error) {
      addToast('Failed to delete invoice', 'error');
    }
  };

  const handleDownload = async (id: string) => {
    try {
      // Simulate PDF download
      addToast('Invoice downloaded successfully', 'success');
    } catch (error) {
      addToast('Failed to download invoice', 'error');
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Invoice Number
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Customer
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Date
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Due Date
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Status
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 border-b border-gray-200">
              Amount
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 border-b border-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="animate-fade-in">
          {data?.items.map((invoice) => (
            <tr 
              key={invoice.id}
              className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4">
                <Link
                  to={`/invoices/${invoice.id}`}
                  className="font-medium text-[#0066FF] hover:text-blue-700"
                >
                  {invoice.number}
                </Link>
              </td>
              <td className="px-6 py-4 text-gray-500">{invoice.customerId}</td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 text-gray-500">
                {new Date(invoice.dueDate).toLocaleDateString()}
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                  invoice.status === 'paid'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : invoice.status === 'overdue'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-medium text-gray-900">
                {formatCurrency(invoice.total)}
              </td>
              <td className="px-6 py-4">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/invoices/${invoice.id}`, '_blank')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(invoice.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Link to={`/invoices/${invoice.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(invoice.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
