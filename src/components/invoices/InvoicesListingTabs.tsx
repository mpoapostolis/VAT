import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { formatCurrency } from "@/lib/utils";
import type { Invoice } from "@/lib/pocketbase";
import { invoiceService } from "@/lib/services/invoice-service";
import { useTableParams, buildPocketBaseParams } from "@/lib/hooks/useTableParams";
import { Plus, Eye, Edit2, Trash2, FileText } from "lucide-react";
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
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

function InvoiceTable({ type }: { type: "receivable" | "payable" }) {
  const navigate = useNavigate();
  const tableParams = useTableParams();
  const [searchParams] = useSearchParams();
  const [deleteModal, setDeleteModal] = React.useState<{
    isOpen: boolean;
    invoiceId: string | null;
  }>({
    isOpen: false,
    invoiceId: null,
  });

  const parseDateSafely = (dateStr: string | null): Date | undefined => {
    if (!dateStr) return undefined;
    try {
      const date = new Date(dateStr);
      return isNaN(date.getTime()) ? undefined : date;
    } catch {
      return undefined;
    }
  };

  const from = parseDateSafely(searchParams.get("from"));
  const to = parseDateSafely(searchParams.get("to"));

  const { data, mutate } = useSWR(
    [
      "invoices",
      type,
      tableParams.page,
      tableParams.perPage,
      tableParams.sort,
      from,
      to,
    ],
    () =>
      invoiceService.getList({
        ...buildPocketBaseParams(tableParams),
        type,
        startDate: from,
        endDate: to,
      })
  );

  const handleDelete = async () => {
    if (!deleteModal.invoiceId) return;
    try {
      await invoiceService.delete(deleteModal.invoiceId);
      mutate();
      setDeleteModal({ isOpen: false, invoiceId: null });
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  const handleSort = (field: string) => {
    const currentSort = tableParams.sort;
    if (currentSort === field) {
      tableParams.setSort(`-${field}`);
    } else if (currentSort === `-${field}`) {
      tableParams.setSort(undefined);
    } else {
      tableParams.setSort(field);
    }
  };

  return (
    <div className="space-y-4">
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
                Invoice Number
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
                {type === "receivable" ? "Client" : "Issuer"}
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "date"
                    ? "asc"
                    : tableParams.sort === "-date"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("date")}
              >
                Issue Date
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
                Total
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
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((invoice: Invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.number}</TableCell>
                <TableCell>{invoice.expand?.customerId?.name}</TableCell>
                <TableCell>
                  {new Date(invoice.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{formatCurrency(invoice.total)}</TableCell>
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
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/invoices/${invoice.id}`)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteModal({ isOpen: true, invoiceId: invoice.id })
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
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

export function InvoicesListingTabs() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
            Invoices
          </h1>
          <p className="text-sm text-gray-500">
            Manage your invoices and track their status
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DateRangePicker />
          <Button
            onClick={() => navigate("/invoices/new")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded-lg"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <Tabs defaultValue="receivable" className="space-y-6">
        <TabsList className="border-b">
          <TabsTrigger value="receivable">Account Receivables</TabsTrigger>
          <TabsTrigger value="payable">Account Payables</TabsTrigger>
        </TabsList>

        <TabsContent value="receivable">
          <InvoiceTable type="receivable" />
        </TabsContent>

        <TabsContent value="payable">
          <InvoiceTable type="payable" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
