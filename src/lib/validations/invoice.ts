import { z } from 'zod';

export const invoiceLineSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  vatRate: z.number().min(0, 'VAT rate must be non-negative'),
});

export const invoiceSchema = z.object({
  customerId: z.string().min(1, 'Customer is required'),
  categoryId: z.string().min(1, 'Category is required'),
  date: z.date({
    required_error: 'Invoice date is required',
    invalid_type_error: 'Invalid date format',
  }),
  dueDate: z.date({
    required_error: 'Due date is required',
    invalid_type_error: 'Invalid date format',
  }),
  lines: z.array(invoiceLineSchema).min(1, 'At least one line item is required'),
  notes: z.string().optional(),
  isZeroRated: z.boolean().optional(),
  currency: z.string().min(1, 'Currency is required'),
  exchangeRate: z.number().optional(),
});

export type InvoiceFormData = z.infer<typeof invoiceSchema>;
export type InvoiceLineItem = z.infer<typeof invoiceLineSchema>;
