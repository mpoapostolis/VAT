import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DataTable } from "@/components/ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/lib/pocketbase";

const columnHelper = createColumnHelper<Invoice>();

const columns = [
  columnHelper.accessor("expand.customerId", {
    header: "Customer",
    cell: (info) => {
      const customer = info.getValue();
      if (!customer) return null;

      return (
        <div className="flex items-center space-x-3">
          <img
            src={`https://ui-avatars.com/api/?name=${customer.name}&background=random`}
            alt={customer.name}
            className="w-10 h-10 rounded-full border border-gray-200"
          />
          <div>
            <Link
              to={`/customers/${customer.id}`}
              className="font-medium text-gray-900 hover:text-[#0066FF] transition-colors"
            >
              {customer.name}
            </Link>
            <div className="text-sm text-gray-500">{customer.email}</div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("number", {
    header: "Invoice",
    cell: (info) => (
      <div>
        <Link
          to={`/invoices/${info.row.original.id}`}
          className="font-medium text-[#0066FF] hover:text-blue-700 transition-colors"
        >
          {info.getValue()}
        </Link>
        <div className="text-sm text-gray-500">
          {formatDate(info.row.original.date)}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("dueDate", {
    header: "Due Date",
    cell: (info) => (
      <div className="text-gray-500">{formatDate(info.getValue())}</div>
    ),
  }),
  columnHelper.accessor("total", {
    header: "Amount",
    cell: (info) => (
      <span className="font-medium text-gray-900">
        {formatCurrency(info.getValue())}
      </span>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
          info.getValue() === "paid"
            ? "bg-green-50 text-green-700 border border-green-200"
            : info.getValue() === "overdue"
            ? "bg-red-50 text-red-700 border border-red-200"
            : "bg-yellow-50 text-yellow-700 border border-yellow-200"
        }`}
      >
        {info.getValue().toUpperCase()}
      </span>
    ),
  }),
];

interface TransactionsSectionProps {
  isLoading: boolean;
  transactions: Invoice[];
}

export function TransactionsSection({
  isLoading,
  transactions,
}: TransactionsSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
    >
      <div className="py-4">
        <h2 className="text-lg font-semibold text-gray-900">Recent Invoices</h2>
      </div>
      <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded">
        <DataTable
          sortable={false}
          data={transactions}
          columns={columns}
          pageSize={5}
          pageCount={1}
          isLoading={isLoading}
          emptyState={{
            title: "No invoices found",
            description: "There are no invoices in the selected date range.",
          }}
        />
      </div>
    </motion.div>
  );
}
