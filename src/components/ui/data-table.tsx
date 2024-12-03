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
    searchParams.get("perPage") || String(pageSize),
    10
  );

  const table = useReactTable({
    data: isLoading ? Array(currentPageSize).fill({}) : data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    pageCount,
  });

  const handleSort = (columnId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (currentSort[0] === columnId) {
      if (currentSort[1] === "asc") {
        newParams.set("sort", `${columnId}:desc`);
      } else if (currentSort[1] === "desc") {
        newParams.delete("sort");
      } else {
        newParams.set("sort", `${columnId}:asc`);
      }
    } else {
      newParams.set("sort", `${columnId}:asc`);
    }
    setSearchParams(newParams);
  };

  const getSortIcon = (columnId: string) => {
    if (currentSort[0] !== columnId) return null;
    return currentSort[1] === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  if (!isLoading && !data.length) {
    return (
      <div className="w-full overflow-auto border border-gray-200 bg-white rounded-lg">
        <TableEmptyState {...emptyState} />
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto border border-gray-200 bg-white rounded-lg">
      <div className="min-w-full inline-block align-middle">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-gray-50">
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className={`${
                        compact ? "h-10" : "h-12"
                      } px-4 sm:px-6 text-left font-medium tracking-wide text-gray-600 text-[13px] uppercase`}
                    >
                      <div
                        className="flex items-center space-x-2 cursor-pointer select-none"
                        onClick={() =>
                          sortable && !isLoading && handleSort(header.id)
                        }
                      >
                        <span className="whitespace-nowrap">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </span>
                        {sortable && (
                          <span className="w-4">{getSortIcon(header.id)}</span>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8">
                    <Loading className="mx-auto" />
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row, index) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="hover:bg-gray-50/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={`${
                          compact ? "h-[48px]" : "h-[60px]"
                        } px-4 sm:px-6 text-sm text-gray-900 whitespace-nowrap`}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="h-14 px-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          <div className="h-full flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", String(currentPage - 1));
                  setSearchParams(newParams);
                }}
                disabled={currentPage === 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("page", String(currentPage + 1));
                  setSearchParams(newParams);
                }}
                disabled={currentPage >= pageCount || isLoading}
              >
                Next
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-600">
                Page {currentPage} of {pageCount}
              </span>
              <select
                className="h-9 border border-gray-200 px-2 text-sm rounded-md bg-white"
                value={currentPageSize}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams);
                  newParams.set("perPage", e.target.value);
                  newParams.set("page", "1");
                  setSearchParams(newParams);
                }}
                disabled={isLoading}
              >
                {[5, 10, 20, 30, 40, 50].map((size) => (
                  <option key={size} value={size}>
                    Show {size}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
