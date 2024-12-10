import React, { useState } from "react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { StatsSection } from "@/components/dashboard/stats-section";
import { TransactionsSection } from "@/components/dashboard/transactions-section";
import useSWR from "swr";
import { dashboardService } from "@/lib/services/dashboard-service";
import { formatDateForInput } from "@/lib/utils";
import { motion } from "framer-motion";
import { subMonths } from "date-fns";

export function Dashboard() {
  // Initialize with last month's date range
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data: stats, isLoading } = useSWR(["dashboard", dateRange], () =>
    dashboardService.getStats(
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
      <div className="space-y-6 mx-auto max-w-[1600px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-black/10 rounded-lg p-6"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
                Dashboard
              </h1>
              <p className="text-sm text-[#64748B] mt-1">
                Overview of your business metrics
              </p>
            </div>
            <DateRangePicker onChange={setDateRange} value={dateRange} />
          </div>
        </motion.div>

        <StatsSection isLoading={isLoading} stats={stats || { totalInvoices: 0, totalRevenue: 0, netSales: 0, closeToEnd: 0 }} />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-black/10 rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-black/10">
            <h2 className="text-lg font-semibold text-[#0F172A]">Recent Transactions</h2>
            <p className="text-sm text-[#64748B]">Your latest invoice activity</p>
          </div>
          <TransactionsSection
            isLoading={isLoading}
            transactions={stats?.recentTransactions || []}
          />
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
