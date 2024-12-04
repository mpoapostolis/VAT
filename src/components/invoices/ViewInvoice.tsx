import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { Invoice } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { InvoiceHeader } from "./invoice-header";
import { InvoiceDetails } from "./invoice-details";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";
import {
  ArrowLeft,
  Edit,
  Download,
  CircleDot,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";

export function ViewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const { data: invoice, mutate: refreshInvoice } = useSWR(
    id ? `invoices/${id}` : null,
    () => invoiceService.getById(id!)
  );

  const { data: customer } = useSWR(
    invoice ? `customers/${invoice.customerId}` : null,
    () => customerService.getById(invoice!.customerId)
  );

  const handleStatusUpdate = async (newStatus: Invoice["status"]) => {
    if (!invoice || !id) return;
    try {
      await invoiceService.updateStatus(id, newStatus);
      refreshInvoice();
      addToast(`Invoice status updated to ${newStatus}`, "success");
    } catch (error) {
      addToast("Failed to update invoice status", "error");
    }
  };

  const handleDownload = async () => {
    if (!invoiceRef.current || !invoice) return;

    const element = invoiceRef.current;
    const opt = {
      margin: [10, 10],
      filename: `invoice-${invoice.number}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      addToast("Generating PDF...", "info");
      await html2pdf().set(opt).from(element).save();
      addToast("PDF downloaded successfully", "success");
    } catch (error) {
      addToast("Failed to generate PDF", "error");
      console.error("PDF generation error:", error);
    }
  };

  if (!invoice || !customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <InvoiceHeader onDownload={handleDownload} mode="view" />
      <div ref={invoiceRef} className="">
        <InvoiceDetails invoice={invoice} customer={customer} />
      </div>
    </motion.div>
  );
}
