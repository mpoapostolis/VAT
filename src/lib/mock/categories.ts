import { AccountingCategory } from '@/types';

export const mockCategories: AccountingCategory[] = [
  {
    id: '1',
    name: 'Revenue',
    type: 'REVENUE',
    description: 'All income from business operations',
    color: '#10B981'
  },
  {
    id: '2',
    name: 'Consulting Services',
    type: 'REVENUE',
    description: 'Income from consulting work',
    parentId: '1',
    color: '#34D399'
  },
  {
    id: '3',
    name: 'Software Development',
    type: 'REVENUE',
    description: 'Income from software projects',
    parentId: '1',
    color: '#6EE7B7'
  },
  {
    id: '4',
    name: 'Expenses',
    type: 'EXPENSE',
    description: 'All business expenses',
    color: '#EF4444'
  },
  {
    id: '5',
    name: 'Office Supplies',
    type: 'EXPENSE',
    description: 'General office supplies and equipment',
    parentId: '4',
    color: '#F87171'
  },
  {
    id: '6',
    name: 'Software Subscriptions',
    type: 'EXPENSE',
    description: 'Software licenses and subscriptions',
    parentId: '4',
    color: '#FCA5A5'
  },
  {
    id: '7',
    name: 'VAT',
    type: 'VAT',
    description: 'Value Added Tax transactions',
    color: '#6366F1'
  },
  {
    id: '8',
    name: 'Standard Rate VAT',
    type: 'VAT',
    description: 'Standard 20% VAT rate transactions',
    parentId: '7',
    color: '#818CF8'
  },
  {
    id: '9',
    name: 'Reduced Rate VAT',
    type: 'VAT',
    description: 'Reduced 5% VAT rate transactions',
    parentId: '7',
    color: '#A5B4FC'
  }
];