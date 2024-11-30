import { useJotaiStore } from './useJotaiStore';

export function useVatReturns() {
  const { 
    vatReturns,
    addVatReturn: createVatReturn,
    updateVatReturn,
    deleteVatReturn
  } = useJotaiStore();

  return {
    vatReturns,
    isLoading: false,
    isError: null,
    createVatReturn,
    updateVatReturn,
    deleteVatReturn
  };
}