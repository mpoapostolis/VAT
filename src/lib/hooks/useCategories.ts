import { useJotaiStore } from './useJotaiStore';

export function useCategories() {
  const { 
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    categoryTotals
  } = useJotaiStore();

  return {
    categories,
    isLoading: false,
    isError: null,
    addCategory,
    updateCategory,
    deleteCategory,
    categoryTotals
  };
}