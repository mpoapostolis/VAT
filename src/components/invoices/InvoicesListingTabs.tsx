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
  Building2,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity,
  Percent,
  Banknote,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, Copy, Send } from "lucide-react";
import { useToast } from "@/lib/hooks/useToast";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from "@/components/ui/table";

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

    return filters.join(" && ");
  };

  const { data: customers } = useSWR(["customers", type], () =>
    pb.collection("customers").getList(1, 50, {
      filter: type === "receivable" ? "type = 'client'" : "type = 'vendor'",
      sort: "name",
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
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const { addToast } = useToast();
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

    return filters.join(" && ");
  };

  const [sort, setSort] = useState("-date");

  const handleSort = (field: string) => {
    if (sort === field) {
      setSort(`-${field}`);
    } else if (sort === `-${field}`) {
      setSort("date");
    } else {
      setSort(field);
    }
  };

  const { data: invoices, mutate } = useSWR(
    ["invoices", type, searchParams.toString(), sort],
    () =>
      pb.collection("invoices").getList(tableParams.page, tableParams.perPage, {
        filter: buildFilter(),
        sort,
        expand: "customerId",
      })
  );

  const handleDelete = async () => {
    if (!deleteModal.invoiceId) return;
    try {
      await pb.collection("invoices").delete(deleteModal.invoiceId);
      mutate();
      setDeleteModal({ isOpen: false, invoiceId: null });
    } catch (error) {
      console.error("Failed to delete invoice:", error);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    console.log("Select all:", checked);
    if (checked) {
      const newSelected = invoices?.items.map((invoice) => invoice.id) || [];
      console.log("Selecting all:", newSelected);
      setSelectedInvoices(newSelected);
    } else {
      setSelectedInvoices([]);
    }
  };

  const handleSelectInvoice = (checked: boolean, invoiceId: string) => {
    console.log("Select invoice:", invoiceId, checked);
    if (checked) {
      setSelectedInvoices((prev) => {
        const newSelected = [...prev, invoiceId];
        console.log("New selected:", newSelected);
        return newSelected;
      });
    } else {
      setSelectedInvoices((prev) => prev.filter((id) => id !== invoiceId));
    }
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedInvoices.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-secondary/20 rounded">
          <span className="text-sm font-medium">
            {selectedInvoices.length}{" "}
            {selectedInvoices.length === 1 ? "invoice" : "invoices"} selected
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {}}
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            {type === "receivable" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {}}
                className="flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Issue
              </Button>
            )}
          </div>
        </div>
      )}

      <InvoiceFilters type={type} />
      <div className="bg-white border border-border/40 rounded shadow-sm">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-border bg-muted/50">
                <TableHead className="w-[40px] p-0">
                  <div className="h-4 w-4 p-4">
                    <Checkbox
                      checked={
                        selectedInvoices.length > 0 &&
                        selectedInvoices.length === invoices?.items?.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </div>
                </TableHead>

                {/* Issuer/Client Column */}
                <TableHead
                  sortable
                  sorted={
                    sort === "customerId.name"
                      ? "asc"
                      : sort === "-customerId.name"
                      ? "desc"
                      : false
                  }
                  onSort={() => handleSort("customerId.name")}
                  className="min-w-[200px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Building2 className="w-4 h-4" />
                    {type === "receivable" ? "Client" : "Issuer"}
                  </div>
                </TableHead>

                {/* Invoice Number */}
                <TableHead
                  sortable
                  sorted={
                    sort === "number"
                      ? "asc"
                      : sort === "-number"
                      ? "desc"
                      : false
                  }
                  onSort={() => handleSort("number")}
                  className="min-w-[150px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    Invoice No.
                  </div>
                </TableHead>

                {/* Invoice Status */}
                <TableHead
                  sortable
                  sorted={
                    sort === "status"
                      ? "asc"
                      : sort === "-status"
                      ? "desc"
                      : false
                  }
                  onSort={() => handleSort("status")}
                  className="min-w-[130px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Activity className="w-4 h-4" />
                    Status
                  </div>
                </TableHead>

                {/* Issue Date */}
                <TableHead
                  sortable
                  sorted={
                    sort === "date" ? "asc" : sort === "-date" ? "desc" : false
                  }
                  onSort={() => handleSort("date")}
                  className="min-w-[130px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Issue Date
                  </div>
                </TableHead>

                {/* Due Date */}
                <TableHead
                  sortable
                  sorted={
                    sort === "dueDate"
                      ? "asc"
                      : sort === "-dueDate"
                      ? "desc"
                      : false
                  }
                  onSort={() => handleSort("dueDate")}
                  className="min-w-[130px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    Due Date
                  </div>
                </TableHead>

                {/* Total */}
                <TableHead
                  sortable
                  sorted={
                    sort === "total"
                      ? "asc"
                      : sort === "-total"
                      ? "desc"
                      : false
                  }
                  onSort={() => handleSort("total")}
                  className="min-w-[120px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    Total
                  </div>
                </TableHead>

                {/* VAT */}
                <TableHead
                  sortable
                  sorted={
                    sort === "vat" ? "asc" : sort === "-vat" ? "desc" : false
                  }
                  onSort={() => handleSort("vat")}
                  className="min-w-[120px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Percent className="w-4 h-4" />
                    VAT
                  </div>
                </TableHead>

                {/* Paid */}
                <TableHead
                  sortable
                  sorted={
                    sort === "paid" ? "asc" : sort === "-paid" ? "desc" : false
                  }
                  onSort={() => handleSort("paid")}
                  className="min-w-[120px]"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                    <Banknote className="w-4 h-4" />
                    Paid
                  </div>
                </TableHead>

                {/* Actions */}
                <TableHead className="w-[100px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.items.map((invoice: Invoice) => (
                <TableRow
                  key={invoice.id}
                  className="group hover:bg-muted/30 transition-all duration-200"
                >
                  {/* Checkbox */}
                  <TableCell className="p-0">
                    <div className="h-4 w-4 p-4">
                      <Checkbox
                        checked={selectedInvoices.includes(invoice.id)}
                        onChange={(e) =>
                          handleSelectInvoice(e.target.checked, invoice.id)
                        }
                      />
                    </div>
                  </TableCell>

                  {/* Issuer/Client */}
                  <TableCell className="py-3">
                    <Link
                      to={`/customers/${invoice.customerId}`}
                      className="font-medium text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-2 group-hover:underline"
                    >
                      <Building2 className="w-4 h-4 text-slate-400" />
                      {invoice.expand?.customerId?.name}
                    </Link>
                  </TableCell>

                  {/* Invoice Number */}
                  <TableCell className="py-3">
                    <Link
                      to={`/invoices/${invoice.id}/view`}
                      className="font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-2 group-hover:underline"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      {invoice.number}
                    </Link>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                        invoice.status === "paid"
                          ? "bg-green-100 text-green-800 ring-1 ring-green-600/20"
                          : invoice.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-600/20"
                          : invoice.status === "overdue"
                          ? "bg-red-100 text-red-800 ring-1 ring-red-600/20"
                          : "bg-gray-100 text-gray-800 ring-1 ring-gray-600/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          invoice.status === "paid"
                            ? "bg-green-600"
                            : invoice.status === "pending"
                            ? "bg-yellow-600"
                            : invoice.status === "overdue"
                            ? "bg-red-600"
                            : "bg-gray-600"
                        }`}
                      />
                      {invoice.status.charAt(0).toUpperCase() +
                        invoice.status.slice(1)}
                    </span>
                  </TableCell>

                  {/* Issue Date */}
                  <TableCell className="text-slate-600 py-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(invoice.date).toLocaleDateString()}
                    </div>
                  </TableCell>

                  {/* Due Date */}
                  <TableCell className="text-slate-600 py-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400" />
                      {new Date(invoice.dueDate).toLocaleDateString()}
                    </div>
                  </TableCell>

                  {/* Total */}
                  <TableCell className="font-medium text-slate-700 py-3">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-slate-400" />
                      {formatCurrency(invoice.total)}
                    </div>
                  </TableCell>

                  {/* VAT */}
                  <TableCell className="font-medium text-slate-700 py-3">
                    <div className="flex items-center gap-2">
                      <Percent className="w-4 h-4 text-slate-400" />
                      {formatCurrency(invoice.vat)}
                    </div>
                  </TableCell>

                  {/* Paid */}
                  <TableCell className="font-medium text-slate-700 py-3">
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-slate-400" />
                      {formatCurrency(invoice.paid)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
