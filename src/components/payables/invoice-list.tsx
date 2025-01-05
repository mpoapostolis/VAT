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
            "rounded p-2.5 flex items-center justify-center",
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
            <h3 className="text-2xl font-semibold tracking-tight text-gray-900">
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
    perPage: 500,
    type: "payable",
  });

  const invoiceTotals = useInvoiceTotals(invoices);
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

  const handleDelete = (id: string) => {
    // implement delete logic here
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
            className="rounded-sm bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 transition-all group relative overflow-hidden"
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
            value={formatCurrency(invoiceTotals.totalPayables || 0)}
            icon={ArrowDownRight}
            className="bg-rose-50/50 text-rose-500"
          />
          <StatsCard
            title="Payable Invoices"
            value={String(invoiceTotals.payableInvoices || 0)}
            icon={FileText}
            className="bg-blue-50/50 text-blue-500"
          />
          <StatsCard
            title="Pending Payables"
            value={String(invoiceTotals.pendingPayables || 0)}
            icon={AlertCircle}
            className="bg-amber-50/50 text-amber-500"
          />
          <StatsCard
            title="Paid Invoices"
            value={String(invoiceTotals.paidPayables || 0)}
            icon={FileText}
            className="bg-emerald-50/50 text-emerald-500"
          />
        </div>

        <Card className="p-6 bg-white  transition-all duration-300 border border-gray-200/50  bg-white/50">
          <Disclosure defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="w-full focus:outline-none">
                  <div className="flex items-center justify-between cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                        <h2 className="text-base font-medium bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 group-hover:from-gray-800 group-hover:to-gray-500 transition-all">
                          Advanced Filters
                        </h2>
                      </div>
                      <div className="flex gap-1.5">
                        {Object.keys(Object.fromEntries([...searchParams]))
                          .length > 1 && (
                          <>
                            <Badge
                              variant="outline"
                              className="bg-blue-50/50 border-blue-200/50 text-blue-700 hover:bg-blue-100/50 transition-colors"
                            >
                              {Object.keys(
                                Object.fromEntries([...searchParams])
                              ).length - 1}{" "}
                              active
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/75"
                              onClick={(e) => {
                                e.stopPropagation();
                                const params = new URLSearchParams(
                                  searchParams
                                );
                                Array.from(params.keys()).forEach((key) => {
                                  if (key !== "type") params.delete(key);
                                });
                                navigate(`?${params.toString()}`, {
                                  replace: true,
                                });
                              }}
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Reset
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-gray-400 transition-all duration-300",
                        open ? "transform rotate-180" : "transform rotate-0",
                        "group-hover:text-gray-600"
                      )}
                    />
                  </div>
                </Disclosure.Button>

                <Transition
                  enter="transition duration-200 ease-out"
                  enterFrom="transform scale-98 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-150 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-98 opacity-0"
                >
                  <Disclosure.Panel className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                      <div className="space-y-2 group">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          <Search className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Search
                        </label>
                        <Input
                          type="text"
                          placeholder="Search by invoice number, description..."
                          value={searchParams.get("search") || ""}
                          onChange={(e) =>
                            updateSearchParam("search", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          <Building2 className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Vendor
                        </label>
                        <Select
                          value={searchParams.get("customerId") || ""}
                          onChange={(value) =>
                            updateSearchParam("customerId", value)
                          }
                          options={[
                            { label: "All Vendors", value: "" },
                            ...(customers?.map((customer) => ({
                              label:
                                customer.contactFirstName ||
                                customer?.companyName,
                              value: customer.id,
                            })) || []),
                          ]}
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          <Building2 className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Company
                        </label>
                        <Select
                          value={searchParams.get("companyId") || ""}
                          onChange={(value) =>
                            updateSearchParam("companyId", value)
                          }
                          options={[
                            { label: "All Companies", value: "" },
                            ...(companies?.map((company) => ({
                              label: company.companyNameEN,
                              value: company.id ?? "",
                            })) || []),
                          ]}
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          <Activity className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Status
                        </label>
                        <Select
                          value={searchParams.get("status") || ""}
                          onChange={(value) =>
                            updateSearchParam("status", value)
                          }
                          options={[
                            { label: "All Statuses", value: "" },
                            { label: "Draft", value: "draft" },
                            { label: "Pending", value: "pending" },
                            { label: "Paid", value: "paid" },
                            { label: "Overdue", value: "overdue" },
                          ]}
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          <CreditCard className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Currency
                        </label>
                        <Select
                          value={searchParams.get("currency") || ""}
                          onChange={(value) =>
                            updateSearchParam("currency", value)
                          }
                          options={[
                            { label: "All Currencies", value: "" },
                            { label: "EUR", value: "EUR" },
                            { label: "USD", value: "USD" },
                            { label: "GBP", value: "GBP" },
                          ]}
                        />
                      </div>

                      <div className="space-y-2 group">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          <CreditCard className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Amount Range
                        </label>
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Min"
                            value={searchParams.get("minAmount") || ""}
                            onChange={(e) =>
                              updateSearchParam("minAmount", e.target.value)
                            }
                          />
                          <span className="text-gray-400">—</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            value={searchParams.get("maxAmount") || ""}
                            onChange={(e) =>
                              updateSearchParam("maxAmount", e.target.value)
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-2 group ml-auto w-full">
                        <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                          <Calendar className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
                          Date Range
                        </label>
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
                          onFromChange={(date) =>
                            updateSearchParam("from", date?.toISOString() || "")
                          }
                          onToChange={(date) =>
                            updateSearchParam("to", date?.toISOString() || "")
                          }
                          className="shadow-sm w-full"
                        />
                      </div>
                    </div>
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Issuer
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
                  <TableHead className="py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Client
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
                    const customer = customers?.find(
                      (c) => c.id === invoice.customerId
                    );
                    const company = companies?.find(
                      (c) => c.id === invoice.companyId
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
                            <div
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center ring-1 transition-colors",
                                "bg-blue-50 text-blue-600 ring-blue-600/20"
                              )}
                            >
                              <span className="text-xs font-medium">
                                {company?.companyNameEN?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div className="flex flex-col max-w-[200px]">
                              <span className="truncate text-gray-900 font-medium">
                                {company?.companyNameEN || 'Unknown Company'}
                              </span>
                              <span className="truncate text-xs text-gray-500 mt-0.5">
                                {company?.vatNumber || 'No VAT'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="text-xs font-mono py-1"
                          >
                            #{invoice.number}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">
                            {new Date(invoice.date).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-900">
                            {new Date(invoice.dueDate).toLocaleDateString()}
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
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-sm font-medium text-gray-900">
                              €{invoice.total.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-900">
                              €{invoice.vatAmount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right whitespace-nowrap">
                          <div className="flex flex-col items-end">
                            <span className="text-sm text-gray-900">
                              €{(invoice.paid || 0).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "h-8 w-8 rounded-full flex items-center justify-center ring-1 transition-colors",
                                "bg-gray-50 text-gray-600 ring-gray-600/20"
                              )}
                            >
                              <span className="text-xs font-medium">
                                {customerInitial}
                              </span>
                            </div>
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
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-rose-500"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(invoice.id!);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
