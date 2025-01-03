import React, { useState } from "react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { CompanySelect } from "@/components/ui/company-select";
import { StatsSection } from "@/components/dashboard/stats-section";
import { TransactionsSection } from "@/components/dashboard/transactions-section";
import useSWR from "swr";
import { dashboardService } from "@/lib/services/dashboard-service";
import { formatDateForInput } from "@/lib/utils";
import { motion } from "framer-motion";
import { subMonths } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { FunnelIcon } from "@heroicons/react/24/outline";

export function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const companyId = searchParams.get("company") || "";

  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: subMonths(new Date(), 1),
    to: new Date(),
  });

  const { data: stats, isLoading } = useSWR(
    ["dashboard", dateRange, companyId],
    () =>
      dashboardService.getStats({
        ...(dateRange.from && dateRange.to
          ? {
              from: formatDateForInput(dateRange.from),
              to: formatDateForInput(dateRange.to),
            }
          : {}),
        ...(companyId ? { companyId } : {}),
      })
  );

  const handleCompanyChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set("company", value);
    } else {
      newParams.delete("company");
    }
    setSearchParams(newParams);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 mx-auto max-w-[1600px]">
        <StatsSection
          isLoading={isLoading}
          stats={
            stats || {
              totalInvoices: 0,
              totalRevenue: 0,
              netSales: 0,
              closeToEnd: 0,
            }
          }
        />

        <TransactionsSection
          isLoading={isLoading}
          transactions={stats?.recentTransactions || []}
        />
      </div>
    </AnimatedPage>
  );
}
