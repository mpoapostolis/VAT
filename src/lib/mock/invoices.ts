import { Invoice, InvoiceStatus } from '@/types';
import { mockCustomers } from './customers';
import { addDays, subDays } from 'date-fns';

export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'INV-2024-001',
    customerId: mockCustomers[0].id,
    date: subDays(new Date(), 15),
    dueDate: addDays(new Date(), 15),
    lines: [
      {
        id: '1',
        description: 'Web Development Services',
        quantity: 80,
        unitPrice: 95,
        vatRate: 20,
        vatAmount: 1520,
        totalExVat: 7600,
        totalIncVat: 9120
      },
      {
        id: '2',
        description: 'UI/UX Design',
        quantity: 40,
        unitPrice: 85,
        vatRate: 20,
        vatAmount: 680,
        totalExVat: 3400,
        totalIncVat: 4080
      }
    ],
    status: InvoiceStatus.PENDING,
    currency: 'EUR',
    exchangeRate: 1,
    totalExVat: 11000,
    totalVat: 2200,
    totalIncVat: 13200,
    notes: 'Payment due within 30 days'
  },
  {
    id: '2',
    number: 'INV-2024-002',
    customerId: mockCustomers[1].id,
    date: subDays(new Date(), 45),
    dueDate: subDays(new Date(), 15),
    lines: [
      {
        id: '1',
        description: 'Cloud Infrastructure Setup',
        quantity: 1,
        unitPrice: 5000,
        vatRate: 20,
        vatAmount: 1000,
        totalExVat: 5000,
        totalIncVat: 6000
      }
    ],
    status: InvoiceStatus.PAID,
    currency: 'EUR',
    exchangeRate: 1,
    totalExVat: 5000,
    totalVat: 1000,
    totalIncVat: 6000
  },
  {
    id: '3',
    number: 'INV-2024-003',
    customerId: mockCustomers[2].id,
    date: subDays(new Date(), 60),
    dueDate: subDays(new Date(), 30),
    lines: [
      {
        id: '1',
        description: 'Software License - Annual',
        quantity: 50,
        unitPrice: 199,
        vatRate: 0,
        vatAmount: 0,
        totalExVat: 9950,
        totalIncVat: 9950
      }
    ],
    status: InvoiceStatus.OVERDUE,
    currency: 'EUR',
    exchangeRate: 1,
    totalExVat: 9950,
    totalVat: 0,
    totalIncVat: 9950
  }
];