import React from 'react';
import { motion } from 'framer-motion';
import { StatCard } from '@/components/ui/stat-card';
import { Receipt, CreditCard, AlertCircle, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface StatsSectionProps {
  isLoading: boolean;
  stats: {
    totalInvoices: number;
    totalRevenue: number;
    netSales: number;
    closeToEnd: number;
  };
}

export function StatsSection({ isLoading, stats }: StatsSectionProps) {
  const statCards = [
    {
      id: 1,
      icon: <Receipt className="h-5 w-5 text-[#0066FF]" />,
      label: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      trend: {
        value: stats.totalInvoices > 0 ? 100 : 0,
        label: 'total count',
      },
    },
    {
      id: 2,
      icon: <CreditCard className="h-5 w-5 text-green-500" />,
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      trend: {
        value: stats.totalRevenue > 0 ? 12 : 0,
        label: 'vs last month',
      },
    },
    {
      id: 3,
      icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
      label: 'Net Sales',
      value: formatCurrency(stats.netSales),
      trend: {
        value: stats.netSales > 0 ? 8 : 0,
        label: 'vs last month',
      },
    },
    {
      id: 4,
      icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
      label: 'Close to End',
      value: stats.closeToEnd.toString(),
      trend: {
        value: stats.closeToEnd > 0 ? -stats.closeToEnd : 0,
        label: 'need attention',
      },
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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