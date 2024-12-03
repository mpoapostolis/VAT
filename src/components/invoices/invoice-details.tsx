import React from "react";
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface InvoiceDetailsProps {
  invoice: any;
  customer: any;
}

export function InvoiceDetails({ invoice, customer }: InvoiceDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200/60 overflow-hidden"
    >
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              Invoice #{invoice.number}
            </div>
            <span
              className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                invoice.status === "paid"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : invoice.status === "overdue"
                  ? "bg-red-50 text-red-700 border border-red-200"
                  : invoice.status === "draft"
                  ? "bg-gray-50 text-gray-700 border border-gray-200"
                  : "bg-yellow-50 text-yellow-700 border border-yellow-200"
              }`}
            >
              {invoice?.status?.toUpperCase()}
            </span>
          </div>
          <div className="text-right">
            <div className="text-2xl font-semibold text-blue-600 mb-1">
              {formatCurrency(invoice.total)}
            </div>
            <div className="text-sm text-gray-500">Total Amount</div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">From</div>
              <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-200/60">
                <div className="text-base font-semibold text-gray-900 mb-1">
                  Your Company Name
                </div>
                <div className="text-sm text-gray-600">123 Business Street</div>
                <div className="text-sm text-gray-600">City, Country</div>
                <div className="text-sm text-gray-600 mt-2">VAT: 123456789</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-500">Bill To</div>
              <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-200/60">
                <div className="text-base font-semibold text-gray-900 mb-1">
                  {customer.name}
                </div>
                <div className="text-sm text-gray-600">{customer.address}</div>
                <div className="text-sm text-gray-600">{customer.email}</div>
                <div className="text-sm text-gray-600 mt-2">VAT: {customer.trn}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-200/60">
            <div className="text-sm font-medium text-gray-500 mb-1">Issue Date</div>
            <div className="text-sm text-gray-900">
              {new Date(invoice.date).toLocaleDateString()}
            </div>
          </div>
          <div className="p-4 bg-gray-50/50 rounded-lg border border-gray-200/60">
            <div className="text-sm font-medium text-gray-500 mb-1">Due Date</div>
            <div className="text-sm text-gray-900">
              {new Date(invoice.dueDate).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mb-8 rounded-lg border border-gray-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/80">
                  <th className="text-left py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/60">
                {invoice.items.map((item: any, index: number) => (
                  <tr key={index} className="text-sm">
                    <td className="py-3 px-4 text-gray-900">{item.description}</td>
                    <td className="text-right py-3 px-4 text-gray-600 font-medium">
                      {item.quantity}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-600 font-medium">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900 font-medium">
                      {formatCurrency(item.quantity * item.price)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-72 space-y-3 bg-gray-50/50 p-4 rounded-lg border border-gray-200/60">
            <div className="flex justify-between text-sm">
              <div className="text-gray-500">Subtotal</div>
              <div className="font-medium text-gray-900">
                {formatCurrency(invoice.subtotal)}
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="text-gray-500">VAT (5%)</div>
              <div className="font-medium text-gray-900">
                {formatCurrency(invoice.vat)}
              </div>
            </div>
            <div className="flex justify-between pt-3 border-t border-gray-200">
              <div className="font-medium text-gray-900">Total</div>
              <div className="font-semibold text-blue-600">
                {formatCurrency(invoice.total)}
              </div>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-500">Notes</div>
            <div className="text-sm text-gray-600 bg-gray-50/50 p-4 rounded-lg border border-gray-200/60">
              {invoice.notes}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
