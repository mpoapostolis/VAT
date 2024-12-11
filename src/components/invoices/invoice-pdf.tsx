import React from "react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface InvoicePDFProps {
  invoice: any;
  customer: any;
}

export function InvoicePDF({ invoice, customer }: InvoicePDFProps) {
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b pb-8">
        <div className="flex justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">INVOICE</h1>
            <p className="text-gray-600 mt-2">#{invoice.number}</p>
          </div>
          <div className="text-right">
            <p className="text-gray-600">Issue Date</p>
            <p className="font-medium">{format(new Date(invoice.date), "dd/MM/yyyy")}</p>
            <p className="text-gray-600 mt-2">Due Date</p>
            <p className="font-medium">{format(new Date(invoice.dueDate), "dd/MM/yyyy")}</p>
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mt-8 border-b pb-8">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">From</h2>
            <div className="mt-4">
              <p className="font-medium">Your Company Name</p>
              <p className="text-gray-600">123 Business Street</p>
              <p className="text-gray-600">Business City, 12345</p>
              <p className="text-gray-600">VAT: 123456789</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Bill To</h2>
            <div className="mt-4">
              <p className="font-medium">{customer.name}</p>
              <p className="text-gray-600">{customer.address}</p>
              <p className="text-gray-600">{customer.vatNumber}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-8">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Description</th>
              <th className="text-right py-3 px-4">Quantity</th>
              <th className="text-right py-3 px-4">Price</th>
              <th className="text-right py-3 px-4">VAT %</th>
              <th className="text-right py-3 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-4 px-4">{item.description}</td>
                <td className="text-right py-4 px-4">{item.quantity}</td>
                <td className="text-right py-4 px-4">{formatCurrency(item.price)}</td>
                <td className="text-right py-4 px-4">{item.vat}%</td>
                <td className="text-right py-4 px-4">{formatCurrency(item.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-8">
        <div className="flex justify-end">
          <div className="w-64 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(invoice.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">VAT</span>
              <span className="font-medium">{formatCurrency(invoice.vat)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t pt-3">
              <span>Total</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="mt-8 pt-8 border-t">
          <h2 className="text-lg font-semibold text-gray-900">Notes</h2>
          <p className="mt-2 text-gray-600">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>Thank you for your business!</p>
        <p className="mt-1">Payment is due by {format(new Date(invoice.dueDate), "dd/MM/yyyy")}</p>
      </div>
    </div>
  );
}
