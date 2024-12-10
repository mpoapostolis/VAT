import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { formatCurrency } from "@/lib/utils";
import type { Invoice } from "@/lib/pocketbase";
import { invoiceService } from "@/lib/services/invoice-service";
import { useMutateData } from "@/lib/hooks/useMutateData";
import {
  useTableParams,
  buildPocketBaseParams,
} from "@/lib/hooks/useTableParams";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { FolderOpen, Plus, FileText, Trash2, Edit2, Eye } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function InvoicesList() {
  const navigate = useNavigate();
  const tableParams = useTableParams();
  const { data, mutate } = useSWR(
    ["invoices", tableParams.page, tableParams.perPage, tableParams.sort],
    () => invoiceService.getList(buildPocketBaseParams(tableParams))
  );

  const { mutateData } = useMutateData();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    invoiceId: string | null;
  }>({
    isOpen: false,
    invoiceId: null,
  });

  const handleDelete = async () => {
    if (!deleteModal.invoiceId) return;
    await mutateData(
      mutate,
      () => invoiceService.delete(deleteModal.invoiceId!),
      {
        successMessage: "Invoice deleted successfully",
        errorMessage: "Failed to delete invoice",
      }
    );
    setDeleteModal({ isOpen: false, invoiceId: null });
  };

  const handleSort = (field: string) => {
    const currentSort = tableParams.sort;
    if (currentSort === field) {
      tableParams.setSort(`-${field}`);
    } else if (currentSort === `-${field}`) {
      tableParams.setSort("");
    } else {
      tableParams.setSort(field);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
            Invoices
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your invoices and transactions
          </p>
        </div>
        <Link
          to="/invoices/new"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded-lg"
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Link>
      </div>

      <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "number"
                    ? "asc"
                    : tableParams.sort === "-number"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("number")}
              >
                Invoice
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "customerId.name"
                    ? "asc"
                    : tableParams.sort === "-customerId.name"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("customerId.name")}
              >
                Customer
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "categoryId.name"
                    ? "asc"
                    : tableParams.sort === "-categoryId.name"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("categoryId.name")}
              >
                Category
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "total"
                    ? "asc"
                    : tableParams.sort === "-total"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("total")}
              >
                Amount
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "status"
                    ? "asc"
                    : tableParams.sort === "-status"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("status")}
              >
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#F1F5F9]">
                      <FileText className="w-4 h-4 text-[#3B82F6]" />
                    </div>
                    <div>
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                      >
                        {invoice.number}
                      </Link>
                      <div className="text-sm text-[#64748B]">
                        {new Date(invoice.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {invoice.expand?.customerId && (
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${invoice.expand.customerId.name}&background=random`}
                        alt={invoice.expand.customerId.name}
                        className="w-8 h-8 rounded-lg border border-black/10"
                      />
                      <div>
                        <Link
                          to={`/customers/${invoice.expand.customerId.id}`}
                          className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                        >
                          {invoice.expand.customerId.name}
                        </Link>
                        <div className="text-sm text-[#64748B]">
                          {invoice.expand.customerId.email}
                        </div>
                      </div>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  {invoice.expand?.categoryId ? (
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#F1F5F9]">
                        <FolderOpen className="w-4 h-4 text-[#3B82F6]" />
                      </div>
                      <div>
                        <div className="font-medium text-[#0F172A]">
                          {invoice.expand.categoryId.name || 'No Name'}
                        </div>
                        <div className="text-sm text-[#64748B]">
                          {invoice.expand.categoryId.type === "income"
                            ? "Income"
                            : "Expense"}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500">No Category</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="font-medium text-[#0F172A]">
                    {formatCurrency(invoice.total)}
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                      invoice.status === "paid"
                        ? "bg-[#DCFCE7] text-[#10B981]"
                        : invoice.status === "pending"
                        ? "bg-[#FEF9C3] text-[#F59E0B]"
                        : "bg-[#FEE2E2] text-[#EF4444]"
                    }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() +
                      invoice.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          pageIndex={tableParams.page - 1}
          pageSize={tableParams.perPage}
          pageCount={data?.totalPages || 1}
          onPageChange={(page) => tableParams.setPage(page + 1)}
          onPageSizeChange={(size) => tableParams.setPerPage(size)}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, invoiceId: null })}
        onConfirm={handleDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
      />
    </div>
  );
}
