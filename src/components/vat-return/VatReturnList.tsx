import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/components/ui/data-table";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { createColumnHelper } from "@tanstack/react-table";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { vatReturnService } from "@/lib/services/vat-return-service";
import useSWR from "swr";
import type { VatReturn } from "@/lib/pocketbase";
import { useMutateData } from "@/lib/hooks/useMutateData";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

const columnHelper = createColumnHelper<VatReturn>();

export function VatReturnList() {
  const navigate = useNavigate();
  const {
    data: vatReturnsData,
    isLoading,
    mutate,
  } = useSWR("vat_returns", () => vatReturnService.getAll());

  console.log(vatReturnsData);
  const { mutateData } = useMutateData();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    vatReturnId: string | null;
  }>({
    isOpen: false,
    vatReturnId: null,
  });

  const handleDelete = async () => {
    if (!deleteModal.vatReturnId) return;

    await mutateData(
      mutate,
      () => vatReturnService.delete(deleteModal.vatReturnId!),
      {
        successMessage: "VAT return deleted successfully",
        errorMessage: "Failed to delete VAT return",
      }
    );
    setDeleteModal({ isOpen: false, vatReturnId: null });
  };

  const handleDownload = async (id: string) => {
    await mutateData(
      mutate,
      async () => {
        // Simulated download - replace with actual download logic
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return true;
      },
      {
        successMessage: "VAT return downloaded successfully",
        errorMessage: "Failed to download VAT return",
      }
    );
  };

  const columns = [
    columnHelper.accessor("period", {
      header: "Period",
      cell: (info) => <span className="font-medium">{info.getValue()}</span>,
    }),

    columnHelper.accessor("salesVat", {
      header: "Sales VAT",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("purchasesVat", {
      header: "Purchases VAT",
      cell: (info) => formatCurrency(info.getValue()),
    }),
    columnHelper.accessor("netVAT", {
      header: "Net VAT",
      cell: (info) => (
        <span className="font-medium">{formatCurrency(info.getValue())}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
            info.getValue() === "draft"
              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
              : "bg-green-50 text-green-800 border border-green-200"
          }`}
        >
          {info.getValue().charAt(0).toUpperCase() + info.getValue().slice(1)}
        </span>
      ),
    }),

    columnHelper.accessor("id", {
      header: "",
      cell: (info) => (
        <div className="flex justify-end">
          <ActionDropdown
            onView={() => navigate(`/vat-return/${info.getValue()}`)}
            onDownload={() => handleDownload(info.getValue())}
            onEdit={() => navigate(`/vat-return/${info.getValue()}/edit`)}
            onDelete={() =>
              setDeleteModal({ isOpen: true, vatReturnId: info.getValue() })
            }
          />
        </div>
      ),
    }),
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DataTable
          data={vatReturnsData || []}
          columns={columns}
          pageSize={10}
          emptyState={{
            title: "No VAT returns found",
            description: "Get started by preparing your first VAT return.",
            action: {
              label: "Prepare VAT Return",
              onClick: () => navigate("/vat-return/new"),
            },
          }}
        />
      </motion.div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, vatReturnId: null })}
        onConfirm={handleDelete}
        title="Delete VAT Return"
        message="Are you sure you want to delete this VAT return? This action cannot be undone."
        confirmLabel="Delete"
        type="danger"
      />
    </>
  );
}
