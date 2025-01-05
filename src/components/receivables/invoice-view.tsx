import { useParams, useNavigate } from "react-router-dom";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useCustomers } from "@/lib/hooks/useCustomers";
import { useCompanies } from "@/lib/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Edit2,
  Building2,
  Calendar,
  CreditCard,
  FileText,
  User,
  Phone,
  Mail,
  Globe,
  MapPin,
  Loader2,
  DollarSign,
  Send,
} from "lucide-react";
import { generateInvoicePDF } from "@/lib/utils/generateInvoicePDF";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useInvoice } from "@/lib/hooks/useInvoice";
import { useCompany } from "@/lib/hooks/useCompany";
import { useCustomer } from "@/lib/hooks/useCustomer";
import { pb } from "@/lib/pocketbase";

export function InvoiceView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);
  const { data: invoice, mutate } = useInvoice(id);
  const { data: customer } = useCustomer(invoice?.customerId);
  const { data: company } = useCompany(invoice?.companyId);

  if (!invoice || !customer || !company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-xs text-gray-600">Loading invoice details...</p>
        </div>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!invoice || !company || !customer) return;

    try {
      setIsDownloading(true);

      // Ensure all required fields are present
      const pdfData = {
        ...invoice,
        items: invoice.items || [],
        vatRate: (invoice.vatAmount / invoice.total) * 100 || 0,
        vatAmount: invoice.vatAmount || 0,
        total: invoice.total || 0,
      };

      const companyData = {
        companyNameEN: company.companyNameEN || "",
        vatNumber: company.defaultVatRate?.toString() || "",
        address: company.billingAddress?.street || "",
        city: company.billingAddress?.city || "",
        country: company.billingAddress?.country || "",
        email: company.email || "",
        phone: company.phoneNumber || "",
      };

      const customerData = {
        companyName: customer.companyName || "",
        contactFirstName: customer.contactFirstName || "",
        contactLastName: customer.contactLastName || "",
        type: customer.relationship || "",
        address: customer.billingAddress || "",
        country: customer?.country || "",
        email: customer.email || "",
        phone: customer.phoneNumber || "",
      };

      await generateInvoicePDF(pdfData, companyData, customerData);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      console.error(
        "Error details:",
        error instanceof Error ? error.stack : error
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mx-auto  space-y-6">
      {/* Main Content */}
      <div className="bg-white rounded border border-black/10 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          <div className="flex border-b flex-wrap  border-gray-200 pb-3 items-center   gap-4">
            <div className="flex mr-auto  items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xs flex-wrap w-full items-center gap-2 flex font-medium text-gray-900">
                  <Badge
                    variant="secondary"
                    className="text-xs  font-mono -ml-3 py-1"
                  >
                    #{invoice.number}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs px-3 py-0 h-5",
                      invoice.type === "receivable"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-blue-50 text-blue-700 border-blue-200"
                    )}
                  >
                    {invoice.type === "receivable" ? "Receivable" : "Payable"}{" "}
                    Invoice
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs px-3 h-5",
                      invoice.status === "paid" || invoice.status === "issued"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : invoice.status === "overdue"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {invoice.status}
                  </Badge>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  View the complete details of this invoice
                </p>
              </div>
            </div>
            {invoice.status === "draft" && (
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await pb.collection("invoices").update(id!, {
                    status: "issued",
                  });
                  mutate();
                }}
                className="flex h-7 items-center text-xs gap-2"
              >
                <Send className="h-3 w-3" />
                issue invoice
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/receivables/${id}/edit`)}
              className="flex   h-7 items-center text-xs gap-2"
            >
              <Edit2 className="h-3 w-3" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className="flex h-7 items-center text-xs gap-2"
            >
              {isDownloading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Download className="h-3 w-3" />
              )}
              {isDownloading ? "Generating..." : "Download PDF"}
            </Button>
          </div>

          {/* Invoice Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Issue Date</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">
                  {format(new Date(invoice.date), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded">
                <Calendar className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Due Date</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">
                  {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded">
                <CreditCard className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">
                  Payment Terms
                </p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">
                  {invoice.paymentTerms || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded">
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Reference</p>
                <p className="text-xs font-medium text-gray-900 mt-0.5">
                  {invoice.referenceNumber || "N/A"}
                </p>
              </div>
            </div>
          </div>

          {/* Party Details */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Customer Card */}
            <Card className="bg-gray-50/50">
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">
                      {customer.companyName ||
                        `${customer.contactFirstName} ${customer.contactLastName}`}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {customer.relationship || "Individual"}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-xs">
                  {customer.email && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${customer.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {customer.email}
                      </a>
                    </div>
                  )}
                  {customer.phoneNumber && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${customer.phoneNumber}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {customer.phoneNumber}
                      </a>
                    </div>
                  )}
                  {customer.taxRegistrationNumber && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Globe className="h-4 w-4" />
                      <a
                        href={customer.businessType}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {customer.businessType}
                      </a>
                    </div>
                  )}
                  {customer.billingAddress && (
                    <div className="flex gap-3 text-gray-500">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div className="text-xs">
                        <p className="text-gray-500 text-xs">
                          {customer.billingAddress}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {customer.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Company Card */}
            <Card className="bg-gray-50/50">
              <div className="p-6">
                <div className="flex items-start gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded">
                    <Building2 className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium text-gray-900">
                      {company.companyNameEN}
                    </h4>
                    <p className="text-xs text-gray-500">
                      VAT: {company.vatNumber}
                    </p>
                  </div>
                </div>
                <div className="space-y-4 text-xs">
                  {company.email && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${company.email}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {company.email}
                      </a>
                    </div>
                  )}
                  {company.phoneNumber && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Phone className="h-4 w-4" />
                      <a
                        href={`tel:${company.phoneNumber}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {company.phoneNumber}
                      </a>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-3 text-gray-500">
                      <Globe className="h-4 w-4" />
                      <a
                        href={company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 transition-colors"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                  {company.billingAddress && (
                    <div className="flex gap-3 text-gray-500 ">
                      <MapPin className="h-4 w-4 mt-0.5  flex-shrink-0" />
                      <div>
                        <p className="text-gray-500 text-xs">
                          {company?.billingAddress.street}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {company?.billingAddress.city},{" "}
                          {company?.billingAddress.country}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Invoice Items */}
          <div className="border border-gray-200 rounded overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-32"
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoice.items?.map((item, index: number) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 text-xs text-gray-900">
                      <div>
                        <p className="font-medium">{item.description}</p>
                        {item.description && (
                          <p className="text-gray-500 mt-0.5 text-xs">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-900 text-right">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-900 text-right font-mono">
                      €{item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-900 text-right font-mono">
                      €{(item.quantity * item.unitPrice).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-3">
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-xs text-gray-500">Subtotal</span>
                <span className="text-xs font-medium text-gray-900 font-mono">
                  €{invoice.total.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-200 pb-3">
                <span className="text-xs text-gray-500">
                  VAT ({invoice.vatAmount}%)
                </span>
                <span className="text-xs font-medium text-gray-900 font-mono">
                  €{invoice.vatAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-3">
                <span className="text-base font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-base font-semibold text-blue-600 font-mono">
                  €{(invoice.total + invoice.vatAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
