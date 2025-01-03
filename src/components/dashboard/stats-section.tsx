import {
  BanknotesIcon,
  BuildingOffice2Icon,
  ReceiptPercentIcon,
  DocumentDuplicateIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import { CompanySelect } from "@/components/ui/company-select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { StatCard } from "@/components/ui/stat-card";

interface StatsSectionProps {
  isLoading: boolean;
  stats: {
    totalInvoices: number;
    totalRevenue: number;
    netSales: number;
    closeToEnd: number;
  };
  onCompanyChange?: (companyId: string) => void;
  onDateRangeChange?: (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => void;
  selectedCompany?: string;
  dateRange?: { from: Date | undefined; to: Date | undefined };
}

export function StatsSection({
  isLoading,
  stats,
  onCompanyChange,
  onDateRangeChange,
  selectedCompany,
  dateRange,
}: StatsSectionProps) {
  const statCards = [
    {
      icon: <BanknotesIcon />,
      label: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      trend: {
        value: 12.5,
        label: "vs. last month",
      },
      variant: "emerald",
    },
    {
      icon: <ReceiptPercentIcon />,
      label: "Total Expenses",
      value: formatCurrency(stats.netSales),
      trend: {
        value: -8.2,
        label: "vs. last month",
      },
      variant: "rose",
    },
    {
      icon: <DocumentDuplicateIcon />,
      label: "Total Invoices",
      value: stats.totalInvoices.toString(),
      trend: {
        value: 24.5,
        label: "vs. last month",
      },
      variant: "blue",
    },
    {
      icon: <UsersIcon />,
      label: "Active Customers",
      value: stats.totalInvoices.toString(),
      trend: {
        value: 4.2,
        label: "vs. last month",
      },
      variant: "violet",
    },
  ] as const;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Section */}
      <div className="flex z-200 flex-col flex-wrap gap-3 sm:flex-row sm:items-center justify-between bg-white/60 p-3 sm:p-4 rounded border border-gray-200/60 shadow-lg shadow-gray-200/20">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-gray-50 ring-1 ring-gray-200/50">
            <BuildingOffice2Icon className="h-5 w-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
              Dashboard Overview
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Track your business performance and revenue
            </p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="w-full sm:w-auto">
            <CompanySelect
              value={selectedCompany}
              onChange={onCompanyChange || (() => {})}
            />
          </div>
          <div className="w-full sm:w-auto">
            <DateRangePicker
              value={dateRange}
              onChange={onDateRangeChange || (() => {})}
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
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
}
