import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { DataTable } from "@/components/ui/data-table";
import { createColumnHelper } from "@tanstack/react-table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/lib/pocketbase";
import { FolderOpen } from "lucide-react";

const columnHelper = createColumnHelper<Invoice>();

const columns = [
  columnHelper.accessor("expand.customerId", {
    header: "Customer",
    cell: (info) => {
      const customer = info.getValue();
      if (!customer) return null;

      return (
        <div className="flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${customer.name}&background=random`}
            alt={customer.name}
            className="w-10 h-10 rounded-lg border border-black/10"
          />
          <div>
            <Link
              to={`/customers/${customer.id}`}
              className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
            >
              {customer.name}
            </Link>
            <div className="text-sm text-[#64748B]">{customer.email}</div>
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
          className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
        >
          {info.getValue()}
        </Link>
        <div className="text-sm text-[#64748B]">
          {formatDate(info.row.original.date)}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("expand.categoryId", {
    header: "Category",
    cell: (info) => {
      const category = info.getValue();
      if (!category) return null;

      return (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#F1F5F9]">
            <FolderOpen className="w-4 h-4 text-[#3B82F6]" />
          </div>
          <div>
            <Link
              to={`/categories/${category.id}`}
              className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
            >
              {category.name}
            </Link>
            <div className="text-sm text-[#64748B]">
              {category.type === "income" ? "Income" : "Expense"}
            </div>
          </div>
        </div>
      );
    },
  }),
  columnHelper.accessor("total", {
    header: "Amount",
    cell: (info) => (
      <div className="font-medium text-[#0F172A]">
        {formatCurrency(info.getValue())}
      </div>
    ),
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue();
      const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
          case "paid":
            return "bg-[#DCFCE7] text-[#10B981]";
          case "pending":
            return "bg-[#FEF9C3] text-[#F59E0B]";
          case "overdue":
            return "bg-[#FEE2E2] text-[#EF4444]";
          default:
            return "bg-[#F1F5F9] text-[#64748B]";
        }
      };

      return (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${getStatusColor(
            status
          )}`}
        >
          {status}
        </span>
      );
    },
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
    <DataTable
      columns={columns}
      data={transactions}
      isLoading={isLoading}
      pageCount={1}
      pageSize={5}
      sortable={false}
      emptyState={{
        title: "No transactions found",
        description: "There are no transactions in the selected date range.",
      }}
    />
  );
}
