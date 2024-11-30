export interface Customer {
  id: string;
  name: string;
  vatNumber: string;
  email: string;
  address: Address;
  isZeroRated: boolean;
  currency: string;
}

export interface Supplier {
  id: string;
  name: string;
  vatNumber: string;
  email: string;
  address: Address;
  isReverseCharge: boolean;
  currency: string;
}

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  vatRate: number;
  vatAmount: number;
  totalExVat: number;
  totalIncVat: number;
}

export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE'
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  categoryId?: string;
  date: Date;
  dueDate: Date;
  lines: InvoiceLine[];
  status: InvoiceStatus;
  currency: string;
  exchangeRate: number;
  totalExVat: number;
  totalVat: number;
  totalIncVat: number;
  notes?: string;
}

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
  CREDIT_CARD = 'CREDIT_CARD'
}

export interface Payment {
  id: string;
  invoiceId: string;
  date: Date;
  amount: number;
  method: PaymentMethod;
  reference?: string;
  notes?: string;
}

export enum VatReturnStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface VatReturn {
  id: string;
  startDate: Date;
  endDate: Date;
  salesVat: number;
  purchasesVat: number;
  adjustments: number;
  netVatDue: number;
  status: VatReturnStatus;
}

export type CategoryType = 'REVENUE' | 'EXPENSE';

export type LogisticsCategoryType = 
  | 'TRANSPORTATION' 
  | 'WAREHOUSING'
  | 'FREIGHT'
  | 'CUSTOMS'
  | 'PACKAGING'
  | 'HANDLING'
  | 'DISTRIBUTION'
  | 'OTHER';

export interface AccountingCategory {
  id: string;
  name: string;
  type: CategoryType;
  description?: string;
  color: string;
  parentId?: string;
  logisticsType?: LogisticsCategoryType;
  vatRate?: number;
  isActive: boolean;
  metadata?: {
    icon?: string;
    tags?: string[];
    notes?: string;
  };
}

export interface CategoryTotal {
  categoryId: string;
  total: number;
  count: number;
}