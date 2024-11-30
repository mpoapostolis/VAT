import React, { useState } from "react";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { Invoice } from "@/types";
import {
  PlusIcon,
  DocumentTextIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import { InvoiceForm } from "./InvoiceForm";
import { Modal } from "../ui/Modal";
import { formatDate, formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { PageHeader } from "../ui/PageHeader";
import { SearchInput } from "../ui/SearchInput";
import { FilterDropdown } from "../ui/FilterDropdown";
import { DataTable } from "../ui/DataTable";
import { ActionButton } from "../ui/ActionButton";
import { InvoiceCreate } from "./InvoiceCreate";
import { InvoicePreview } from "./InvoicePreview";

const STATUS_CONFIG = {
  DRAFT: {
    label: "Draft",
    color: "from-yellow-500 to-yellow-600",
    lightBg:
      "bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/30",
    text: "text-yellow-700 dark:text-yellow-300",
    icon: <DocumentTextIcon className="h-4 w-4" />,
  },
  PENDING: {
    label: "Pending",
    color: "from-blue-500 to-blue-600",
    lightBg:
      "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/30",
    text: "text-blue-700 dark:text-blue-300",
    icon: <ClockIcon className="h-4 w-4" />,
  },
  PAID: {
    label: "Paid",
    color: "from-green-500 to-green-600",
    lightBg:
      "bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/30",
    text: "text-green-700 dark:text-green-300",
    icon: <CheckCircleIcon className="h-4 w-4" />,
  },
  OVERDUE: {
    label: "Overdue",
    color: "from-red-500 to-red-600",
    lightBg:
      "bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/30",
    text: "text-red-700 dark:text-red-300",
    icon: <ExclamationCircleIcon className="h-4 w-4" />,
  },
};

export function InvoiceList() {
  const { invoices, generatePDF, isLoading } = useInvoices();
  const { customers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  if (!invoices || !customers) {
    return <LoadingSpinner />;
  }

  const filteredInvoices = invoices.filter(
    (invoice) =>
      (statusFilter === "all" || invoice.status === statusFilter) &&
      (searchTerm === "" ||
        invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customers
          .find((c) => c.id === invoice.customerId)
          ?.name.toLowerCase()
          .includes(searchTerm.toLowerCase()))
  );

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "DRAFT", label: "Draft" },
    { value: "PENDING", label: "Pending" },
    { value: "PAID", label: "Paid" },
    { value: "OVERDUE", label: "Overdue" },
  ];

  const columns = [
    {
      key: "number",
      title: "Invoice",
      render: (_, invoice: Invoice) => {
        const statusConfig = STATUS_CONFIG[invoice.status];
        const customer = customers.find((c) => c.id === invoice.customerId);

        return (
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${statusConfig.color}`}
              >
                <DocumentTextIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {invoice.number}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {customer?.name || "Unknown Customer"}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "date",
      title: "Date",
      render: (date: string) => formatDate(date),
    },
    {
      key: "status",
      title: "Status",
      render: (_, invoice: Invoice) => {
        const statusConfig = STATUS_CONFIG[invoice.status];
        return (
          <span
            className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.lightBg} ${statusConfig.text} shadow-sm`}
          >
            <span className="flex items-center justify-center">
              {statusConfig.icon}
            </span>
            {statusConfig.label}
          </span>
        );
      },
    },
    {
      key: "totalIncVat",
      title: "Amount",
      render: (total: number, invoice: Invoice) =>
        formatCurrency(total, invoice.currency),
    },
    {
      key: "actions",
      title: "Actions",
      render: (_, invoice: Invoice) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedInvoice(invoice);
              setIsPreviewModalOpen(true);
            }}
            className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
          >
            <EyeIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setSelectedInvoice(invoice);
              setIsEditModalOpen(true);
            }}
            className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => generatePDF(invoice.id)}
            className="p-2 text-gray-400 hover:text-violet-600 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white bg-gradient-to-br from-violet-600 to-violet-700 bg-clip-text text-transparent">
          Invoices
        </h1>
        <ActionButton
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 shadow-sm transition-all duration-200 hover:shadow-md"
        >
          New Invoice
        </ActionButton>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search invoices..."
            className="w-full"
          />
        </div>
        <FilterDropdown
          value={statusFilter}
          onChange={setStatusFilter}
          options={statusOptions}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={filteredInvoices}
            keyField="id"
            isLoading={isLoading}
            className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
          />
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        maxWidth="5xl"
      >
        <InvoicePreview
          invoice={selectedInvoice!}
          onClose={() => setIsPreviewModalOpen(false)}
          onDownload={() => {
            if (selectedInvoice) {
              generatePDF(selectedInvoice.id);
            }
          }}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        maxWidth="5xl"
      >
        <InvoiceCreate
          invoice={selectedInvoice}
          onClose={() => setIsEditModalOpen(false)}
        />
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        maxWidth="5xl"
      >
        <InvoiceCreate onClose={() => setIsCreateModalOpen(false)} />
      </Modal>
    </div>
  );
}
