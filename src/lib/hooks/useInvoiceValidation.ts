import { useCallback } from 'react';
import { invoiceSchema, InvoiceFormData } from '../validations/invoice';
import { toast } from 'react-hot-toast';

export function useInvoiceValidation() {
  const validateInvoice = useCallback(async (data: Partial<InvoiceFormData>) => {
    try {
      const validatedData = await invoiceSchema.parseAsync(data);
      return { isValid: true, data: validatedData, errors: null };
    } catch (error: any) {
      const errors = error.errors?.reduce((acc: Record<string, string>, curr: any) => {
        const path = curr.path.join('.');
        acc[path] = curr.message;
        return acc;
      }, {});

      // Show validation errors
      Object.values(errors).forEach((message) => {
        toast.error(message as string);
      });

      return { isValid: false, data: null, errors };
    }
  }, []);

  return { validateInvoice };
}
