export interface InvoiceItem {
  itemNo: number;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: {
    type: "percentage" | "fixed";
    value: number;
  };
  netAmount: number;
  taxCode: "standard" | "zero" | "exempt";
  vatAmount: number;
  subtotal: number;
  total: number;
  reverseCharge: boolean;
  notes?: string;
}

export interface Invoice {
  id?: string;
  type: "receivable" | "payable";
  number: string;
  date: string;
  dueDate: string;
  paymentTerms: string;
  companyId: string;
  customerId: string;
  items: InvoiceItem[];
  subtotal: number;
  vatAmount: number;
  total: number;
  purchaseOrderNumber?: string;
  referenceNumber?: string;
  termsAndConditions?: string;
  paymentInformation?: string;
  notes?: string;
  status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  created?: string;
  updated?: string;
}

export interface UseInvoicesOptions {
  page?: number;
  perPage?: number;
  sort?: string;
  type?: "receivable" | "payable";
  filter?: string;
  search?: string;
  customerId?: string;
  companyId?: string;
  status?: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  dateRange?: {
    start: string;
    end: string;
  };
  currency?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface UseInvoicesStats {
  receivable: {
    total: number;
    count: number;
  };
  payable: {
    total: number;
    count: number;
  };
}

export interface UseInvoicesReturn {
  invoices: Invoice[];
  isLoading: boolean;
  error: any;
  duplicateInvoice: (invoiceId: string) => Promise<string>;
  mutate: () => void;
  totalItems: number;
  totalPages: number;
  stats: UseInvoicesStats | undefined;
}
