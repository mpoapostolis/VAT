export interface Transaction {
  id: number;
  customerId: string;
  name: string;
  role: string;
  type: string;
  number: string;
  date: string;
  amount: number;
  status: 'PENDING' | 'PAID';
}