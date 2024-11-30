import { useJotaiStore } from './useJotaiStore';

export function useInvoices() {
  const { 
    invoices,
    addInvoice: createInvoice,
    updateInvoice,
    deleteInvoice
  } = useJotaiStore();

  return {
    invoices,
    isLoading: false,
    isError: null,
    createInvoice,
    updateInvoice,
    deleteInvoice
  };
}