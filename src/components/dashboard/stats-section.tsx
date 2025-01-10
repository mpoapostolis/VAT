import {
  BanknotesIcon,
  BuildingOffice2Icon,
  ReceiptPercentIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import { CompanySelect } from "@/components/ui/company-select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { StatCard } from "@/components/ui/stat-card";
import { useSearchParams } from "react-router-dom";
import { useInvoiceTotals } from "@/lib/hooks/useInvoiceTotals";
import { AlertCircle } from "lucide-react";

export function StatsSection() {
  // Fetch all invoices for the selected company and date range
  const totals = useInvoiceTotals();

  const [searchParams, setSearchParams] = useSearchParams();
  const companyId = searchParams.get("companyId") || "";
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const statCards = [
    {
      icon: <BanknotesIcon />,
      label: "Total Receivables",
      value: formatCurrency(totals?.totalReceivableAmount),
      trend: {
        value: 12.5,
        label: "vs. last month",
      },
      variant: "emerald",
    },
    {
      icon: <ReceiptPercentIcon />,
      label: "Total Payables",
      value: formatCurrency(totals?.totalPayableAmount),
      trend: {
        value: -8.2,
        label: "vs. last month",
      },
      variant: "rose",
    },
    {
      icon: <DocumentDuplicateIcon />,
      label: "Total Invoices",
      value: totals?.totalInvoices,
      trend: {
        value: 24.5,
        label: "vs. last month",
      },
      variant: "blue",
    },
    {
      icon: <AlertCircle />,
      label: "Overdue Invoices",
      value:
        (totals?.totalOverdueInvoices ?? 0) +
        (totals?.totalOverdueReceivables ?? 0),
      trend: {
        value: 4.2,
        label: "vs. last month",
      },
      variant: "rose",
    },
  ] as const;
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex z-200 flex-col flex-wrap gap-3 sm:flex-row sm:items-center justify-between bg-white/60 p-3 sm:p-4  border border-gray-200/60  shadow-gray-200/20">
        <div className="flex items-center gap-3">
          <div className="p-2  bg-gray-50 ring-1 ring-gray-200/50">
            <BuildingOffice2Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-xs sm:text-xl font-semibold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-xs text-gray-500">
              Track your business performance and revenue
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <div className="sm:w-60">
              <CompanySelect
                value={companyId}
                onChange={(c) => {
                  searchParams.set("companyId", c);
                  setSearchParams(searchParams);
                }}
              />
            </div>
          </div>
          <div className="w-full sm:w-auto">
            <DateRangePicker
              value={{
                from: from ? new Date(from) : undefined,
                to: to ? new Date(to) : undefined,
              }}
              className="w-full sm:w-auto"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            icon={card.icon}
            label={card.label}
            value={card.value}
            trend={card.trend}
            variant={card.variant}
          />
        ))}
      </div>
    </div>
  );
}
