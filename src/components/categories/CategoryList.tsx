import { Link } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import { FolderOpen, Plus } from "lucide-react";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCategories } from "@/lib/hooks/useCategories";
import { Badge } from "../ui/badge";

export function CategoryList() {
  const { categories: data, isLoading, ...rest } = useCategories();

  const tableParams = useTableParams();

  const handleSort = (field: string) => {
    const currentSort = tableParams.sort;
    if (currentSort === field) {
      tableParams.setSort(`-${field}`);
    } else if (currentSort === `-${field}`) {
      tableParams.setSort("");
    } else {
      tableParams.setSort(field);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 tracking-tight">
            Categories
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your invoice categories
          </p>
        </div>
        <Link
          to="/categories/new"
          className={cn(
            "inline-flex items-center justify-center gap-2",
            "px-4 py-2.5 w-full sm:w-auto",
            "text-xs font-medium text-white",
            "bg-blue-600 hover:bg-blue-700",
            "shadow-sm",
            "transition-all duration-200",
            "rounded",
            "focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          )}
        >
          <Plus className="w-4 h-4" />
          New Category
        </Link>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block overflow-hidden bg-white rounded border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "name"
                    ? "asc"
                    : tableParams.sort === "-name"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("name")}
                className="font-medium text-gray-700"
              >
                Category
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "type"
                    ? "asc"
                    : tableParams.sort === "-type"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("type")}
                className="font-medium text-gray-700"
              >
                Type
              </TableHead>

              <TableHead className="font-medium text-gray-700">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex items-center justify-center text-xs text-gray-500">
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading categories...
                  </div>
                </TableCell>
              </TableRow>
            ) : data?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="text-xs text-gray-500">
                    No categories found
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data?.map((category) => (
                <TableRow
                  key={category.id}
                  className="hover:bg-gray-50/50 transition-colors duration-200"
                >
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-blue-600/5 blur-sm rounded"></div>
                        <div className="relative p-2 rounded bg-gradient-to-br from-gray-50 to-white shadow-sm">
                          <FolderOpen className="w-4 h-4 text-blue-600" />
                        </div>
                      </div>
                      <div>
                        <Link
                          to={`/categories/${category.id}/edit`}
                          className="font-medium text-xs text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                        <div className="text-xs text-gray-500">
                          {category.description || "-"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        "capitalize text-xs font-medium px-2.5 py-0 border-0",
                        category.type === "income"
                          ? "bg-green-50 text-green-700 ring-1 ring-emerald-600/20"
                          : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                      )}
                    >
                      {category.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3">
                    <div className="flex items-center gap-2">
                      <button
                        aria-label={`Delete ${category.name}`}
                        className={cn(
                          // Layout
                          "p-2",
                          "relative",
                          // Visual
                          "rounded",
                          // Typography
                          "text-gray-500",
                          // States
                          "hover:text-red-600 hover:bg-gray-50",
                          "focus:outline-none focus:ring-2 focus:ring-red-600/20",
                          "disabled:opacity-50 disabled:cursor-not-allowed",
                          "transition-all duration-200"
                        )}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
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

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {isLoading ? (
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="flex items-center justify-center text-xs text-gray-500">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading categories...
            </div>
          </div>
        ) : data?.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded p-4">
            <div className="text-xs text-gray-500 text-center">
              No categories found
            </div>
          </div>
        ) : (
          data?.map((category) => (
            <div
              key={category.id}
              className="bg-white border border-gray-200 rounded p-4 space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded bg-gray-50/50 flex-shrink-0">
                  <FolderOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/categories/${category.id}/edit`}
                    className="block text-xs font-medium text-gray-900 hover:text-blue-600 transition-colors truncate"
                  >
                    {category.name}
                  </Link>
                  <div className="text-xs text-gray-500 truncate mt-0.5">
                    {category.description || "-"}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "capitalize text-xs font-medium px-2.5 py-1 border-0",
                    category.type === "expense"
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20"
                      : "bg-red-50 text-red-700 ring-1 ring-red-600/20"
                  )}
                >
                  {category.type}
                </Badge>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200">
                <button
                  aria-label={`Delete ${category.name}`}
                  className={cn(
                    // Layout
                    "p-2",
                    "relative",
                    // Visual
                    "rounded",
                    // Typography
                    "text-gray-500",
                    // States
                    "hover:text-red-600 hover:bg-gray-50",
                    "focus:outline-none focus:ring-2 focus:ring-red-600/20",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    "transition-all duration-200"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
        <div className="bg-white border border-gray-200 rounded overflow-hidden">
          <TablePagination
            pageIndex={Number(tableParams.page) - 1}
            pageSize={tableParams.perPage}
            totalItems={rest?.totalItems}
            pageCount={rest?.totalPages}
            onPageChange={(page) => tableParams.setPage(page + 1)}
            onPageSizeChange={(size) => tableParams.setPerPage(size)}
          />
        </div>
      </div>
    </div>
  );
}
