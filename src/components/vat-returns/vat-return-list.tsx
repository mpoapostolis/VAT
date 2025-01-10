import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatCurrency, cn, formatDate } from "@/lib/utils";
import { useVatReturns } from "@/lib/hooks/useVatReturn";
import {
  Plus,
  FileText,
  Calendar,
  Activity,
  ArrowUpRight,
  Loader2,
  TrendingUp,
  AlertCircle,
  Clock,
  Check,
  Info,
} from "lucide-react";
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
import { AnimatedPage } from "../AnimatedPage";
import { AdvancedFilters } from "../advanced-filters";
import { ActionDropdown } from "../ui/action-dropdown";
import { Tooltip } from "@/components/ui/tooltip";
import { CurrencyPoundIcon } from "@heroicons/react/24/outline";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  trend?: number;
  description?: string;
  status?: "success" | "warning" | "error";
  className?: string;
}

function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  description,
  status,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        // Layout
        "p-4",
        // Visual
        "border border-gray-100 shadow-sm",
        // States
        "transition-all duration-200 hover:shadow-md",
        className
      )}
    >
      <div
        className={cn(
          // Layout
          "flex items-center gap-3"
        )}
      >
        <div
          className={cn(
            // Layout
            "p-2",
            // Visual
            status === "success"
              ? "bg-emerald-50"
              : status === "warning"
              ? "bg-amber-50"
              : status === "error"
              ? "bg-rose-50"
              : "bg-blue-50"
          )}
        >
          <Icon
            className={cn(
              // Layout
              "h-4 w-4",
              // Visual
              status === "success"
                ? "text-emerald-600"
                : status === "warning"
                ? "text-amber-600"
                : status === "error"
                ? "text-rose-600"
                : "text-blue-600"
            )}
          />
        </div>
        <div className="flex-1 space-y-1">
          <p
            className={cn(
              // Typography
              "text-xs text-gray-600"
            )}
          >
            {title}
          </p>
          <p
            className={cn(
              // Typography
              "text-xs font-medium"
            )}
          >
            {value}
          </p>
          {description && (
            <p
              className={cn(
                // Typography
                "text-xs text-gray-500"
              )}
            >
              {description}
            </p>
          )}
          {trend !== undefined && (
            <div
              className={cn(
                // Layout
                "flex items-center gap-1",
                // Spacing
                "mt-1"
              )}
            >
              <ArrowUpRight
                className={cn(
                  // Layout
                  "h-3 w-3",
                  // Visual
                  trend >= 0 ? "text-emerald-500" : "text-rose-500 rotate-90"
                )}
              />
              <span
                className={cn(
                  // Typography
                  "text-xs",
                  // Visual
                  trend >= 0 ? "text-emerald-500" : "text-rose-500"
                )}
              >
                {Math.abs(trend)}%
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export function VatReturnList() {
  const navigate = useNavigate();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useVatReturns({
    pageIndex,
    pageSize,
  });

  const vatReturns = data?.items ?? [];
  const totalItems = data?.total ?? 0;
  const pageCount = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setPageIndex(0); // Reset to first page when changing page size
  };

  const stats = [
    {
      title: "Total VAT Due",
      value: "£24,500.00",
      icon: Activity,
      trend: 12.5,
      description: "Due by January 31st, 2025",
      status: "warning",
    },
    {
      title: "Last Return",
      value: "Q4 2024",
      icon: Calendar,
      description: "Submitted on December 31st, 2024",
      status: "success",
    },
    {
      title: "Next Due",
      value: "20 days",
      icon: Clock,
      description: "Deadline: January 31st, 2025",
      status: "error",
    },
    {
      title: "Year-to-Date VAT",
      value: "£98,750.00",
      icon: TrendingUp,
      trend: 8.3,
      description: "Compared to previous year",
      status: "success",
    },
  ];

  const renderStatus = (status: string) => {
    const statusConfig = {
      SUBMITTED: {
        variant: "success",
        label: "Submitted",
        icon: <Check className="h-3 w-3" />,
        description: "Return has been submitted to HMRC",
      },
      DRAFT: {
        variant: "secondary",
        label: "Draft",
        icon: <FileText className="h-3 w-3" />,
        description: "Return is in draft",
      },
      OVERDUE: {
        variant: "destructive",
        label: "Overdue",
        icon: <AlertCircle className="h-3 w-3" />,
        description: "Return is past due date",
      },
      PENDING: {
        variant: "warning",
        label: "Pending",
        icon: <Clock className="h-3 w-3" />,
        description: "Awaiting submission",
      },
    }[status] || {
      variant: "secondary",
      label: status,
      icon: <FileText className="h-3 w-3" />,
      description: "Status unknown",
    };

    return (
      <div className="flex items-center gap-2">
        <Badge
          variant={statusConfig.variant as any}
          className="flex items-center gap-1.5 px-2 py-1"
        >
          <span
            className={cn(
              statusConfig.variant === "success" && "text-emerald-500",
              statusConfig.variant === "warning" && "text-amber-500",
              statusConfig.variant === "destructive" && "text-rose-500",
              statusConfig.variant === "secondary" && "text-gray-500"
            )}
          >
            {statusConfig.icon}
          </span>
          <span>{statusConfig.label}</span>
        </Badge>
        <Tooltip content={statusConfig.description}>
          <Info className="h-3 w-3 text-gray-400 cursor-help" />
        </Tooltip>
      </div>
    );
  };

  const isOverdue = (dueDate: string) => {
    const dueDateObject = new Date(dueDate);
    const today = new Date();
    return dueDateObject < today;
  };

  return (
    <AnimatedPage>
      <div
        className={cn(
          // Layout
          "space-y-6"
        )}
      >
        <div
          className={cn(
            // Layout
            "flex items-center justify-between"
          )}
        >
          <div>
            <h1
              className={cn(
                // Typography
                "text-xl md:text-2xl font-semibold text-gray-900",
                // Visual
                "tracking-tight"
              )}
            >
              VAT Returns
            </h1>
            <p
              className={cn(
                // Typography
                "text-xs text-gray-500",
                // Spacing
                "mt-1"
              )}
            >
              Manage and submit your VAT returns
            </p>
          </div>
          <div
            className={cn(
              // Layout
              "flex items-center gap-3"
            )}
          >
            {data?.hasOverdue && (
              <div
                className={cn(
                  // Layout
                  "flex items-center gap-2",
                  // Visual
                  "bg-rose-50 px-3 py-1.5"
                )}
              >
                <AlertCircle className="h-4 w-4 text-rose-500" />
                <span className="text-xs text-rose-700">Overdue Returns</span>
              </div>
            )}
            <Button
              size="sm"
              onClick={() => navigate("/vat-return/new")}
              className={cn(
                // Typography
                "text-xs",
                // Layout
                "flex"
              )}
            >
              <Plus className="mr-2 h-4 w-4" />
              New VAT Return
            </Button>
          </div>
        </div>

        <div
          className={cn(
            // Layout
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          )}
        >
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>

        <AdvancedFilters
          filters={["search", "status", "dateRange"]}
          className={cn(
            // Visual
            "bg-white border border-gray-100 shadow-sm",
            // Layout
            "p-4"
          )}
        />

        <Card
          className={cn(
            // Visual
            "border border-gray-100",
            // Layout
            "overflow-hidden"
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className={cn(
                      // Layout
                      "py-8",
                      // Typography
                      "text-center"
                    )}
                  >
                    <div
                      className={cn(
                        // Layout
                        "flex items-center justify-center gap-2"
                      )}
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-xs text-gray-600">
                        Loading VAT returns...
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : vatReturns.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className={cn(
                      // Layout
                      "py-12",
                      // Typography
                      "text-center"
                    )}
                  >
                    <div
                      className={cn(
                        // Layout
                        "flex flex-col items-center gap-2"
                      )}
                    >
                      <FileText className="h-8 w-8 text-gray-400" />
                      <p className="text-xs text-gray-600">
                        No VAT returns found
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate("/vat-return/new")}
                        className="mt-2"
                      >
                        Create your first VAT return
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                vatReturns.map((vatReturn) => (
                  <TableRow
                    key={vatReturn.id}
                    className={cn(
                      // Visual
                      "group hover:bg-gray-50",
                      // States
                      "transition-colors duration-200"
                    )}
                  >
                    <TableCell className="font-medium">
                      {vatReturn.period}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{formatDate(vatReturn.startDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-gray-400" />
                        <span>{formatDate(vatReturn.endDate)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{renderStatus(vatReturn.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CurrencyPoundIcon className="h-3 w-3 text-gray-400" />
                        <span
                          className={cn(
                            vatReturn.vatDue > 0
                              ? "text-rose-600"
                              : "text-emerald-600",
                            "font-medium"
                          )}
                        >
                          {formatCurrency(vatReturn.vatDue)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right">
                      <ActionDropdown
                        onView={() => navigate(`/vat-return/${vatReturn.id}`)}
                        onEdit={() =>
                          navigate(`/vat-return/${vatReturn.id}/edit`)
                        }
                        onDuplicate={() =>
                          navigate(`/vat-return/new?duplicate=${vatReturn.id}`)
                        }
                        onDelete={() => console.log("delete")}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={pageCount}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        </Card>
      </div>
    </AnimatedPage>
  );
}
