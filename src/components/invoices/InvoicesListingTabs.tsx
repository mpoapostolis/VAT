import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import useSWR from "swr";
import { formatCurrency } from "@/lib/utils";
import { pb } from "@/lib/pocketbase";
import type { Invoice } from "@/lib/pocketbase";
import {
  useTableParams,
  buildPocketBaseParams,
} from "@/lib/hooks/useTableParams";
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  FileText,
  Search,
  RotateCcw,
  ChevronDown,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import { invoiceService } from "@/lib/services/invoice-service";

function InvoiceFilters({ type }: { type: "receivable" | "payable" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Build filter string for PocketBase
  const buildFilter = () => {
    const filters = [`type = '${type}'`];

    if (searchParams.get("customerId")) {
      filters.push(`customerId = '${searchParams.get("customerId")}'`);
    }
    if (searchParams.get("status")) {
      filters.push(`status = '${searchParams.get("status")}'`);
    }
    if (searchParams.get("currency")) {
      filters.push(`currency = '${searchParams.get("currency")}'`);
    }
    if (searchParams.get("from")) {
      filters.push(`date >= '${searchParams.get("from")}'`);
    }
    if (searchParams.get("to")) {
      filters.push(`date <= '${searchParams.get("to")}'`);
    }

    const filter = filters.join(" && ");
    console.log("Filter:", filter);
    return filter;
  };

  const { data: customers } = useSWR(["customers", type], () =>
    pb.collection("customers").getList(1, 50, {
      filter: type === "receivable" ? "type = 'client'" : "type = 'vendor'",
    })
  );

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <div className="flex wf items-center gap-4">
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500">Customer</span>
        <Select
          value={searchParams.get("customerId") || ""}
          onChange={(value) => updateSearchParam("customerId", value)}
          options={[
            { label: "All Customers", value: "" },
            ...(customers?.items.map((customer) => ({
              label: customer.name,
              value: customer.id,
            })) || []),
          ]}
          placeholder="All Customers"
          className="min-w-[200px] rounded"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500">Status</span>
        <Select
          value={searchParams.get("status") || ""}
          onChange={(value) => updateSearchParam("status", value)}
          options={[
            { label: "All", value: "" },
            { label: "Draft", value: "draft" },
            { label: "Pending", value: "pending" },
            { label: "Paid", value: "paid" },
            { label: "Overdue", value: "overdue" },
          ]}
          placeholder="All Statuses"
          className="min-w-[160px] rounded"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-medium text-slate-500">Currency</span>
        <Select
          value={searchParams.get("currency") || ""}
          onChange={(value) => updateSearchParam("currency", value)}
          options={[
            { label: "All", value: "" },
            { label: "EUR", value: "EUR" },
            { label: "USD", value: "USD" },
            { label: "GBP", value: "GBP" },
          ]}
          placeholder="All Currencies"
          className="min-w-[160px] rounded"
        />
      </div>

      <div className="flex flex-col gap-1.5 flex-1 items-end">
        <span className="text-xs font-medium text-slate-500">Date Range</span>
        <DateRangePicker
          from={
            searchParams.get("from")
              ? new Date(searchParams.get("from")!)
              : undefined
          }
          to={
            searchParams.get("to")
              ? new Date(searchParams.get("to")!)
              : undefined
          }
          onSelect={(range) => {
            const params = new URLSearchParams(searchParams);
            if (range?.from) {
              params.set("from", range.from.toISOString());
            } else {
              params.delete("from");
            }
            if (range?.to) {
              params.set("to", range.to.toISOString());
            } else {
              params.delete("to");
            }
            navigate(`?${params.toString()}`, { replace: true });
          }}
          className="rounded"
        />
      </div>
    </div>
  );
}

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

  const buildFilter = () => {
    const filters = [`type = '${type}'`];

    if (searchParams.get("customerId")) {
      filters.push(`customerId = '${searchParams.get("customerId")}'`);
    }
    if (searchParams.get("status")) {
      filters.push(`status = '${searchParams.get("status")}'`);
    }
    if (searchParams.get("currency")) {
      filters.push(`currency = '${searchParams.get("currency")}'`);
    }
    if (searchParams.get("from")) {
      filters.push(`date >= '${searchParams.get("from")}'`);
    }
    if (searchParams.get("to")) {
      filters.push(`date <= '${searchParams.get("to")}'`);
    }

    const filter = filters.join(" && ");
    console.log("Filter:", filter);
    return filter;
  };

  const { data: invoices, mutate } = useSWR(
    [
      "invoices",
      type,
      searchParams.toString(),
      tableParams.page,
      tableParams.perPage,
      tableParams.sort?.id,
      tableParams.sort?.desc,
    ],
    () =>
      invoiceService.getList({
        type,
        customerId: searchParams.get("customerId") || undefined,
        status: searchParams.get("status") || undefined,
        currency: searchParams.get("currency") || undefined,
        startDate: searchParams.get("from")
          ? new Date(searchParams.get("from")!)
          : undefined,
        endDate: searchParams.get("to")
          ? new Date(searchParams.get("to")!)
          : undefined,
        ...buildPocketBaseParams(tableParams),
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
      <InvoiceFilters type={type} />
      <div className="bg-white border border-black/10 rounded overflow-hidden">
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
                {type === "receivable" ? "Customer" : "Issuer"}
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
            {invoices?.items.map((invoice: Invoice) => (
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
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Eye className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/invoices/${invoice.id}/edit`)}
                      className="p-2 hover:bg-gray-100 rounded"
                    >
                      <Edit2 className="w-4 h-4 text-gray-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setDeleteModal({ isOpen: true, invoiceId: invoice.id })
                      }
                      className="p-2 hover:bg-gray-100 rounded"
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
          pageCount={invoices?.totalPages || 1}
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
          <Button
            onClick={() => navigate("/invoices/new")}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded"
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
