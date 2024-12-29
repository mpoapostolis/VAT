import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Building, FileText, Info, User } from "lucide-react";

interface InvoiceViewProps {
  invoice: any; // Replace with proper type
}

export function InvoiceView({ invoice }: InvoiceViewProps) {
  return (
    <div className="space-y-8 print:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            {invoice.type}
          </h1>
          <p className="mt-2 text-lg text-gray-600">#{invoice.number}</p>
        </div>
        <Badge variant={invoice.status === "paid" ? "success" : "warning"} className="text-sm">
          {invoice.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Company Information */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Company Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Business Name</h4>
              <p className="text-gray-900">{invoice.company.businessName}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">TRN</h4>
              <p className="text-gray-900 font-mono">{invoice.company.trn}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Address</h4>
              <p className="text-gray-900">{invoice.company.address}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Contact</h4>
              <p className="text-gray-900">{invoice.company.phone}</p>
              <p className="text-gray-900">{invoice.company.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700">Business Name</h4>
              <p className="text-gray-900">
                {invoice.customer.businessName ||
                  `${invoice.customer.firstName} ${invoice.customer.lastName}`}
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">TRN</h4>
              <p className="text-gray-900 font-mono">{invoice.customer.trn || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Billing Address</h4>
              <p className="text-gray-900">{invoice.customer.billingAddress}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Contact</h4>
              <p className="text-gray-900">{invoice.customer.phone}</p>
              <p className="text-gray-900">{invoice.customer.email}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Details */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            <CardTitle className="text-lg">Invoice Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <h4 className="font-medium text-gray-700">Issue Date</h4>
              <p className="text-gray-900">{formatDate(invoice.date)}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Due Date</h4>
              <p className="text-gray-900">{formatDate(invoice.dueDate)}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Payment Terms</h4>
              <p className="text-gray-900">{invoice.paymentTerms}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700">Currency</h4>
              <p className="text-gray-900">{invoice.currency}</p>
            </div>
            {invoice.currency !== "AED" && (
              <div>
                <h4 className="font-medium text-gray-700">Exchange Rate</h4>
                <p className="text-gray-900">{invoice.exchangeRate} AED</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Invoice Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Invoice Items</CardTitle>
          <CardDescription>
            All amounts are in {invoice.currency}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item No</TableHead>
                <TableHead className="w-[300px]">Description</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Tax Code</TableHead>
                <TableHead>VAT</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.items.map((item: any, index: number) => (
                <TableRow key={item.itemNo}>
                  <TableCell className="font-mono">{item.itemNo}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{item.description}</p>
                      {item.notes && (
                        <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                  <TableCell>
                    {item.discount.type === "percentage"
                      ? `${item.discount.value}%`
                      : formatCurrency(item.discount.value)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono">
                      {item.taxCode}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(item.vatAmount)}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(item.total)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-end">
            <div className="w-80 space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.subtotal)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>VAT:</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(invoice.vatAmount)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(invoice.total)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Information */}
      {(invoice.termsAndConditions || invoice.paymentInformation || invoice.notes) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {invoice.termsAndConditions && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Terms & Conditions</h4>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {invoice.termsAndConditions}
                </p>
              </div>
            )}
            {invoice.paymentInformation && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Payment Information</h4>
                <p className="text-gray-900 whitespace-pre-wrap">
                  {invoice.paymentInformation}
                </p>
              </div>
            )}
            {invoice.notes && (
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Notes</h4>
                <p className="text-gray-900 whitespace-pre-wrap">{invoice.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
