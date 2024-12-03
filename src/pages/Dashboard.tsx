import React, { useState } from 'react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { StatsSection } from '@/components/dashboard/stats-section';
import { TransactionsSection } from '@/components/dashboard/transactions-section';
import useSWR from 'swr';
import { dashboardService } from '@/lib/services/dashboard-service';
import { formatDateForInput } from '@/lib/utils';

export function Dashboard() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
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
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Overview of your business</p>
          </div>
          <DateRangePicker onChange={setDateRange} />
        </div>

        <StatsSection
          isLoading={isLoading}
          stats={{
            totalBalance: stats?.totalBalance || 0,
            totalIncome: stats?.totalIncome || 0,
            totalSpending: stats?.totalSpending || 0,
          }}
        />
        
        <TransactionsSection
          isLoading={isLoading}
          transactions={stats?.recentInvoices || []}
        />
      </div>
    </AnimatedPage>
  );
}