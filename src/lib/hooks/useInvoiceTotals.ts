import { useMemo } from 'react';
import { Invoice } from '@/types/invoice';

interface InvoiceTotals {
  totalReceivables: number;
  totalPayables: number;
  receivableInvoices: number;
  payableInvoices: number;
  totalAmount: number;
  totalInvoices: number;
  overdueInvoices: number;
}

export function useInvoiceTotals(invoices: Invoice[] = []): InvoiceTotals {
  return useMemo(() => {
    const currentDate = new Date();
    
    return invoices.reduce(
      (acc, invoice) => {
        const amount = (invoice.total || 0) + (invoice.vatAmount || 0);
        const dueDate = new Date(invoice.dueDate);
        
        if (invoice.type === 'receivable') {
          acc.totalReceivables += amount;
          acc.receivableInvoices++;
          if (dueDate < currentDate && !invoice.paid) {
            acc.overdueInvoices++;
          }
        } else {
          acc.totalPayables += amount;
          acc.payableInvoices++;
        }
        
        acc.totalAmount += amount;
        acc.totalInvoices++;
        
        return acc;
      },
      {
        totalReceivables: 0,
        totalPayables: 0,
        receivableInvoices: 0,
        payableInvoices: 0,
        totalAmount: 0,
        totalInvoices: 0,
        overdueInvoices: 0,
      }
    );
  }, [invoices]);
}
