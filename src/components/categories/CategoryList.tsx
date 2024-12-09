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
  const { data, mutate, isLoading } = useSWR(["categories", tableParams], () =>
    categoryService.getListWithStats()
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
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded ${
              info.row.original.type === "income" ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <FolderOpen
              className={`h-4 w-4 ${
                info.row.original.type === "income"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            />
          </div>
          <div>
            <Link
              to={`/categories/${info.row.original.id}/view`}
              className="font-medium text-gray-900 hover:text-[#0066FF] transition-colors"
            >
              {info.getValue()}
            </Link>
            <div className="text-sm text-gray-500">
              {info.row.original.description}
            </div>
          </div>
        </div>
      ),
    }),
    columnHelper.accessor("type", {
      header: "Type",
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${
            info.getValue() === "income"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {info.getValue().toUpperCase()}
        </span>
      ),
    }),
    columnHelper.accessor("invoiceCount", {
      header: "Invoices",
      cell: (info) => (
        <div className="font-medium text-gray-900">
          {info.getValue()} {info.getValue() === 1 ? "invoice" : "invoices"}
        </div>
      ),
    }),
    columnHelper.accessor("totalAmount", {
      header: "Total Amount",
      cell: (info) => (
        <div
          className={`font-medium ${
            info.row.original.type === "income"
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {formatCurrency(info.getValue())}
        </div>
      ),
    }),
    columnHelper.accessor("created", {
      header: "Created",
      cell: (info) => (
        <div className="text-gray-500">{formatDate(info.getValue())}</div>
      ),
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (info) => (
        <div className="flex justify-end">
          <ActionDropdown
            onView={() => navigate(`/categories/${info.getValue()}`)}
            onEdit={() => navigate(`/categories/${info.getValue()}/edit`)}
            onDelete={() =>
              setDeleteModal({ isOpen: true, categoryId: info.getValue() })
            }
          />
        </div>
      ),
    }),
  ];

  return (
    <>
      <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded">
        <DataTable
          data={data?.items || []}
          columns={columns}
          pageCount={Math.ceil((data?.totalItems || 0) / tableParams.perPage)}
          pageSize={tableParams.perPage}
          isLoading={isLoading}
          emptyState={{
            title: "No categories found",
            description:
              "Get started by creating your first transaction category.",
            action: {
              label: "Create Category",
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
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmLabel="Delete"
        type="danger"
      />
    </>
  );
}
