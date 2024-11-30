import React, { useState } from "react";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useJotaiStore } from "@/lib/hooks/useJotaiStore";
import { PlusIcon } from "@heroicons/react/24/outline";
import { InvoiceForm } from "./InvoiceForm";
import { LoadingSpinner } from "../ui/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DocumentTextIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  BuildingOfficeIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Modal } from "../ui/Modal";
import { toast } from "react-hot-toast";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const STATUS_CONFIG = {
  PAID: {
    label: "Paid",
    icon: CheckCircleIcon,
    color: "from-green-500 to-green-600",
    lightBg: "bg-green-50 dark:bg-green-900/20",
    text: "text-green-700 dark:text-green-300",
  },
  PENDING: {
    label: "Pending",
    icon: ClockIcon,
    color: "from-yellow-500 to-yellow-600",
    lightBg: "bg-yellow-50 dark:bg-yellow-900/20",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  OVERDUE: {
    label: "Overdue",
    icon: ExclamationCircleIcon,
    color: "from-red-500 to-red-600",
    lightBg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-300",
  },
  PARTIALLY_PAID: {
    label: "Partially Paid",
    icon: CheckCircleIcon,
    color: "from-blue-500 to-blue-600",
    lightBg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-300",
  },
};

export function InvoiceList() {
  const { invoices, customers } = useJotaiStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  if (!invoices) {
    return <LoadingSpinner />;
  }

  const generatePDF = async (invoice: any) => {
    try {
      const customer = customers.find((c) => c.id === invoice.customerId);
      const doc = new jsPDF();

      // Add invoice header
      doc.setFontSize(20);
      doc.text("INVOICE", 105, 20, { align: "center" });

      doc.setFontSize(12);
      doc.text(`Invoice #: ${invoice.number}`, 20, 40);
      doc.text(`Date: ${formatDate(invoice.date)}`, 20, 50);
      doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, 20, 60);

      // Add customer details
      doc.text("Bill To:", 20, 80);
      doc.text(customer?.name || "Unknown Customer", 20, 90);
      doc.text(customer?.vatNumber || "", 20, 100);

      // Add invoice items
      const tableData = invoice.lines.map((line: any) => [
        line.description,
        line.quantity,
        formatCurrency(line.unitPrice, invoice.currency),
        formatCurrency(line.totalIncVat, invoice.currency),
      ]);

      doc.autoTable({
        startY: 120,
        head: [["Description", "Quantity", "Unit Price", "Total"]],
        body: tableData,
      });

      // Add totals
      const finalY = (doc as any).lastAutoTable.finalY + 20;
      doc.text(
        `Subtotal: ${formatCurrency(invoice.totalExVat, invoice.currency)}`,
        140,
        finalY
      );
      doc.text(
        `VAT: ${formatCurrency(invoice.totalVat, invoice.currency)}`,
        140,
        finalY + 10
      );
      doc.text(
        `Total: ${formatCurrency(invoice.totalIncVat, invoice.currency)}`,
        140,
        finalY + 20
      );

      // Save PDF
      doc.save(`invoice-${invoice.number}.pdf`);
      toast.success("Invoice downloaded successfully");
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("Failed to generate PDF");
    }
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customerId);
    return (
      !searchTerm ||
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 p-6"
    >
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-2xl font-semibold text-gray-900 dark:text-white"
        >
          Invoices
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setIsNewInvoiceModalOpen(true);
            setCurrentStep(0);
          }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Invoice
        </motion.button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="grid gap-4"
        >
          {/* Search */}
          <div className="max-w-lg">
            <input
              type="text"
              placeholder="Search invoices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block px-4 py-2 w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-800 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>

          {/* Invoice Table */}
          <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
            <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <div className="bg-gray-50 dark:bg-gray-900">
                <div className="grid grid-cols-6 gap-4 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <div className="col-span-2">Invoice Details</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Amount</div>
                  <div>Actions</div>
                </div>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {filteredInvoices.map((invoice) => {
                    const statusConfig = STATUS_CONFIG[invoice.status];
                    const customer = customers.find(
                      (c) => c.id === invoice.customerId
                    );

                    return (
                      <motion.div
                        key={invoice.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-6 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <div className="col-span-2">
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
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(invoice.date)}
                        </div>
                        <div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.lightBg} ${statusConfig.text}`}
                          >
                            {statusConfig.label}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {formatCurrency(
                            invoice.totalIncVat,
                            invoice.currency
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsPreviewModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            <EyeIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => generatePDF(invoice)}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            <ArrowDownTrayIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedInvoice(invoice);
                              setIsEditModalOpen(true);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

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
        <AnimatePresence mode="wait">
          {selectedInvoice && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-6"
            >
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
                  <span className="text-gray-900 dark:text-gray-100">
                    Total
                  </span>
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
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>

      {/* Edit/New Invoice Modal */}
      <Modal
        isOpen={isEditModalOpen || isNewInvoiceModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setIsNewInvoiceModalOpen(false);
          setSelectedInvoice(null);
          setCurrentStep(0);
        }}
        title={
          isNewInvoiceModalOpen
            ? `New Invoice - Step ${currentStep + 1} of 3`
            : `Edit Invoice #${selectedInvoice?.number} - Step ${
                currentStep + 1
              } of 3`
        }
        maxWidth="3xl"
      >
        <div className="p-6">
          <InvoiceForm
            currentStep={currentStep}
            onStepChange={(step) => setCurrentStep(step)}
            onSubmit={async (data) => {
              try {
                if (isNewInvoiceModalOpen) {
                  // Handle new invoice creation
                  const newInvoice = {
                    ...data,
                    id: Math.random().toString(36).substr(2, 9),
                    number: `INV-${Date.now()}`,
                    status: "PENDING",
                    currency: "EUR",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  toast.success("Invoice created successfully");
                } else {
                  // Handle invoice update
                  const updatedInvoice = {
                    ...selectedInvoice,
                    ...data,
                    updatedAt: new Date().toISOString(),
                  };
                  toast.success("Invoice updated successfully");
                }

                // Close modal and reset state
                setIsEditModalOpen(false);
                setIsNewInvoiceModalOpen(false);
                setSelectedInvoice(null);
                setCurrentStep(0);
              } catch (error) {
                console.error("Error saving invoice:", error);
                toast.error("Failed to save invoice");
              }
            }}
            initialData={
              isNewInvoiceModalOpen
                ? {
                    date: new Date(),
                    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    lines: [
                      {
                        description: "",
                        quantity: 1,
                        unitPrice: 0,
                        vatRate: 20,
                        totalExVat: 0,
                        vatAmount: 0,
                        totalIncVat: 0,
                      },
                    ],
                    currency: "EUR",
                    status: "PENDING",
                  }
                : selectedInvoice
            }
          />
        </div>
      </Modal>
    </motion.div>
  );
}
