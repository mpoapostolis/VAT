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
              className="inline-block w-full max-w-4xl p-8 my-8 text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all relative"
            >
              {/* Header Actions */}
              <div className="absolute right-4 top-4 flex items-center space-x-2">
                <button
                  onClick={onDownload}
                  className="p-2 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handlePrint}
                  className="p-2 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <PrinterIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors duration-200 text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Invoice Content */}
              <div className="mt-8 space-y-8" id="invoice-preview">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-br from-violet-600 to-violet-700 bg-clip-text text-transparent">
                      Invoice
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">{invoice.number}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Date Issued</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(invoice.date)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">Due Date</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(invoice.dueDate)}
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Bill To</h3>
                    <div className="text-gray-900 dark:text-white">
                      <div className="font-medium">{invoice.customer?.name}</div>
                      <div>{invoice.customer?.address?.street}</div>
                      <div>{invoice.customer?.address?.city}, {invoice.customer?.address?.country}</div>
                      <div>VAT: {invoice.customer?.vatNumber}</div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Details</h3>
                    <div className="text-gray-900 dark:text-white">
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
                        <th className="text-right py-3 text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {invoice.lines.map((line, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-4 text-gray-900 dark:text-white">{line.description}</td>
                          <td className="py-4 text-right text-gray-900 dark:text-white">{line.quantity}</td>
                          <td className="py-4 text-right text-gray-900 dark:text-white">
                            {formatCurrency(line.unitPrice, invoice.currency)}
                          </td>
                          <td className="py-4 text-right text-gray-900 dark:text-white">{line.vatRate}%</td>
                          <td className="py-4 text-right text-gray-900 dark:text-white">
                            {formatCurrency(line.quantity * line.unitPrice * (1 + line.vatRate / 100), invoice.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex justify-end space-y-2">
                    <div className="w-64">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(invoice.totalExVat, invoice.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500 dark:text-gray-400">VAT</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatCurrency(invoice.totalVat, invoice.currency)}
                        </span>
                      </div>
                      <div className="flex justify-between text-base font-medium pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-violet-600 dark:text-violet-400">
                          {formatCurrency(invoice.totalIncVat, invoice.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {invoice.notes && (
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Notes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{invoice.notes}</p>
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