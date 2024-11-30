import { create } from 'zustand';
import { Invoice, InvoiceStatus } from '@/types';
import { invoiceApi } from '@/lib/api/invoices';

interface InvoiceStore {
  invoices: Invoice[];
  loading: boolean;
  error: string | null;
  fetchInvoices: () => Promise<void>;
  createInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  updateInvoiceStatus: (id: string, status: InvoiceStatus) => Promise<void>;
}

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: [],
  loading: false,
  error: null,

  fetchInvoices: async () => {
    set({ loading: true, error: null });
    try {
      const invoices = await invoiceApi.getInvoices();
      set({ invoices, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch invoices', loading: false });
    }
  },

  createInvoice: async (invoice) => {
    set({ loading: true, error: null });
    try {
      const newInvoice = await invoiceApi.createInvoice(invoice);
      set(state => ({
        invoices: [...state.invoices, newInvoice],
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to create invoice', loading: false });
    }
  },

  updateInvoice: async (id, invoice) => {
    set({ loading: true, error: null });
    try {
      const updatedInvoice = await invoiceApi.updateInvoice(id, invoice);
      set(state => ({
        invoices: state.invoices.map(inv => 
          inv.id === id ? updatedInvoice : inv
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update invoice', loading: false });
    }
  },

  deleteInvoice: async (id) => {
    set({ loading: true, error: null });
    try {
      await invoiceApi.deleteInvoice(id);
      set(state => ({
        invoices: state.invoices.filter(inv => inv.id !== id),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to delete invoice', loading: false });
    }
  },

  updateInvoiceStatus: async (id, status) => {
    set({ loading: true, error: null });
    try {
      const updatedInvoice = await invoiceApi.updateInvoice(id, { status });
      set(state => ({
        invoices: state.invoices.map(inv => 
          inv.id === id ? updatedInvoice : inv
        ),
        loading: false
      }));
    } catch (error) {
      set({ error: 'Failed to update invoice status', loading: false });
    }
  }
}));