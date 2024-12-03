import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/stat-card';
import { CreditCard, Wallet, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatsSectionProps {
  isLoading: boolean;
  stats: {
    totalBalance: number;
    totalIncome: number;
    totalSpending: number;
  };
}

export function StatsSection({ isLoading, stats }: StatsSectionProps) {
  const statCards = [
    {
      id: 1,
      icon: <CreditCard className="h-5 w-5 text-[#0066FF]" />,
      label: 'Total Balance',
      value: formatCurrency(stats.totalBalance),
      trend: {
        value: 16,
        label: 'vs last year',
      },
    },
    {
      id: 2,
      icon: <Wallet className="h-5 w-5 text-green-500" />,
      label: 'Total Income',
      value: formatCurrency(stats.totalIncome),
      trend: {
        value: 12,
        label: 'vs last month',
      },
    },
    {
      id: 3,
      icon: <TrendingDown className="h-5 w-5 text-red-500" />,
      label: 'Total Spending',
      value: formatCurrency(stats.totalSpending),
      trend: {
        value: -10,
        label: 'vs last year',
      },
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-3 gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <StatCard {...stat} isLoading={isLoading} />
        </motion.div>
      ))}
    </motion.div>
  );
}