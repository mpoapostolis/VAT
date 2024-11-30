import React, { useState } from "react";
import { motion } from "framer-motion";
import { Invoice } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { downloadInvoicePdf } from "@/lib/utils/invoice-utils";
import { InvoicePreview } from "./InvoicePreview";
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
} from "@heroicons/react/24/outline";

interface InvoiceCardProps {
  invoice: Invoice;
  layout?: "grid" | "list";
}

export function InvoiceCard({ invoice, layout = "grid" }: InvoiceCardProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const statusConfig = {
    PAID: {
      icon: CheckCircleIcon,
      className:
        "text-green-500 dark:text-green-400 bg-green-50 dark:bg-green-900/20",
    },
    PENDING: {
      icon: ClockIcon,
      className:
        "text-yellow-500 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20",
    },
    OVERDUE: {
      icon: ExclamationCircleIcon,
      className: "text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20",
    },
    PARTIALLY_PAID: {
      icon: CheckCircleIcon,
      className:
        "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    },
  };

  const StatusIcon = statusConfig[invoice.status]?.icon ?? CurrencyDollarIcon;

  const handleDownload = () => {
    downloadInvoicePdf(invoice);
  };

  if (layout === "list") {
    return (
      <>
        <motion.div
          whileHover={{ x: 4 }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <DocumentTextIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {invoice.number}
                    </h3>
                    <div
                      className={`px-2.5 py-0.5 rounded-full ${
                        statusConfig[invoice.status]?.className
                      }`}
                    >
                      <div className="flex items-center space-x-1">
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <BuildingOfficeIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Customer Name
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Due {formatDate(invoice.dueDate)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(invoice.totalIncVat, invoice.currency)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPreviewOpen(true)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <InvoicePreview
          invoice={invoice}
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          onDownload={handleDownload}
        />
      </>
    );
  }

  return (
    <>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                <DocumentTextIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {invoice.number}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  Customer Name
                </p>
              </div>
            </div>
            <div
              className={`px-3 py-1 rounded-full ${
                statusConfig[invoice.status]?.className
              }`}
            >
              <div className="flex items-center space-x-1">
                <StatusIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{invoice.status}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">
                  Due {formatDate(invoice.dueDate)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(invoice.totalIncVat, invoice.currency)}
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(invoice.totalExVat, invoice.currency)}
                </span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-1">
                <span>VAT</span>
                <span>
                  {formatCurrency(invoice.totalVat, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end space-x-2">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <EyeIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
      </motion.div>

      <InvoicePreview
        invoice={invoice}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        onDownload={handleDownload}
      />
    </>
  );
}
