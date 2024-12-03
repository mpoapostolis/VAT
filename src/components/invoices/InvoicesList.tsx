import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { formatCurrency } from "@/lib/utils";
import { DataTable } from "@/components/ui/data-table";
import { ActionDropdown } from "@/components/ui/action-dropdown";
import { createColumnHelper } from "@tanstack/react-table";
import type { Invoice } from "@/lib/pocketbase";
import { motion } from "framer-motion";
import { invoiceService } from "@/lib/services/invoice-service";
import { useMutateData } from "@/lib/hooks/useMutateData";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { useTableParams } from "@/lib/hooks/useTableParams";

const columnHelper = createColumnHelper<Invoice>();

export function InvoicesList() {
  const navigate = useNavigate();
  const tableParams = useTableParams();
  const { data, mutate, isLoading } = useSWR(["invoices", tableParams], () =>
    invoiceService.getList(tableParams)
  );
  const { mutateData } = useMutateData();
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    invoiceId: string | null;
  }>({
    isOpen: false,
    invoiceId: null,
  });

  const handleDelete = async () => {
    if (!deleteModal.invoiceId) return;

    await mutateData(
      mutate,
      () => invoiceService.delete(deleteModal.invoiceId!),
      {
        successMessage: "Invoice deleted successfully",
        errorMessage: "Failed to delete invoice",
      }
    );
    setDeleteModal({ isOpen: false, invoiceId: null });
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
        successMessage: "Invoice downloaded successfully",
        errorMessage: "Failed to download invoice",
      }
    );
  };

  const columns = [
    columnHelper.accessor("number", {
      header: "Invoice Number",
      cell: (info) =>
        info.getValue() ? (
          <Link
            to={`/invoices/${info.row.original.id}`}
            className="font-medium text-[#0066FF] hover:text-blue-700 transition-colors"
          >
            {info.getValue()}
          </Link>
        ) : null,
    }),
    columnHelper.accessor("expand.customerId", {
      header: "Customer",
      cell: (info) => {
        const customer = info.getValue();
        if (!customer) return null;

        return (
          <div className="flex items-center space-x-3">
            <div>
              <Link
                to={`/customers/${customer.id}`}
                className="font-medium text-[#0066FF] hover:text-blue-700 transition-colors"
              >
                {customer.name}
              </Link>
            </div>
          </div>
        );
      },
    }),
    columnHelper.accessor("date", {
      header: "Date",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-gray-600">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ) : null,
    }),
    columnHelper.accessor("dueDate", {
      header: "Due Date",
      cell: (info) =>
        info.getValue() ? (
          <span className="text-gray-600">
            {new Date(info.getValue()).toLocaleDateString()}
          </span>
        ) : null,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue();
        if (!status) return null;

        const statusStyles = {
          paid: "bg-green-50 text-green-700 border border-green-200",
          overdue: "bg-red-50 text-red-700 border border-red-200",
          pending: "bg-yellow-50 text-yellow-700 border border-yellow-200",
          draft: "bg-gray-50 text-gray-700 border border-gray-200",
        };

        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
              statusStyles[status as keyof typeof statusStyles]
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        );
      },
    }),
    columnHelper.accessor("total", {
      header: "Amount",
      cell: (info) =>
        info.getValue() ? (
          <span className="font-medium text-gray-900">
            {formatCurrency(info.getValue())}
          </span>
        ) : null,
    }),
    columnHelper.accessor("id", {
      header: "",
      cell: (info) =>
        info.getValue() ? (
          <div className="flex justify-end">
            <ActionDropdown
              onView={() => navigate(`/invoices/${info.getValue()}`)}
              onDownload={() => handleDownload(info.getValue())}
              onEdit={() => navigate(`/invoices/${info.getValue()}/edit`)}
              onDelete={() =>
                setDeleteModal({ isOpen: true, invoiceId: info.getValue() })
              }
            />
          </div>
        ) : null,
    }),
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <DataTable
          compact
          data={data?.items || []}
          columns={columns}
          pageCount={Math.ceil((data?.totalItems || 0) / tableParams.perPage)}
          pageSize={tableParams.perPage}
          isLoading={isLoading}
          emptyState={{
            title: "No invoices found",
            description:
              "Get started by creating your first invoice to track your business transactions.",
            action: {
              label: "Create Invoice",
              onClick: () => navigate("/invoices/new"),
            },
          }}
        />
      </motion.div>

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, invoiceId: null })}
        onConfirm={handleDelete}
        title="Delete Invoice"
        message="Are you sure you want to delete this invoice? This action cannot be undone."
        confirmLabel="Delete"
        type="danger"
      />
    </>
  );
}
