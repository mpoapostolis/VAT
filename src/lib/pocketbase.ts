import PocketBase from 'pocketbase';
import { dummyInvoices, dummyCustomers, dummyCategories } from './dummy-data';

export const pb = new PocketBase('https://api.vxlverse.com');

// Mock PocketBase methods for demo
// pb.collection = (name: string) => ({``
//   getList: async () => {
//     switch (name) {
//       case 'invoices':
//         return { items: dummyInvoices };
//       case 'customers':
//         return { items: dummyCustomers };
//       case 'categories':
//         return { items: dummyCategories };
//       default:
//         return { items: [] };
//     }
//   },
//   getOne: async (id: string) => {
//     switch (name) {
//       case 'invoices':
//         return dummyInvoices.find(i => i.id === id);
//       case 'customers':
//         return dummyCustomers.find(c => c.id === id);
//       case 'categories':
//         return dummyCategories.find(c => c.id === id);
//       default:
//         throw new Error('Not found');
//     }
//   },
//   create: async (data: any) => ({ id: String(Date.now()), ...data }),
//   update: async (id: string, data: any) => ({ id, ...data }),
//   delete: async (id: string) => true
// });

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  trn: string;
  address: string;
  notes?: string;
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
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vat: number;
  total: number;
  status: 'draft' | 'pending' | 'paid' | 'overdue';
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
  description: string;
  budget?: number;
}
