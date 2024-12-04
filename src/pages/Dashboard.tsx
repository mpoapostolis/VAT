import React, { useState } from 'react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { StatsSection } from '@/components/dashboard/stats-section';
import { TransactionsSection } from '@/components/dashboard/transactions-section';
import useSWR from 'swr';
import { dashboardService } from '@/lib/services/dashboard-service';
import { formatDateForInput } from '@/lib/utils';
import { motion } from 'framer-motion';
import { subMonths } from 'date-fns';

export function Dashboard() {
  // Initialize with last month's date range
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data: stats, isLoading } = useSWR(
    ['dashboard', dateRange],
    () => dashboardService.getStats(
      dateRange.from && dateRange.to
        ? {
            from: formatDateForInput(dateRange.from),
            to: formatDateForInput(dateRange.to),
          }
        : undefined
    )
  );

  return (
    <AnimatedPage>
      <div className="space-y-8 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Overview of your business</p>
            </div>
            <DateRangePicker 
              onChange={setDateRange} 
              value={dateRange}
            />
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatsSection
            isLoading={isLoading}
            stats={{
              totalBalance: stats?.totalBalance || 0,
              totalIncome: stats?.totalIncome || 0,
              totalSpending: stats?.totalSpending || 0,
            }}
          />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TransactionsSection
            isLoading={isLoading}
            transactions={stats?.recentInvoices || []}
          />
        </motion.div>
      </div>
    </AnimatedPage>
  );
}