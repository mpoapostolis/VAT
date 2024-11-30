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
              setIsEditModalOpen(true);
            }}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <PencilIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => generatePDF(invoice.id)}
            className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader title="Invoices" description="Manage your invoices">
        <div className="flex items-center gap-4">
          <FilterDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={statusOptions}
          />
          <ActionButton
            icon={<PlusIcon className="h-5 w-5" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            New Invoice
          </ActionButton>
        </div>
      </PageHeader>

      <div className="mb-4">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search invoices..."
          className="max-w-lg"
        />
      </div>

      <div className="mt-4 flex flex-col">
        <div className=" ">
          <div className="inline-block min-w-full py-2 align-middle">
            <DataTable
              columns={columns}
              data={filteredInvoices}
              keyField="id"
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => {
          setIsPreviewModalOpen(false);
          setSelectedInvoice(null);
        }}
        title={selectedInvoice ? `Invoice #${selectedInvoice.number}` : ""}
        maxWidth="2xl"
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Invoice #{selectedInvoice.number}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(selectedInvoice.date)}
                </p>
              </div>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  STATUS_CONFIG[selectedInvoice.status].lightBg
                } ${STATUS_CONFIG[selectedInvoice.status].text}`}
              >
                {STATUS_CONFIG[selectedInvoice.status].label}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Customer Details
              </h4>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <p>
                  {customers.find((c) => c.id === selectedInvoice.customerId)
                    ?.name || "Unknown Customer"}
                </p>
                <p>
                  {
                    customers.find((c) => c.id === selectedInvoice.customerId)
                      ?.vatNumber
                  }
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                Invoice Lines
              </h4>
              <div className="space-y-2">
                {selectedInvoice.lines.map((line: any) => (
                  <div key={line.id} className="flex justify-between text-sm">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {line.description}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        {line.quantity} x{" "}
                        {formatCurrency(
                          line.unitPrice,
                          selectedInvoice.currency
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {formatCurrency(
                          line.totalIncVat,
                          selectedInvoice.currency
                        )}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400">
                        VAT:{" "}
                        {formatCurrency(
                          line.vatAmount,
                          selectedInvoice.currency
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">
                  Subtotal
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(
                    selectedInvoice.totalExVat,
                    selectedInvoice.currency
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-300">VAT</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {formatCurrency(
                    selectedInvoice.totalVat,
                    selectedInvoice.currency
                  )}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold mt-2">
                <span className="text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-gray-900 dark:text-gray-100">
                  {formatCurrency(
                    selectedInvoice.totalIncVat,
                    selectedInvoice.currency
                  )}
                </span>
              </div>
            </div>

            {selectedInvoice.notes && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Notes
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {selectedInvoice.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Create Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Invoice"
        maxWidth="5xl"
        className="min-h-[80vh]"
      >
        <InvoiceCreate onClose={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedInvoice(null);
        }}
        title="Edit Invoice"
        maxWidth="4xl"
        className="min-h-[80vh]"
      >
        <InvoiceCreate
          invoice={selectedInvoice}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedInvoice(null);
          }}
        />
      </Modal>
    </div>
  );
}
