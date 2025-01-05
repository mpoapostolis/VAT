import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "./button";
import { motion } from "framer-motion";
import { TableEmptyState } from "./table-empty-state";
import { Loading } from "./loading";
import { FileX } from "lucide-react";

interface DataTableProps<T> {
  data: T[];
  columns: any[];
  pageCount: number;
  pageSize?: number;
  isLoading?: boolean;
  compact?: boolean;
  sortable?: boolean;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

export function DataTable<T>({
  data,
  columns,
  sortable = true,
  pageCount,
  pageSize = 10,
  isLoading = false,
  compact = false,
  emptyState = {
    title: "No results found",
    description: "No records match your search criteria.",
  },
}: DataTableProps<T>) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSort = searchParams.get("sort")?.split(":") || [];

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const currentPageSize = parseInt(
    searchParams.get("pageSize") || pageSize.toString(),
    10
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: pageCount,
    state: {
      pagination: {
        pageIndex: currentPage - 1,
        pageSize: currentPageSize,
      },
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="py-12">
      {!data.length && !isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-[#F8FAFC] flex items-center justify-center">
            <FileX className="w-8 h-8 text-[#94A3B8]" />
          </div>
          <h3 className="text-xs font-medium text-[#0F172A] mb-1">
            No results found
          </h3>
          <p className="text-xs text-[#64748B] mb-6 text-center max-w-sm">
            No records match your search criteria.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <th
                          key={header.id}
                          scope="col"
                          className="px-6 py-4 text-left text-xs font-medium text-[#64748B] bg-[#F8FAFC] border-b border-black/10"
                        >
                          {header.column.columnDef.header}
                        </th>
                      ))}
                    </tr>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-black/10">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#F8FAFC] transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 text-xs whitespace-nowrap"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pageCount > 1 && (
            <div className="flex items-center justify-between gap-2 border-t border-black/10 px-6 py-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newPage = Math.max(1, currentPage - 1);
                    setSearchParams({
                      ...searchParams,
                      page: newPage.toString(),
                    });
                  }}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newPage = Math.min(pageCount, currentPage + 1);
                    setSearchParams({
                      ...searchParams,
                      page: newPage.toString(),
                    });
                  }}
                  disabled={currentPage === pageCount}
                >
                  Next
                </Button>
              </div>
              <div className="text-xs text-[#64748B]">
                Page {currentPage} of {pageCount}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
