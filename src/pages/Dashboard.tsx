import React from 'react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { StatCard } from '@/components/ui/stat-card';
import { TransactionTable } from '@/components/ui/transaction-table';
import { CreditCard, Wallet, TrendingDown } from 'lucide-react';

const stats = [
  {
    id: 1,
    icon: <CreditCard className="h-5 w-5 text-[#0066FF]" />,
    label: 'Total Balance',
    value: '$982,000.90',
    trend: {
      value: 16,
      label: 'vs last year',
    },
  },
  {
    id: 2,
    icon: <Wallet className="h-5 w-5 text-green-500" />,
    label: 'Total Income',
    value: '$854,348.00',
    trend: {
      value: 12,
      label: 'vs last month',
    },
  },
  {
    id: 3,
    icon: <TrendingDown className="h-5 w-5 text-red-500" />,
    label: 'Total Spending',
    value: '$654,245.90',
    trend: {
      value: -10,
      label: 'vs last year',
    },
  },
];

const transactions = [
  {
    id: 1,
    name: 'Wade Warren',
    role: 'Accounting Manager',
    type: 'View Invoice',
    number: '#890642',
    date: 'July 11.07.2023',
    amount: '$624,00.90',
    status: 'PENDING' as const,
  },
  {
    id: 2,
    name: 'Floyed Miles',
    role: 'Employee Manager',
    type: 'View Invoice',
    number: '#230642',
    date: 'July 12.07.2023',
    amount: '$624,00.90',
    status: 'PAID' as const,
  },
  {
    id: 3,
    name: 'Theresa Wedd',
    role: 'Digital Marketer',
    type: 'View Invoice',
    number: '#990642',
    date: 'July 11.07.2023',
    amount: '$624,00.90',
    status: 'PENDING' as const,
  },
];

export function Dashboard() {
  return (
    <AnimatedPage>
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
          </div>
          <TransactionTable transactions={transactions} />
        </div>
      </div>
    </AnimatedPage>
  );
}