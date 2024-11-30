import { useAtom } from 'jotai';
import { toast } from 'react-hot-toast';
import {
  customersAtom,
  invoicesAtom,
  categoriesAtom,
  vatReturnsAtom,
  totalRevenueAtom,
  unpaidInvoicesAtom,
  categoryTotalsAtom
} from '../state/atoms';
import { Customer, Invoice, AccountingCategory, VatReturn } from '@/types';

export function useJotaiStore() {
  const [customers, setCustomers] = useAtom(customersAtom);
  const [invoices, setInvoices] = useAtom(invoicesAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [vatReturns, setVatReturns] = useAtom(vatReturnsAtom);
  const [totalRevenue] = useAtom(totalRevenueAtom);
  const [unpaidInvoices] = useAtom(unpaidInvoicesAtom);
  const [categoryTotals] = useAtom(categoryTotalsAtom);

  // Customer operations
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = {
      ...customer,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCustomers(prev => [...prev, newCustomer]);
    toast.success('Customer added successfully');
    return newCustomer;
  };

  const updateCustomer = (id: string, data: Partial<Customer>) => {
    setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast.success('Customer updated successfully');
  };

  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    toast.success('Customer deleted successfully');
  };

  // Invoice operations
  const addInvoice = (invoice: Omit<Invoice, 'id'>) => {
    const newInvoice = {
      ...invoice,
      id: Math.random().toString(36).substr(2, 9)
    };
    setInvoices(prev => [...prev, newInvoice]);
    toast.success('Invoice created successfully');
    return newInvoice;
  };

  const updateInvoice = (id: string, data: Partial<Invoice>) => {
    setInvoices(prev => prev.map(i => i.id === id ? { ...i, ...data } : i));
    toast.success('Invoice updated successfully');
  };

  const deleteInvoice = (id: string) => {
    setInvoices(prev => prev.filter(i => i.id !== id));
    toast.success('Invoice deleted successfully');
  };

  // Category operations
  const addCategory = (category: Omit<AccountingCategory, 'id'>) => {
    const newCategory = {
      ...category,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCategories(prev => [...prev, newCategory]);
    toast.success('Category created successfully');
    return newCategory;
  };

  const updateCategory = (id: string, data: Partial<AccountingCategory>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
    toast.success('Category updated successfully');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    toast.success('Category deleted successfully');
  };

  // VAT Return operations
  const addVatReturn = (vatReturn: Omit<VatReturn, 'id'>) => {
    const newVatReturn = {
      ...vatReturn,
      id: Math.random().toString(36).substr(2, 9)
    };
    setVatReturns(prev => [...prev, newVatReturn]);
    toast.success('VAT return created successfully');
    return newVatReturn;
  };

  const updateVatReturn = (id: string, data: Partial<VatReturn>) => {
    setVatReturns(prev => prev.map(v => v.id === id ? { ...v, ...data } : v));
    toast.success('VAT return updated successfully');
  };

  const deleteVatReturn = (id: string) => {
    setVatReturns(prev => prev.filter(v => v.id !== id));
    toast.success('VAT return deleted successfully');
  };

  return {
    // Data
    customers,
    invoices,
    categories,
    vatReturns,
    totalRevenue,
    unpaidInvoices,
    categoryTotals,

    // Operations
    addCustomer,
    updateCustomer,
    deleteCustomer,
    addInvoice,
    updateInvoice,
    deleteInvoice,
    addCategory,
    updateCategory,
    deleteCategory,
    addVatReturn,
    updateVatReturn,
    deleteVatReturn
  };
}