import React from 'react';
import { motion } from 'framer-motion';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { useVatReturns } from '@/lib/hooks/useVatReturns';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { CategorySummary } from '@/components/reports/CategorySummary';
import { CategoryReport } from '@/components/reports/CategoryReport';
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';

export function Dashboard() {
  const { invoices, isLoading: isLoadingInvoices } = useInvoices();
  const { vatReturns, isLoading: isLoadingVatReturns } = useVatReturns();

  if (isLoadingInvoices || isLoadingVatReturns) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const totalUnpaidInvoices = invoices?.filter(inv => inv.status === 'PENDING').length || 0;
  const latestVatReturn = vatReturns?.[0];
  const totalRevenue = invoices?.reduce((sum, inv) => sum + inv.totalIncVat, 0) || 0;
  const overdueInvoices = invoices?.filter(inv => inv.status === 'OVERDUE').length || 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: formatCurrency(totalRevenue),
      change: '+20.1%',
      trend: 'up',
      icon: ArrowTrendingUpIcon,
      color: 'from-indigo-500 to-purple-600',
    },
    {
      title: 'Unpaid Invoices',
      value: totalUnpaidInvoices,
      change: `${overdueInvoices} overdue`,
      trend: overdueInvoices > 0 ? 'down' : 'up',
      icon: BanknotesIcon,
      color: 'from-emerald-500 to-teal-600',
    },
    {
      title: 'Latest VAT Due',
      value: latestVatReturn ? formatCurrency(latestVatReturn.netVatDue) : '€0.00',
      change: 'Due in 14 days',
      icon: ClockIcon,
      color: 'from-amber-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Financial Dashboard" 
        description="Real-time overview of your business performance"
      />
      
      {process.env.NODE_ENV === 'development' && (
        <motion.div 
          className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 rounded-lg"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 dark:text-yellow-500" />
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-400">
                Development Mode: Using mock data. Connect to PocketBase to see real data.
              </p>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
        {stats.map((stat, index) => (
          <StatCard key={stat.title} {...stat} index={index} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RevenueChart />
        <CategorySummary />
      </div>

      <CategoryReport />
    </div>
  );
}