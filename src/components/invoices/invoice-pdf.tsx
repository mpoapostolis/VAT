import React from "react";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";

interface InvoicePDFProps {
  invoice: any;
  customer: any;
}

export function InvoicePDF({ invoice, customer }: InvoicePDFProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div
        id="pdf"
        className="bg-white w-[210mm] p-24 mx-auto shadow-xl"
      >
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl font-light tracking-widest text-gray-900 mb-1">INVOICE</h1>
          <p className="text-sm text-gray-500 tracking-wider">#{invoice?.number}</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-16 mb-16">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">From</p>
            <div className="space-y-1">
              <p className="text-sm font-medium">{customer?.name}</p>
              <p className="text-sm text-gray-500">{customer?.address}</p>
              <p className="text-sm text-gray-500">VAT: {customer?.vatNumber}</p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-3">Bill To</p>
            <div className="space-y-1">
              <p className="text-sm font-medium">{invoice?.billingName}</p>
              <p className="text-sm text-gray-500">{invoice?.billingAddress}</p>
              <p className="text-sm text-gray-500">VAT: {invoice?.billingVat}</p>
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-8 mb-16">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Issue Date</p>
            <p className="text-sm">{format(new Date(invoice?.date), "dd.MM.yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Due Date</p>
            <p className="text-sm">{format(new Date(invoice?.dueDate), "dd.MM.yyyy")}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Status</p>
            <p className="text-sm">Issued</p>
          </div>
        </div>

        {/* Items */}
        <div className="mb-16">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4 text-xs text-gray-400 font-normal uppercase tracking-wider">Description</th>
                <th className="text-right pb-4 text-xs text-gray-400 font-normal uppercase tracking-wider">Qty</th>
                <th className="text-right pb-4 text-xs text-gray-400 font-normal uppercase tracking-wider">Price</th>
                <th className="text-right pb-4 text-xs text-gray-400 font-normal uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="border-t border-gray-100">
              {invoice?.items?.map((item: any, index: number) => (
                <tr key={index} className="border-b border-gray-50">
                  <td className="py-6">
                    <p className="text-sm">{item.description}</p>
                  </td>
                  <td className="py-6 text-right text-sm text-gray-500">{item.quantity}</td>
                  <td className="py-6 text-right text-sm text-gray-500">{formatCurrency(item.price)}</td>
                  <td className="py-6 text-right text-sm">{formatCurrency(item.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100">
          <div className="ml-auto w-64 mt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span>{formatCurrency(invoice?.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">VAT</span>
              <span>{formatCurrency(invoice?.vat)}</span>
            </div>
            <div className="flex justify-between text-sm pt-2 border-t border-gray-100 mt-2">
              <span>Total</span>
              <span className="font-medium">{formatCurrency(invoice?.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Thank you for your business</p>
        </div>
      </div>
    </div>
  );
}
