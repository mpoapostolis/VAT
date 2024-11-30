import { useJotaiStore } from './useJotaiStore';

export function useCustomers() {
  const { 
    customers,
    addCustomer: createCustomer,
    updateCustomer,
    deleteCustomer
  } = useJotaiStore();

  return {
    customers,
    isLoading: false,
    isError: null,
    createCustomer,
    updateCustomer,
    deleteCustomer
  };
}