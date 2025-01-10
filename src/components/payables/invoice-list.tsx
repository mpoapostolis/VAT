import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { formatCurrency, cn } from "@/lib/utils";
import { useTableParams } from "@/lib/hooks/useTableParams";
import {
  Plus,
  Trash2,
  FileText,
  Search,
  RotateCcw,
  ChevronDown,
  Building2,
  Calendar,
  CreditCard,
  AlertCircle,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { Disclosure, Transition } from "@headlessui/react";
import { AnimatedPage } from "../AnimatedPage";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { useInvoiceTotals } from "@/lib/hooks/useInvoiceTotals";
import { DocumentIcon } from "@heroicons/react/24/outline";
import { pb } from "@/lib/pocketbase";
import { AdvancedFilters } from "../advanced-filters";
import { ActionDropdown } from "../ui/action-dropdown";

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  className,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: { value: number; isPositive: boolean };
  className?: string;
}) {
  return (
    <Card
      className={cn(
        // Layout
        "relative overflow-hidden",
        // Interactive states
        "group  transition-all duration-300",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out pointer-events-none" />
      <div className="relative p-6 flex items-start gap-4">
        <div
          className={cn(
            // Base styles
            " p-2.5 flex items-center justify-center",
            // Transitions
            "transition-all duration-300",
            // Color variants
            className?.includes("emerald")
              ? "bg-emerald-100/80 text-emerald-500 group-hover:bg-emerald-100 group-hover:text-emerald-600"
              : className?.includes("rose")
              ? "bg-rose-100/80 text-rose-500 group-hover:bg-rose-100 group-hover:text-rose-600"
              : className?.includes("amber")
              ? "bg-amber-100/80 text-amber-500 group-hover:bg-amber-100 group-hover:text-amber-600"
              : "bg-blue-100/80 text-blue-600 group-hover:bg-blue-100"
          )}
        >
          <Icon className="h-4 w-4 transition-all duration-300 group-hover:scale-110" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
            {title}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className=" font-semibold tracking-tight text-gray-600">
              {value}
            </h3>
            {trend && (
              <span
                className={cn(
                  // Base styles
                  "inline-flex items-center text-xs font-medium",
                  // Transitions
                  "transition-all duration-300 group-hover:scale-105",
                  // Color variants
                  trend.isPositive
                    ? "text-emerald-500 group-hover:text-emerald-600"
                    : "text-rose-500 group-hover:text-rose-600"
                )}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="mr-0.5 h-4 w-4" />
                ) : (
                  <ArrowDownRight className="mr-0.5 h-4 w-4" />
                )}
                {Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function InvoiceList() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const tableParams = useTableParams();

  const { invoices, isLoading, ...rest } = useInvoices({
    type: "payable",
  });

  const invoiceTotals = useInvoiceTotals();
  const { customers } = useCustomers({
    perPage: 500,
    filter: "relationship = 'Vendor'",
  });
  const { companies } = useCompanies({
    perPage: 500,
  });

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleDelete = async (id: string) => {
    await pb.collection("invoices").delete(id);
    rest.mutate();
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100/50 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
                Payable Invoices
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Manage your payable invoices and track payments to vendors
            </p>
          </div>

          <Button
            size="sm"
            className="-sm bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 transition-all group relative overflow-hidden"
          >
            <Link to="/payables/new" className="flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Plus className="mr-1.5 h-4 w-4 group-hover:scale-110 transition-transform" />
              New Payable Invoice
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Total Payables"
            value={formatCurrency(invoiceTotals?.totalPayableAmount || 0)}
            icon={ArrowDownRight}
            className="bg-rose-50/50 text-rose-500"
          />
          <StatsCard
            title="Paid Payables Invoices"
            value={String(invoiceTotals?.totalPaidPayables || 0)}
            icon={FileText}
            className="bg-blue-50/50 text-blue-500"
          />
          <StatsCard
            title="Issued Invoices"
            value={String(invoiceTotals.totalIssuedInvoicesPayable || 0)}
            icon={AlertCircle}
            className="bg-amber-50/50 text-amber-500"
          />
          <StatsCard
            title="Overdue Invoices"
            value={String(invoiceTotals.totalOverdueInvoices || 0)}
            icon={AlertCircle}
            className="bg-rose-50/50 text-rose-500"
          />
        </div>

        <AdvancedFilters
          filters={[
            "search",
            "vendor",
            "company",
            "status",
            "currency",
            "amountRange",
            "dateRange",
          ]}
        />

        <Card className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vendor
                  </TableHead>
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Invoice Number
                  </TableHead>
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Issue Date
                  </TableHead>
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Due Date
                  </TableHead>
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                    Total
                  </TableHead>
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                    VAT
                  </TableHead>
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                    Paid
                  </TableHead>

                  <TableHead className="w-[100px] py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                        <span className="text-gray-600">
                          Loading invoices...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : invoices?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                        <span className="text-gray-600">No invoices found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  invoices?.map((invoice, index) => {
                    const customer = invoice?.expand?.customerId;
                    const customerName =
                      customer?.companyName ||
                      customer?.contactFirstName ||
                      "Unknown";

                    const customerEmail = customer?.email || "No email";

                    return (
                      <TableRow
                        key={invoice.id}
                        className={cn(
                          "group border-b border-gray-100 transition-colors cursor-pointer",
                          index % 2 === 0 ? "bg-gray-50/30" : "bg-white",
                          "hover:bg-blue-50/50"
                        )}
                        onClick={() => navigate(`/payables/${invoice.id}`)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col max-w-[200px]">
                              <span className="truncate text-gray-900 font-medium">
                                {customerName}
                              </span>
                              <span className="truncate text-xs text-gray-500 mt-0.5">
                                {customerEmail}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs min-w-[150px] font-mono py-1"
                          >
                            #{invoice.number}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-xs text-gray-900">
                            {new Date(invoice.date).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={cn("text-xs px-2 py-0  text-gray-900")}
                          >
                            {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "capitalize text-xs font-medium px-2 py-0 border-0",
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
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-xs font-medium text-gray-900">
                              €
                              {invoice.total.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-900">
                              €
                              {invoice.vatAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-gray-900">
                              €
                              {(invoice.paid || 0).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <ActionDropdown
                              onDuplicate={() =>
                                rest.duplicateInvoice(invoice.id!)
                              }
                              onDelete={() => handleDelete(invoice.id!)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
            <TablePagination
              pageIndex={Number(tableParams.page) - 1}
              pageSize={tableParams.perPage}
              totalItems={rest?.totalItems}
              pageCount={rest?.totalPages}
              onPageChange={(page) => tableParams.setPage(page + 1)}
              onPageSizeChange={(size) => tableParams.setPerPage(size)}
            />
          </div>
        </Card>
      </div>
    </AnimatedPage>
  );
}
