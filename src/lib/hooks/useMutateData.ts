import { mutate } from 'swr';
import { useToast } from './useToast';
import  type { KeyedMutator } from "swr"


export function useMutateData() {
  const { addToast } = useToast();

  const mutateData = async (
    mutate: KeyedMutator<unkown>,
    action: () => Promise<any>,
    options: {
      successMessage?: string;
      errorMessage?: string;
    } = {}
  ) => {
    const {
      successMessage = 'Operation completed successfully',
      errorMessage = 'Operation failed',
    } = options;


    try {
      await action();
      await mutate()
      addToast(successMessage, 'success');
      return true;
    } catch (error) {
      console.error('Mutation error:', error);
      addToast(errorMessage, 'error');
      return false;
    }
  };

  return { mutateData };
}