import { useNavigate, useParams } from "react-router-dom";
import { useInvoice } from "@/lib/hooks/use-invoice";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { InvoicePDF } from "./invoice-pdf";
import html2pdf from "html2pdf.js";
import type { Invoice } from "@/lib/pocketbase";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/utils";
import { createRoot } from "react-dom/client";
import React from "react";
import { invoiceService } from "@/lib/services/invoice-service";
import useSWR from "swr";
import {
  ArrowLeft,
  Download,
  Edit3,
  Printer,
  Trash2,
  FileText,
  Clock,
  Building2,
  Euro,
} from "lucide-react";

export function ViewInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: invoice, error: invoiceError } = useSWR(
    id ? `invoices/${id}` : null,
    async () => {
      try {
        return await invoiceService.getById(id!);
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
        throw error;
      }
    }
  );

  const handleDownloadPDF = async () => {
    try {
      if (!invoice) {
        toast.error("No invoice data available");
        return;
      }

      // Create container
      const container = document.getElementById("pdf");

      if (!container) {
        toast.error("PDF container not found");
        return;
      }

      const opt = {
        margin: 0,
        filename: `invoice-${invoice.number}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true,
        },
        jsPDF: {
          unit: "in",
          format: "a4",
          orientation: "portrait",
        },
      };

      toast.loading("Generating PDF...");
      await html2pdf().from(container).set(opt).save();
      toast.success("PDF downloaded successfully");
    } catch (error) {
      console.error("Failed to download PDF:", error);
      toast.error("Failed to download PDF");
    }
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (error) {
      console.error("Failed to print:", error);
      toast.error("Failed to print invoice");
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    try {
      await invoiceService.delete(id);
      toast.success("Invoice deleted successfully");
      navigate("/invoices");
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      toast.error("Failed to delete invoice");
    }
  };

  if (invoiceError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            Invoice not found
          </h2>
          <p className="mt-2 text-gray-600">
            The invoice you're looking for doesn't exist or you don't have
            access to it.
          </p>
          <button
            onClick={() => navigate("/invoices")}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go back to invoices
          </button>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/invoices")}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-gray-400" />
            </Button>
            <div>
              <h1 className="text-3xl font-light tracking-tight text-gray-900">
                Invoice #{invoice.number}
              </h1>
              <p className="text-sm text-gray-400 mt-1 tracking-wide">
                View and manage invoice details
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrint}
              className="text-gray-500 hover:text-gray-600 hover:bg-gray-50/50 transition-all duration-200"
            >
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadPDF}
              className="text-gray-500 hover:text-gray-600 hover:bg-gray-50/50 transition-all duration-200"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/invoices/${id}/edit`)}
              className="text-gray-500 hover:text-gray-600 hover:bg-gray-50/50 transition-all duration-200"
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="text-gray-500 hover:text-gray-600 hover:bg-gray-50/50 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-3 gap-8">
          {/* Left Column - Invoice Details */}
          <div className="col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
              <div className="flex items-center gap-3 text-gray-400 mb-8">
                <FileText className="h-5 w-5" />
                <span className="font-medium tracking-wide">Invoice Information</span>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <p className="text-sm text-gray-400 mb-2 tracking-wide">
                      Invoice Number
                    </p>
                    <p className="text-lg text-gray-900 font-light">
                      {invoice.number}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2 tracking-wide">Type</p>
                    <p className="text-lg text-gray-900 font-light capitalize">
                      {invoice.type}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2 tracking-wide">Status</p>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-light tracking-wide ${
                        invoice.status === "paid"
                          ? "bg-gray-50 text-gray-600"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="space-y-8">
                  <div>
                    <p className="text-sm text-gray-400 mb-2 tracking-wide">Issue Date</p>
                    <p className="text-lg text-gray-900 font-light">
                      {formatDate(new Date(invoice.date))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-2 tracking-wide">Due Date</p>
                    <p className="text-lg text-gray-900 font-light">
                      {invoice.dueDate
                        ? formatDate(new Date(invoice.dueDate))
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
              <div className="flex items-center gap-3 text-gray-400 mb-8">
                <Building2 className="h-5 w-5" />
                <span className="font-medium tracking-wide">Company Details</span>
              </div>
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <p className="text-sm text-gray-400 mb-2 tracking-wide">Company Name</p>
                  <p className="text-lg text-gray-900 font-light">
                    {invoice.expand?.customerId?.name || "—"}
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    {invoice.expand?.customerId?.vatNumber || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2 tracking-wide">Address</p>
                  <p className="text-lg text-gray-900 font-light">
                    {invoice.expand?.customerId?.address || "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Financial Summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100/50 p-8">
              <div className="flex items-center gap-3 text-gray-400 mb-8">
                <Euro className="h-5 w-5" />
                <span className="font-medium tracking-wide">Financial Summary</span>
              </div>
              <div className="space-y-8">
                <div>
                  <p className="text-sm text-gray-400 mb-2 tracking-wide">Subtotal</p>
                  <p className="text-lg text-gray-900 font-light">
                    {formatCurrency(invoice.total - invoice.vat)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2 tracking-wide">VAT</p>
                  <p className="text-lg text-gray-900 font-light">
                    {formatCurrency(invoice.vat)}
                  </p>
                </div>
                <div className="pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-400 mb-2 tracking-wide">Total Amount</p>
                  <p className="text-2xl text-gray-900 font-light tracking-tight">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>
                <div className="pt-6">
                  <p className="text-sm text-gray-400 mb-2 tracking-wide">Amount Paid</p>
                  <p className="text-lg text-gray-900 font-light">
                    {formatCurrency(invoice.paid)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-2 tracking-wide">Balance Due</p>
                  <p className="text-lg text-gray-900 font-light">
                    {formatCurrency(invoice.total - invoice.paid)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <InvoicePDF invoice={invoice} customer={invoice.expand?.customerId} />
    </AnimatedPage>
  );
}
