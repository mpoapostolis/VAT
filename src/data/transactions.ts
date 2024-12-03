import { Transaction } from '@/types/dashboard';

export const transactions: Transaction[] = [
  {
    id: 1,
    name: 'Wade Warren',
    role: 'Accounting Manager',
    type: 'View Invoice',
    number: '#890642',
    date: 'July 11.07.2023',
    amount: '$624,00.90',
    status: 'PENDING',
  },
  {
    id: 2,
    name: 'Floyed Miles',
    role: 'Employee Manager',
    type: 'View Invoice',
    number: '#230642',
    date: 'July 12.07.2023',
    amount: '$624,00.90',
    status: 'PAID',
  },
  {
    id: 3,
    name: 'Theresa Wedd',
    role: 'Digital Marketer',
    type: 'View Invoice',
    number: '#990642',
    date: 'July 11.07.2023',
    amount: '$624,00.90',
    status: 'PENDING',
  },
];