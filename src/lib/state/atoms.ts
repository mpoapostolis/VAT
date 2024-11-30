import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Customer, Invoice, AccountingCategory, VatReturn } from '@/types';
import { mockCustomers } from '../mock/customers';
import { mockInvoices } from '../mock/invoices';
import { mockCategories } from '../mock/categories';
import { mockVatReturns } from '../mock/vatReturns';

// Auth State
export const userAtom = atomWithStorage('user', null);
export const isAuthenticatedAtom = atomWithStorage('isAuthenticated', process.env.NODE_ENV === 'development');

// Data Atoms
export const customersAtom = atom<Customer[]>(mockCustomers);
export const invoicesAtom = atom<Invoice[]>(mockInvoices);
export const categoriesAtom = atom<AccountingCategory[]>(mockCategories);
export const vatReturnsAtom = atom<VatReturn[]>(mockVatReturns);

// UI State
export const sidebarOpenAtom = atom(false);
export const themeAtom = atomWithStorage('theme', 'light');

// Derived State
export const totalRevenueAtom = atom((get) => {
  const invoices = get(invoicesAtom);
  return invoices.reduce((sum, inv) => sum + inv.totalIncVat, 0);
});

export const unpaidInvoicesAtom = atom((get) => {
  const invoices = get(invoicesAtom);
  return invoices.filter(inv => inv.status === 'PENDING');
});

export const categoryTotalsAtom = atom((get) => {
  const invoices = get(invoicesAtom);
  const categories = get(categoriesAtom);
  
  const totals = categories.reduce((acc, cat) => {
    acc[cat.id] = { total: 0, count: 0 };
    return acc;
  }, {} as Record<string, { total: number; count: number }>);

  invoices.forEach(invoice => {
    if (invoice.categoryId && totals[invoice.categoryId]) {
      totals[invoice.categoryId].total += invoice.totalIncVat;
      totals[invoice.categoryId].count += 1;
    }
  });

  return totals;
});

// Invoice Form State
export const invoiceFormAtom = atom<Partial<Invoice>>({
  date: new Date(),
  dueDate: new Date(),
  lines: [{ description: '', quantity: 1, unitPrice: 0, vatRate: 20 }]
});

export const selectedCustomerAtom = atom((get) => {
  const form = get(invoiceFormAtom);
  const customers = get(customersAtom);
  return customers.find(c => c.id === form.customerId);
});

export const invoiceTotalsAtom = atom((get) => {
  const form = get(invoiceFormAtom);
  const lines = form.lines || [];
  
  return lines.reduce((acc, line) => {
    const quantity = line.quantity || 0;
    const unitPrice = line.unitPrice || 0;
    const vatRate = line.vatRate || 0;
    
    const lineTotal = quantity * unitPrice;
    const lineVat = lineTotal * (vatRate / 100);
    
    return {
      totalExVat: acc.totalExVat + lineTotal,
      totalVat: acc.totalVat + lineVat,
      totalIncVat: acc.totalIncVat + lineTotal + lineVat
    };
  }, { totalExVat: 0, totalVat: 0, totalIncVat: 0 });
});

// Customer Form State
const defaultCustomerForm = {
  name: '',
  vatNumber: '',
  email: '',
  phone: '',
  address: {
    street: '',
    city: '',
    postalCode: '',
    country: ''
  },
  currency: 'EUR',
  isZeroRated: false
};

export const customerFormAtom = atom<Partial<Customer>>(defaultCustomerForm);

export const resetCustomerForm = atom(
  null,
  (get, set) => {
    set(customerFormAtom, defaultCustomerForm);
  }
);