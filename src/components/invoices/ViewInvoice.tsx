import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedPage } from "../../components/AnimatedPage";
import { invoiceService } from "../../lib/services/invoice-service";
import useSWR from "swr";
import { Button } from "../../components/ui/button";
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
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { InvoicePDF } from "./invoice-pdf";
import html2pdf from "html2pdf.js";
import type { Invoice } from "@/lib/pocketbase";
import { toast } from "sonner";
import { formatDate, formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export function ViewInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: invoice, error: invoiceError } = useSWR(
    id ? ["invoice", id] : null,
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
    if (!invoice || !id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete invoice #${invoice.number}? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await invoiceService.delete(id);
        toast.success("Invoice deleted successfully");
        navigate("/invoices");
      } catch (error) {
        console.error("Failed to delete invoice:", error);
        toast.error("Failed to delete invoice");
      }
    }
  };

  // Show error states
  if (invoiceError) {
    return (
      <AnimatedPage>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto p-6"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-4 mb-6"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/invoices")}
              className="hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </Button>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg border shadow-sm p-6"
          >
            <p className="text-red-500">Failed to load invoice</p>
          </motion.div>
        </motion.div>
      </AnimatedPage>
    );
  }

  // Show loading state
  if (!invoice) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AnimatedPage>
    );
  }

  const customer = invoice.expand?.customerId;

  if (!customer) {
    return (
      <AnimatedPage>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto p-6"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-4 mb-6"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/invoices")}
              className="hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Invoices
            </Button>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-lg border shadow-sm p-6"
          >
            <p className="text-red-500">
              Customer data not found for this invoice. The customer may have
              been deleted.
            </p>
          </motion.div>
        </motion.div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Print styles */}
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #invoice-pdf, #invoice-pdf * {
                visibility: visible;
              }
              #invoice-pdf {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              .no-print {
                display: none !important;
              }
            }
          `}
        </style>

        {/* Invoice Header */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-black/10 rounded overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="border-b border-black/5 bg-slate-50/50 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/invoices")}>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>

              <div className="p-3 rounded bg-gradient-to-br from-blue-50 to-blue-100/80">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 text-xl mb-1">
                  Invoice #{invoice.number}
                </h2>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Created on {formatDate(invoice.created)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-slate-400" />
                    <span>{customer.name}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="hover:bg-slate-50 transition-colors w-[140px] rounded-full"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadPDF}
                className="hover:bg-slate-50 transition-colors w-[140px] rounded-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/invoices/${id}/edit`)}
                className="hover:bg-slate-50 transition-colors w-[140px] rounded-full"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Invoice
              </Button>
            </div>
          </div>

          {/* Invoice PDF */}
          <motion.div
            variants={itemVariants}
            id="invoice-pdf"
            className="p-8 bg-white"
          >
            <InvoicePDF invoice={invoice} customer={customer} />
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
