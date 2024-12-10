import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from "@/components/ui/table";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { FolderOpen, Plus } from "lucide-react";
import { categoryService } from "@/lib/services/category-service";
import { useMutateData } from "@/lib/hooks/useMutateData";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { formatCurrency } from "@/lib/utils";
import type { Category } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { useTableParams, buildPocketBaseParams } from "@/lib/hooks/useTableParams";

export function CategoryList() {
  const navigate = useNavigate();
  const tableParams = useTableParams();
  const { data, mutate, isLoading } = useSWR(
    ["categories", tableParams.page, tableParams.perPage, tableParams.sort],
    () => categoryService.getListWithStats(buildPocketBaseParams(tableParams))
  );
  const { mutateData } = useMutateData();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    categoryId: string | null;
  }>({
    isOpen: false,
    categoryId: null,
  });

  const handleDelete = async () => {
    if (!deleteModal.categoryId) return;

    await mutateData(
      mutate,
      () => categoryService.delete(deleteModal.categoryId!),
      {
        successMessage: "Category deleted successfully",
        errorMessage: "Failed to delete category",
      }
    );
    setDeleteModal({ isOpen: false, categoryId: null });
  };

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
            Categories
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your invoice categories
          </p>
        </div>
        <Button onClick={() => navigate("/categories/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          New Category
        </Button>
      </div>

      <div className="bg-white border border-black/10 rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
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
              >
                Type
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "invoiceCount"
                    ? "asc"
                    : tableParams.sort === "-invoiceCount"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("invoiceCount")}
              >
                Invoices
              </TableHead>
              <TableHead
                sortable
                sorted={
                  tableParams.sort === "totalAmount"
                    ? "asc"
                    : tableParams.sort === "-totalAmount"
                    ? "desc"
                    : false
                }
                onSort={() => handleSort("totalAmount")}
              >
                Total Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items?.map((category) => (
              <TableRow key={category.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#F1F5F9]">
                      <FolderOpen className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <Link
                        to={`/categories/${category.id}/view`}
                        className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
                      >
                        {category.name}
                      </Link>
                      <div className="text-sm text-[#64748B]">
                        {category.description || "No description"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                      category.type === "income"
                        ? "bg-[#DCFCE7] text-[#10B981]"
                        : "bg-[#FEE2E2] text-[#EF4444]"
                    }`}
                  >
                    {category.type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-[#0F172A]">
                    {category.invoiceCount}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-[#0F172A]">
                    {formatCurrency(category.totalAmount)}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          pageIndex={data?.page ? data.page - 1 : 0}
          pageSize={tableParams.perPage}
          pageCount={data?.totalPages || 1}
          onPageChange={(page) => tableParams.setPage(page + 1)}
          onPageSizeChange={tableParams.setPerPage}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}
