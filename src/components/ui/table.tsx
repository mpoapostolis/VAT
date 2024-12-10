import React from "react";
import { cn } from "@/lib/utils";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={cn("bg-slate-50/80 sticky top-0", className)}
    {...props}
  />
));

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));

export const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-slate-200 transition-colors hover:bg-slate-50/50",
      className
    )}
    {...props}
  />
));

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: "asc" | "desc" | false;
  onSort?: () => void;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, children, sortable, sorted, onSort, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-slate-500 border-b border-slate-200",
        sortable && "cursor-pointer select-none hover:text-slate-700",
        className
      )}
      onClick={sortable ? onSort : undefined}
      {...props}
    >
      {sortable ? (
        <div className="flex items-center gap-2">
          <span>{children}</span>
          {sorted === false ? null : sorted === "asc" ? (
            <ArrowUp className="w-4 h-4 text-blue-500" />
          ) : (
            <ArrowDown className="w-4 h-4 text-blue-500" />
          )}
        </div>
      ) : (
        children
      )}
    </th>
  )
);

export const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle text-slate-600", className)}
    {...props}
  />
));

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("bg-slate-50/80 border-t border-slate-200", className)}
    {...props}
  />
));

export const TablePagination = ({
  pageIndex,
  pageSize,
  pageCount,
  onPageChange,
  onPageSizeChange,
}: {
  pageIndex: number;
  pageSize: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) => {
  const startItem = pageIndex * pageSize + 1;
  const endItem = Math.min((pageIndex + 1) * pageSize, pageCount * pageSize);
  const totalItems = pageCount * pageSize;

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <select
            className="h-9 min-w-[70px] rounded-md border border-slate-200 bg-white px-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-sm font-medium text-slate-600">rows per page</span>
        </div>
        <div className="text-sm text-slate-600">
          <span className="font-medium">{startItem}</span>
          <span className="mx-1">-</span>
          <span className="font-medium">{endItem}</span>
          <span className="mx-1">of</span>
          <span className="font-medium">{totalItems}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="h-9 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors"
          onClick={() => onPageChange(pageIndex - 1)}
          disabled={pageIndex === 0}
        >
          Previous
        </button>
        <button
          className="h-9 px-4 rounded-md border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-600 transition-colors"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex === pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};
