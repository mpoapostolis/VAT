import React from "react";
import { Link } from "react-router-dom";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Invoice } from "@/lib/pocketbase";
import { FolderOpen } from "lucide-react";

interface TransactionsSectionProps {
  isLoading: boolean;
  transactions: Invoice[];
}

export function TransactionsSection({
  isLoading,
  transactions,
}: TransactionsSectionProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead>Invoice</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <div className="flex items-center gap-4">
                  <img
                    src={`https://ui-avatars.com/api/?name=${transaction.expand?.customerId?.name}&background=random`}
                    alt={transaction.expand?.customerId?.name}
                    className="w-10 h-10 rounded-lg border border-black/10"
                  />
                  <div>
                    <Link
                      to={`/customers/${transaction.expand?.customerId?.id}`}
                      className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                    >
                      {transaction.expand?.customerId?.name}
                    </Link>
                    <div className="text-sm text-[#64748B]">{transaction.expand?.customerId?.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <Link
                    to={`/invoices/${transaction.id}`}
                    className="font-medium text-[#3B82F6] hover:text-[#2563EB] transition-colors"
                  >
                    {transaction.number}
                  </Link>
                  <div className="text-sm text-[#64748B]">
                    {formatDate(transaction.date)}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#F1F5F9]">
                    <FolderOpen className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <Link
                      to={`/categories/${transaction.expand?.categoryId?.id}`}
                      className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                    >
                      {transaction.expand?.categoryId?.name}
                    </Link>
                    <div className="text-sm text-[#64748B]">
                      {transaction.expand?.categoryId?.type === "income" ? "Income" : "Expense"}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="font-medium text-[#0F172A]">
                  {formatCurrency(transaction.total)}
                </div>
              </TableCell>
              <TableCell>
                <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  transaction.status === "paid"
                    ? "bg-[#DCFCE7] text-[#10B981]"
                    : transaction.status === "pending"
                    ? "bg-[#FEF9C3] text-[#F59E0B]"
                    : "bg-[#FEE2E2] text-[#EF4444]"
                }`}>
                  {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
