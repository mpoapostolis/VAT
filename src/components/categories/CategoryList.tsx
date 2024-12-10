import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { DataTable } from "@/components/ui/data-table";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { createColumnHelper } from "@tanstack/react-table";
import { FolderOpen } from "lucide-react";
import { categoryService } from "@/lib/services/category-service";
import { useMutateData } from "@/lib/hooks/useMutateData";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useTableParams } from "@/lib/hooks/useTableParams";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Category } from "@/lib/pocketbase";

const columnHelper = createColumnHelper<
  Category & { invoiceCount: number; totalAmount: number }
>();

export function CategoryList() {
  const navigate = useNavigate();
  const tableParams = useTableParams();
  const { data, mutate, isLoading } = useSWR(
    ["categories"],
    () => categoryService.getListWithStats()
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

  const columns = [
    columnHelper.accessor("name", {
      header: "Category",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#F1F5F9]">
            <FolderOpen className="w-5 h-5 text-[#3B82F6]" />
          </div>
          <div>
            <Link
              to={`/categories/${info.row.original.id}`}
              className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
            >
              {info.getValue()}
            </Link>
            <div className="text-sm text-[#64748B]">
              {info.row.original.description || "No description"}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
            info.getValue() === "income"
              ? "bg-[#DCFCE7] text-[#10B981]"
              : "bg-[#FEE2E2] text-[#EF4444]"
          }`}
        >
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("invoiceCount", {
      header: "Invoices",
      cell: (info) => (
        <div className="font-medium text-[#0F172A]">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("totalAmount", {
      header: "Total Amount",
      cell: (info) => (
        <div className="font-medium text-[#0F172A]">
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      cell: (info) => (
        <ActionDropdown
          items={[
            {
              label: "View",
              onClick: () => navigate(`/categories/${info.getValue()}`),
            },
            {
              label: "Edit",
              onClick: () => navigate(`/categories/${info.getValue()}/edit`),
            },
            {
              label: "Delete",
              onClick: () =>
                setDeleteModal({ isOpen: true, categoryId: info.getValue() }),
              variant: "danger",
            },
          ]}
        />
      ),
    }),
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
            Categories
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage your income and expense categories
          </p>
        </div>
        <Link
          to="/categories/new"
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors"
        >
          New Category
        </Link>
      </div>

      <div className="bg-white border border-black/10 rounded-lg">
        <DataTable
          columns={columns}
          data={data?.items || []}
          isLoading={isLoading}
          pageCount={data?.totalPages || 1}
          emptyState={{
            title: "No categories found",
            description: "Get started by creating a new category.",
            action: {
              label: "New Category",
              onClick: () => navigate("/categories/new"),
            },
          }}
        />
      </div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, categoryId: null })}
        onConfirm={handleDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
