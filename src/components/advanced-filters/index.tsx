import { cn } from "@/lib/utils";
import {
  Search,
  RotateCcw,
  ChevronDown,
  Building2,
  Calendar,
  CreditCard,
  Activity,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Disclosure, Transition } from "@headlessui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useCompanies } from "@/lib/hooks/useCompanies";
import React from "react";

type FilterName =
  | "search"
  | "vendor"
  | "company"
  | "status"
  | "currency"
  | "amountRange"
  | "empty"
  | "customer"
  | "dateRange"
  | "paymentTerms"
  | "type"
  | "category";

interface AdvancedFiltersProps {
  filters?: FilterName[];
}

export function AdvancedFilters({ filters }: AdvancedFiltersProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { customers: vendors } = useCustomers({
    perPage: 500,
    filter: `relationship = 'Vendor'`,
  });
  const { customers } = useCustomers({
    perPage: 500,
    filter: `relationship = 'Client'`,
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
    params.set("page", "1");
    navigate(`?${params.toString()}`, { replace: true });
  };

  const renderFilter = (name: FilterName) => {
    switch (name) {
      case "search":
        return (
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              <Search className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by invoice number, description..."
              value={searchParams.get("search") || ""}
              onChange={(e) => updateSearchParam("search", e.target.value)}
            />
          </div>
        );

      case "vendor":
        return (
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              <Building2 className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Vendor
            </label>
            <Select
              value={searchParams.get("customerId") || ""}
              onChange={(value) => updateSearchParam("customerId", value)}
              options={[
                { label: "All Vendors", value: "" },
                ...(vendors?.map((customer) => ({
                  label: customer.contactFirstName || customer?.companyName,
                  value: customer.id,
                })) || []),
              ]}
            />
          </div>
        );

      case "customer":
        return (
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              <Building2 className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Customer
            </label>
            <Select
              value={searchParams.get("customerId") || ""}
              onChange={(value) => updateSearchParam("customerId", value)}
              options={[
                { label: "All Customers", value: "" },
                ...(customers?.map((customer) => ({
                  label: customer.contactFirstName ?? "",
                  value: customer.id,
                })) || []),
              ]}
            />
          </div>
        );

      case "company":
        return (
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              <Building2 className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Company
            </label>
            <Select
              value={searchParams.get("companyId") || ""}
              onChange={(value) => updateSearchParam("companyId", value)}
              options={[
                { label: "All Companies", value: "" },
                ...(companies?.map((company) => ({
                  label: company.companyNameEN,
                  value: company.id ?? "",
                })) || []),
              ]}
            />
          </div>
        );

      case "status":
        return (
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              <Activity className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Status
            </label>
            <Select
              value={searchParams.get("status") || ""}
              onChange={(value) => updateSearchParam("status", value)}
              options={[
                { label: "All Statuses", value: "" },
                { label: "Draft", value: "draft" },
                { label: "Pending", value: "pending" },
                { label: "Paid", value: "paid" },
                { label: "Overdue", value: "overdue" },
              ]}
            />
          </div>
        );

      case "currency":
        return (
          <div className="space-y-2 group">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              <CreditCard className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Currency
            </label>
            <Select
              value={searchParams.get("currency") || ""}
              onChange={(value) => updateSearchParam("currency", value)}
              options={[
                { label: "All Currencies", value: "" },
                { label: "EUR", value: "EUR" },
                { label: "USD", value: "USD" },
                { label: "GBP", value: "GBP" },
              ]}
            />
          </div>
        );

      case "amountRange":
        return (
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
                onChange={(e) => updateSearchParam("minAmount", e.target.value)}
              />
              <span className="text-gray-400">—</span>
              <Input
                type="number"
                placeholder="Max"
                value={searchParams.get("maxAmount") || ""}
                onChange={(e) => updateSearchParam("maxAmount", e.target.value)}
              />
            </div>
          </div>
        );

      case "empty":
        return <div />;

      case "dateRange":
        return (
          <div className="space-y-2 group ml-auto w-full">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
              <Calendar className="h-4 w-4 text-gray-400 group-hover:text-gray-500" />
              Date Range
            </label>
            <DateRangePicker
              side={
                filters?.length === 2 || filters?.length === 6
                  ? "left"
                  : "right"
              }
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
        );
    }
  };

  return (
    <Card className="p-6 bg-white transition-all duration-300 border border-gray-200/50 bg-white/50">
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
                  <div className="flex items-center gap-1.5">
                    {Object.keys(Object.fromEntries([...searchParams])).length >
                      1 && (
                      <>
                        <Badge
                          variant="outline"
                          className="bg-blue-50/50 border-blue-200/50 text-blue-700 hover:bg-blue-100/50 transition-colors"
                        >
                          {Object.keys(Object.fromEntries([...searchParams]))
                            .length - 1}{" "}
                          active
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-5 flex items-center px-2 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-100/75"
                          onClick={(e) => {
                            e.stopPropagation();
                            const params = new URLSearchParams(searchParams);
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
                  {filters?.map((filter) => (
                    <React.Fragment key={filter}>
                      {renderFilter(filter)}
                    </React.Fragment>
                  ))}
                </div>
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </Card>
  );
}
