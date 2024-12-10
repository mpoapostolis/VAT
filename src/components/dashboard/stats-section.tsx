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
      icon: <Receipt className="h-5 w-5 text-[#3B82F6]" />,
      label: 'Total Invoices',
      value: stats.totalInvoices.toString(),
      trend: {
        value: stats.totalInvoices > 0 ? 100 : 0,
        label: 'total count',
      },
    },
    {
      id: 2,
      icon: <CreditCard className="h-5 w-5 text-[#10B981]" />,
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      trend: {
        value: stats.totalRevenue > 0 ? 12 : 0,
        label: 'vs last month',
      },
    },
    {
      id: 3,
      icon: <TrendingUp className="h-5 w-5 text-[#3B82F6]" />,
      label: 'Net Sales',
      value: formatCurrency(stats.netSales),
      trend: {
        value: stats.netSales > 0 ? 8 : 0,
        label: 'vs last month',
      },
    },
    {
      id: 4,
      icon: <AlertCircle className="h-5 w-5 text-[#F59E0B]" />,
      label: 'Close to End',
      value: stats.closeToEnd.toString(),
      trend: {
        value: 0,
        label: 'invoices expiring soon',
      },
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
    >
      {statCards.map((stat) => (
        <div
          key={stat.id}
          className="bg-white border border-black/10 rounded-lg p-6 hover:border-[#3B82F6]/20 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-[#F1F5F9]">
              {stat.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-[#64748B]">{stat.label}</p>
              <p className="text-2xl font-semibold text-[#0F172A] mt-1 tracking-tight">
                {isLoading ? '-' : stat.value}
              </p>
            </div>
          </div>
          {stat.trend && (
            <div className="mt-4 flex items-center text-sm">
              <span className="text-[#64748B] font-medium">
                {stat.trend.label}
              </span>
              {stat.trend.value > 0 && (
                <span className="ml-2 text-[#10B981] font-medium">
                  +{stat.trend.value}%
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
}