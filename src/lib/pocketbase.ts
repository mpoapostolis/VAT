import PocketBase, { ListResult } from "pocketbase";
import { useEffect, useState } from "react";

export const pb = new PocketBase("https://api.vxlverse.com");

export function useClient() {
  const [client] = useState(() => new PocketBase("https://api.vxlverse.com"));

  useEffect(() => {
    // You can add auth state management here if needed
  }, [client]);

  return client;
}

export type { ListResult };

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  trn: string;
  address: string;
  notes?: string;
  created: string;
  updated: string;
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
  vat: number;
  total: number;
}

export interface Invoice {
  id: string;
  number: string;
  customerId: string;
  categoryId: string;
  type: "receivable" | "payable";
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: "draft" | "pending" | "paid" | "overdue";
  notes?: string;
  expand?: {
    customerId: Customer;
    categoryId: Category;
  };
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  description: string;
  budget?: number;
  transactions?: number;
  amount?: number;
}

export interface VatReturn {
  id: string;
  period: string;
  startDate: string;
  endDate: string;
  salesVat: number;
  purchasesVat: number;
  netVat: number;
  status: "draft" | "submitted";
  submittedAt?: string;
  notes?: string;
  dueDate: string;
}
