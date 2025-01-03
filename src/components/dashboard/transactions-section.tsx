import React from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { Invoice } from "@/lib/pocketbase";
import {
  DocumentIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  PrinterIcon,
  FunnelIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { mockRevenueData } from "@/lib/mock-data";

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return <CheckCircleIcon className="w-5 h-5 text-emerald-500" />;
    case "pending":
      return <ClockIcon className="w-5 h-5 text-amber-500" />;
    case "overdue":
      return <XCircleIcon className="w-5 h-5 text-red-500" />;
    default:
      return null;
  }
};

const getStatusStyles = (status: string) => {
  const baseStyles =
    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ring-1 transition-all duration-200";
  switch (status.toLowerCase()) {
    case "paid":
      return cn(
        baseStyles,
        "bg-emerald-50 text-emerald-700 ring-emerald-200/50 shadow-sm"
      );
    case "pending":
      return cn(
        baseStyles,
        "bg-amber-50 text-amber-700 ring-amber-200/50 shadow-sm"
      );
    case "overdue":
      return cn(baseStyles, "bg-red-50 text-red-700 ring-red-200/50 shadow-sm");
    default:
      return cn(
        baseStyles,
        "bg-gray-50 text-gray-700 ring-gray-200/50 shadow-sm"
      );
  }
};

export function TransactionsSection({
  transactions = [],
  isLoading = false,
}: {
  transactions: any[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-gray-500">Loading transactions...</p>
        </div>
      </motion.div>
    );
  }

  if (!transactions.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-64 text-center px-4 rounded border border-dashed border-gray-200 bg-gray-50/50"
      >
        <DocumentIcon className="w-16 h-16 text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">
          No transactions yet
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm">
          Get started by creating your first invoice. Your transactions will
          appear here.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Graph Card */}
        <div className="z-0 bg-white/50 backdrop-blur-xl border border-gray-200/50 rounded shadow-sm">
          <div className="p-3 sm:p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-gray-50 ring-1 ring-gray-200/50">
                <ChartBarIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Revenue Overview
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Monthly revenue analysis
                </p>
              </div>
            </div>
          </div>
          <div className="px-3 sm:px-6 py-4">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart
                data={mockRevenueData}
                margin={{
                  top: 20,
                  right: 0,
                  left: -20,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                  interval="preserveStartEnd"
                  minTickGap={10}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `€${value / 1000}k`}
                  dx={-10}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    padding: "8px 12px",
                  }}
                  formatter={(value: any) => [
                    `€${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  cursor={{
                    stroke: "#6366f1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorAmount)"
                  dot={false}
                  activeDot={{
                    r: 4,
                    fill: "#6366f1",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Transactions Card */}
        <div className="z-0 bg-white/50 backdrop-blur-xl border border-gray-200/50 rounded shadow-sm">
          <div className="p-3 sm:p-4 border-b border-gray-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-gray-50 ring-1 ring-gray-200/50">
                <DocumentIcon className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Recent Transactions
                </h2>
                <p className="text-xs sm:text-sm text-gray-500">
                  Latest 5 transactions
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-medium text-gray-600 py-3 whitespace-nowrap">
                    Customer
                  </TableHead>
                  <TableHead className="font-medium text-gray-600 text-right whitespace-nowrap">
                    Amount
                  </TableHead>
                  <TableHead className="font-medium text-gray-600 whitespace-nowrap">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.slice(0, 5).map((transaction, index) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    key={transaction.id}
                    className="group hover:bg-gray-50/50 transition-all duration-200"
                  >
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative">
                          <img
                            src={`https://ui-avatars.com/api/?name=${transaction.expand?.customerId?.name}&background=random`}
                            alt={transaction.expand?.customerId?.name}
                            className="w-8 h-8 rounded-full bg-gray-50 border border-gray-200 object-cover shadow-sm group-hover:shadow-md transition-all duration-200"
                          />
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white" />
                        </div>
                        <div>
                          <Link
                            to={`/customers/${transaction.expand?.customerId?.id}`}
                            className="font-medium text-gray-900 hover:text-primary transition-colors text-sm sm:text-base"
                          >
                            {transaction.expand?.customerId?.name}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.created)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <span className="font-medium text-gray-900 text-xs">
                        {formatCurrency(transaction.amount ?? 0)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className={getStatusStyles(transaction.status)}>
                        {getStatusIcon(transaction.status)}
                        <span className="hidden sm:inline">
                          {transaction.status}
                        </span>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="p-3 border-t border-gray-200/50">
            <Link
              to="/transactions"
              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all transactions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
