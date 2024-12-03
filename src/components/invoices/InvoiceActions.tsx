import React from 'react';
import { Eye, Download, FileEdit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { pb } from '@/lib/pocketbase';
import { useToast } from '@/lib/hooks/useToast';

interface InvoiceActionsProps {
  invoiceId: string;
  onDelete?: () => void;
}

export function InvoiceActions({ invoiceId, onDelete }: InvoiceActionsProps) {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handlePreview = () => {
    window.open(`/invoices/${invoiceId}`, '_blank');
  };

  const handleDownload = async () => {
    try {
      // In a real app, this would call an API endpoint to generate the PDF
      const response = await pb.collection('invoices').getOne(invoiceId);
      
      // Simulate PDF download
      addToast('Invoice downloaded successfully', 'success');
    } catch (error) {
      addToast('Failed to download invoice', 'error');
    }
  };

  const handleEdit = () => {
    navigate(`/invoices/${invoiceId}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await pb.collection('invoices').delete(invoiceId);
        addToast('Invoice deleted successfully', 'success');
        onDelete?.();
      } catch (error) {
        addToast('Failed to delete invoice', 'error');
      }
    }
  };

  return (
    <div className="flex justify-end space-x-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePreview}
        className="text-gray-500 hover:text-gray-700"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDownload}
        className="text-gray-500 hover:text-gray-700"
      >
        <Download className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEdit}
        className="text-gray-500 hover:text-gray-700"
      >
        <FileEdit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        className="text-red-500 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
