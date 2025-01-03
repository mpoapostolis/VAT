import React from "react";
import { motion } from "framer-motion";
import {
  BanknotesIcon,
  DocumentCheckIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BuildingOffice2Icon,
  ReceiptPercentIcon,
  DocumentDuplicateIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency } from "@/lib/utils";
import { CompanySelect } from "@/components/ui/company-select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import cn from "classnames";

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
  return (
    <div className="space-y-4 sm:space-y-6">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white border-gray-200 to-primary/[0.02] backdrop-blur-xl p-4 rounded border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-100 h-7 w-24 rounded"></div>
                  ) : (
                    formatCurrency(stats.totalRevenue)
                  )}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-50/80 text-emerald-700">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  12.5%
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-emerald-500/5 text-emerald-600">
              <BanknotesIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Previous Month</p>
              <p className="text-sm font-medium text-gray-900">
                {isLoading ? (
                  <div className="animate-pulse bg-gray-100 h-5 w-20 rounded"></div>
                ) : (
                  formatCurrency(stats.totalRevenue - 5000)
                )}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs text-gray-500">Monthly Growth</p>
              <p className="text-sm font-medium text-emerald-600">+€5,026</p>
            </div>
          </div>
        </div>

        {/* Total Expenses Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white border-gray-200 to-primary/[0.02] backdrop-blur-xl p-4 rounded border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Total Expenses
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-100 h-7 w-24 rounded"></div>
                  ) : (
                    formatCurrency(stats.netSales)
                  )}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-rose-50/80 text-rose-700">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  8.2%
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-rose-500/5 text-rose-600">
              <ReceiptPercentIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Budget Limit</p>
              <p className="text-sm font-medium text-gray-900">€20,000</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs text-gray-500">Remaining</p>
              <p className="text-sm font-medium text-rose-600">€7,550</p>
            </div>
          </div>
        </div>

        {/* Total Invoices Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white border-gray-200 to-primary/[0.02] backdrop-blur-xl p-4 rounded border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Total Invoices
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-100 h-7 w-24 rounded"></div>
                  ) : (
                    stats.totalInvoices.toString()
                  )}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50/80 text-blue-700">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  24.5%
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-blue-500/5 text-blue-600">
              <DocumentDuplicateIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Paid</p>
                <p className="text-sm font-medium text-gray-900">1,102</p>
              </div>
              <div className="flex items-center text-xs text-blue-600">
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                <span>+12.3%</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-500">Pending</p>
                <p className="text-sm font-medium text-gray-900">182</p>
              </div>
              <div className="flex items-center text-xs text-blue-600">
                <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
                <span>-3.2%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Customers Card */}
        <div className="relative overflow-hidden bg-gradient-to-br from-white border-gray-200 to-primary/[0.02] backdrop-blur-xl p-4 rounded border border-gray-200/50 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">
                Active Customers
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-semibold text-gray-900">
                  {isLoading ? (
                    <div className="animate-pulse bg-gray-100 h-7 w-24 rounded"></div>
                  ) : (
                    stats.totalInvoices.toString()
                  )}
                </h3>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-violet-50/80 text-violet-700">
                  <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                  4.2%
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-violet-500/5 text-violet-600">
              <UsersIcon className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-500">Recent Activity</p>
              <p className="text-xs text-violet-600">Last 24h</p>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-50 ring-2 ring-white"
                >
                  <span className="text-xs font-medium text-violet-700">
                    {String.fromCharCode(65 + i)}
                  </span>
                </div>
              ))}
              <div className="relative inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-violet-50 ring-2 ring-white">
                <span className="text-xs font-medium text-violet-700">
                  +886
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
