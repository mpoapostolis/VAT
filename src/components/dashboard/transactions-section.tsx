import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, cn } from "@/lib/utils";
import { DocumentIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { Badge } from "../ui/badge";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useCompanies } from "@/lib/hooks/useCompanies";

export function TransactionsSection() {
  const { customers } = useCustomers({
    perPage: 500,
  });
  const { companies } = useCompanies({
    perPage: 500,
  });
  const { invoices, isLoading } = useInvoices();
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center h-64"
      >
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs text-gray-500">Loading transactions...</p>
        </div>
      </motion.div>
    );
  }

  if (!invoices.length) {
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
        <p className="text-xs text-gray-500 mt-2 max-w-sm">
          Get started by creating your first invoice. Your transactions will
          appear here.
        </p>
      </motion.div>
    );
  }

  // Add real revenue data based on invoices
  const getRevenueData = () => {
    if (!invoices?.length) return [];

    const monthlyData: Record<string, { receivable: number; payable: number }> =
      {};
    const now = new Date();
    const twelveMonthsAgo = new Date(now.setMonth(now.getMonth() - 11));

    // Initialize all months
    for (let i = 0; i < 12; i++) {
      const date = new Date(twelveMonthsAgo);
      date.setMonth(date.getMonth() + i);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });
      monthlyData[monthKey] = { receivable: 0, payable: 0 };
    }

    // Aggregate invoice data
    invoices.forEach((invoice) => {
      const date = new Date(invoice.date);
      if (date >= twelveMonthsAgo) {
        const monthKey = date.toLocaleString("default", {
          month: "short",
          year: "2-digit",
        });
        const type = invoice.type === "receivable" ? "receivable" : "payable";
        monthlyData[monthKey][type] += invoice.total || 0;
      }
    });

    // Convert to array format for chart
    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      receivable: Number(data.receivable.toFixed(2)),
      payable: Number(data.payable.toFixed(2)),
      total: Number((data.receivable - data.payable).toFixed(2)),
    }));
  };

  const revenueData = getRevenueData();
  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.total, 0);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Graph Card */}
        <div className="z-0 bg-white/50 backdrop-blur-xl border border-gray-200/50 rounded shadow-sm">
          <div className="p-3 sm:p-4 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-gray-50 ring-1 ring-gray-200/50">
                  <ChartBarIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xs font-semibold text-gray-900">
                    Revenue Overview
                  </h2>
                  <p className="text-xs sm:text-xs text-gray-500">
                    Last 12 months analysis
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-medium",
                    totalRevenue >= 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-700"
                  )}
                >
                  Net Total: {formatCurrency(totalRevenue)}
                </Badge>
              </div>
            </div>
          </div>
          <div className="px-3 sm:px-6 py-4">
            <ResponsiveContainer width="100%" height={380}>
              <AreaChart
                data={revenueData}
                margin={{
                  top: 20,
                  right: 20,
                  left: 0,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="colorReceivable"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPayable" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  dy={8}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  tickFormatter={(value) => formatCurrency(value)}
                  width={80}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const receivable =
                        payload.find((p) => p.name === "receivable")?.value ||
                        0;
                      const payable =
                        payload.find((p) => p.name === "payable")?.value || 0;
                      const total =
                        payload.find((p) => p.name === "total")?.value || 0;

                      return (
                        <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded shadow-lg p-4">
                          <p className="text-sm font-semibold text-gray-900 mb-2">
                            {label}
                          </p>
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between gap-6">
                              <span className="text-xs text-indigo-600">
                                Receivable
                              </span>
                              <span className="text-xs font-medium">
                                {formatCurrency(receivable)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-6">
                              <span className="text-xs text-rose-600">
                                Payable
                              </span>
                              <span className="text-xs font-medium">
                                {formatCurrency(payable)}
                              </span>
                            </div>
                            <div className="pt-1.5 border-t border-gray-200">
                              <div className="flex items-center justify-between gap-6">
                                <span className="text-xs text-emerald-600">
                                  Net Total
                                </span>
                                <span className="text-xs font-medium">
                                  {formatCurrency(total)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                  cursor={{
                    stroke: "#6366f1",
                    strokeWidth: 1,
                    strokeDasharray: "4 4",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="receivable"
                  name="receivable"
                  stroke="#818cf8"
                  strokeWidth={2}
                  fill="url(#colorReceivable)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#818cf8",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="payable"
                  name="payable"
                  stroke="#fb7185"
                  strokeWidth={2}
                  fill="url(#colorPayable)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#fb7185",
                    stroke: "#fff",
                    strokeWidth: 2,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="total"
                  stroke="#34d399"
                  strokeWidth={2}
                  fill="url(#colorTotal)"
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "#34d399",
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
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-gray-50 ring-1 ring-gray-200/50">
                  <DocumentIcon className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-base sm:text-xs font-semibold text-gray-900">
                    Recent Transactions
                  </h2>
                  <p className="text-xs sm:text-xs text-gray-500">
                    Latest 10 transactions
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-emerald-50 text-emerald-700"
                >
                  {invoices.length} Total
                </Badge>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50">
                  <TableHead className="font-medium text-gray-600 py-3 whitespace-nowrap">
                    Number
                  </TableHead>
                  <TableHead className="font-medium text-gray-600 py-3 whitespace-nowrap">
                    Customer
                  </TableHead>
                  <TableHead className="font-medium text-gray-600 py-3 whitespace-nowrap">
                    Date
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
                {invoices
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 10)
                  .map((invoice, index) => {
                    const customer = customers?.find(
                      (c) => c.id === invoice.customerId
                    );

                    const customerInitial = customer?.contactFirstName
                      ? customer.contactFirstName.charAt(0).toUpperCase()
                      : customer?.companyName
                      ? customer.companyName.charAt(0).toUpperCase()
                      : "?";

                    const customerName =
                      customer?.contactLastName ||
                      customer?.companyName ||
                      "Unknown";
                    const customerEmail = customer?.email || "No email";

                    return (
                      <motion.tr
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                        key={invoice.id}
                        className="group hover:bg-gray-50/50 transition-all duration-200"
                      >
                        <TableCell className="py-2">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/${invoice.type}s/${invoice.id}`}
                              className="text-gray-900 font-medium hover:text-blue-600 transition-colors"
                            >
                              <Badge
                                variant="secondary"
                                className="text-xs font-mono py-1"
                              >
                                #{invoice.number}
                              </Badge>
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-gray-900 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center ring-1 transition-colors",
                                invoice.type === "receivable"
                                  ? "bg-emerald-50 text-emerald-600 ring-emerald-600/20"
                                  : "bg-rose-50 text-rose-600 ring-rose-600/20"
                              )}
                            >
                              <span className="text-xs font-medium">
                                {customerInitial}
                              </span>
                            </div>
                            <Link
                              to={`/customers/${customer?.id}/edit`}
                              className="flex flex-col max-w-[200px] group/link"
                            >
                              <span className="truncate text-gray-900 font-medium group-hover/link:text-blue-600 transition-colors">
                                {customerName}
                              </span>
                              <span className="truncate text-xs text-gray-500 mt-0.5">
                                {customerEmail}
                              </span>
                            </Link>
                          </div>
                        </TableCell>
                        <TableCell className="whitespace-nowrap text-xs text-gray-500">
                          {new Date(invoice.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <span
                            className={cn(
                              "font-medium text-xs",
                              invoice.type === "receivable"
                                ? "text-emerald-600"
                                : "text-rose-600"
                            )}
                          >
                            {formatCurrency(invoice.total)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize text-xs font-medium px-2.5 py-1 border-0",
                              invoice.status === "paid"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                                : invoice.status === "overdue"
                                ? "bg-rose-50 text-rose-700 ring-1 ring-rose-600/20"
                                : invoice.status === "sent"
                                ? "bg-blue-50 text-blue-700 ring-1 ring-blue-600/20"
                                : "bg-gray-100 text-gray-700 ring-1 ring-gray-400/20"
                            )}
                          >
                            {invoice.status}
                          </Badge>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
          <div className="p-3 border-t border-gray-200/50">
            <Link
              to="/transactions"
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View all Transactions →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
