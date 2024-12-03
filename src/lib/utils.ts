import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function generateInvoiceNumber(): string {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `INV-${year}${month}-${random}`;
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'PPP');
}

export function formatDateForInput(date: string | Date): string {
  return format(new Date(date), 'yyyy-MM-dd');
}

export function calculateDueDate(date: Date): Date {
  const dueDate = new Date(date);
  dueDate.setDate(dueDate.getDate() + 30);
  return dueDate;
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date();
}