import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { Invoice } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';

interface InvoicePreviewProps {
  invoice: Invoice;
  isOpen: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function InvoicePreview({ invoice, isOpen, onClose, onDownload }: InvoicePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={onClose}
            />

            <span className="inline-block h-screen align-middle">&#8203;</span>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="inline-block w-full max-w-4xl p-6 my-8 text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all relative"
            >
              {/* Header Actions */}
              <div className="absolute right-4 top-4 flex items-center space-x-2">
                <button
                  onClick={onDownload}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 dark:text-gray-400"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 dark:text-gray-400"
                >
                  <PrinterIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-500 dark:text-gray-400"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Invoice Content */}
              <div className="mt-8 space-y-8" id="invoice-preview">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Invoice</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{invoice.number}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Date Issued</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(invoice.date)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Due Date</div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bill To</h3>
                    <div className="text-gray-900 dark:text-gray-100">
                      <div className="font-medium">Customer Name</div>
                      <div>123 Street Name</div>
                      <div>City, Country</div>
                      <div>VAT: {invoice.customerId}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Details</h3>
                    <div className="text-gray-900 dark:text-gray-100">
                      <div>Bank: Your Bank Name</div>
                      <div>IBAN: XX00 0000 0000 0000</div>
                      <div>SWIFT: XXXXX</div>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="mt-8">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Description</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Quantity</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Unit Price</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">VAT Rate</th>
                        <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoice.lines.map((line, index) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="py-4 text-gray-900 dark:text-gray-100">{line.description}</td>
                          <td className="py-4 text-right text-gray-900 dark:text-gray-100">{line.quantity}</td>
                          <td className="py-4 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(line.unitPrice, invoice.currency)}
                          </td>
                          <td className="py-4 text-right text-gray-900 dark:text-gray-100">{line.vatRate}%</td>
                          <td className="py-4 text-right text-gray-900 dark:text-gray-100">
                            {formatCurrency(line.totalIncVat, invoice.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="mt-8">
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formatCurrency(invoice.totalExVat, invoice.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">VAT</span>
                      <span className="text-gray-900 dark:text-gray-100">
                        {formatCurrency(invoice.totalVat, invoice.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-900 dark:text-gray-100">Total</span>
                      <span className="text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(invoice.totalIncVat, invoice.currency)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {invoice.notes && (
                  <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Notes</h3>
                    <p className="text-gray-900 dark:text-gray-100">{invoice.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}