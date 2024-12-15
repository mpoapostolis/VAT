import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { invoiceService } from "@/lib/services/invoice-service";
import useSWR from "swr";
import { Button } from "@/components/ui/button";
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
import { InvoicePDF } from "./invoice-pdf";
import html2pdf from "html2pdf.js";
import type { Invoice } from "@/lib/pocketbase";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/utils";

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
      const element = document.getElementById("invoice-pdf");
      if (!element) {
        toast.error("Could not find invoice element to download");
        return;
      }

      const opt = {
        margin: [0.5, 0.5],
        filename: `invoice-${invoice?.number || "download"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      };

      await html2pdf().set(opt).from(element).save();
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
          <h2 className="text-2xl font-semibold text-gray-900">Invoice not found</h2>
          <p className="mt-2 text-gray-600">The invoice you're looking for doesn't exist or you don't have access to it.</p>
          <button
            onClick={() => navigate("/invoices")}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/invoices")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-semibold">Invoice #{invoice.number}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/invoices/${id}/edit`)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <FileText className="h-4 w-4" />
                  <span className="text-sm font-medium">Invoice Details</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Number: <span className="font-medium">{invoice.number}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Type:{" "}
                    <span className="font-medium capitalize">
                      {invoice.type}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-medium ${
                        invoice.status === "paid"
                          ? "text-green-600"
                          : "text-orange-600"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">Dates</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Issue Date:{" "}
                    <span className="font-medium">
                      {formatDate(new Date(invoice.date))}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Due Date:{" "}
                    <span className="font-medium">
                      {invoice.dueDate
                        ? formatDate(new Date(invoice.dueDate))
                        : "N/A"}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Customer</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Name:{" "}
                    <span className="font-medium">
                      {invoice.expand?.customerId?.name}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email:{" "}
                    <span className="font-medium">
                      {invoice.expand?.customerId?.email}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    VAT Number:{" "}
                    <span className="font-medium">
                      {invoice.expand?.customerId?.vatNumber}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-gray-500 mb-2">
                  <Euro className="h-4 w-4" />
                  <span className="text-sm font-medium">Amount</span>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Subtotal:{" "}
                    <span className="font-medium">
                      {formatCurrency(invoice.amount)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    VAT:{" "}
                    <span className="font-medium">
                      {formatCurrency(invoice.vat)}
                    </span>
                  </p>
                  <p className="text-sm font-semibold">
                    Total:{" "}
                    <span className="text-lg">
                      {formatCurrency(invoice.total)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Preview */}
        <div id="invoice-pdf" className="bg-white rounded-lg shadow p-6">
          <InvoicePDF invoice={invoice} />
        </div>
      </div>
    </AnimatedPage>
  );
}
