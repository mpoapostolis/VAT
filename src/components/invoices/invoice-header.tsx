import { Link } from "react-router-dom";
import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { Invoice } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";
import {
  ArrowLeft,
  Edit,
  Download,
  CircleDot,
  ChevronDown,
  EyeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
// @ts-ignore
import html2pdf from "html2pdf.js";
import clsx from "clsx";

interface InvoiceHeaderProps {
  mode?: "view" | "edit";
  onDownload?: () => void;
}

export function InvoiceHeader({
  mode = "view",
  onDownload,
}: InvoiceHeaderProps) {
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

  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleDownload = async () => {
    onDownload?.();
  };

  if (!invoice || !customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-black/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/invoices")}
              className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Invoices
            </button>

            <div className="flex items-center gap-4">
              <h1 className="text-lg font-medium text-[#0F172A]">
                Invoice #{invoice.number}
              </h1>
              <div
                className={clsx(
                  "px-2.5 py-0.5 rounded-md text-xs font-medium",
                  {
                    "bg-[#DCFCE7] text-[#10B981]":
                      invoice.status.toLowerCase() === "paid",
                    "bg-[#FEF9C3] text-[#F59E0B]":
                      invoice.status.toLowerCase() === "pending",
                    "bg-[#FEE2E2] text-[#EF4444]":
                      invoice.status.toLowerCase() === "overdue",
                    "bg-[#F1F5F9] text-[#64748B]": !invoice.status,
                  }
                )}
              >
                {invoice.status}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg border border-black/10 hover:border-[#3B82F6]"
              >
                <CircleDot className="w-4 h-4" />
                Update Status
                <ChevronDown className="w-4 h-4" />
              </button>

              {showStatusMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-black/10 py-1 z-10">
                  {["paid", "pending", "overdue"].map((status) => (
                    <button
                      key={status}
                      onClick={() => {
                        handleStatusUpdate(status as Invoice["status"]);
                        setShowStatusMenu(false);
                      }}
                      className={clsx(
                        "w-full px-4 py-2 text-left text-sm hover:bg-[#F8FAFC] transition-colors",
                        {
                          "text-[#10B981]": status === "paid",
                          "text-[#F59E0B]": status === "pending",
                          "text-[#EF4444]": status === "overdue",
                        }
                      )}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() =>
                navigate(
                  mode === "view" ? `/invoices/${id}/edit` : `/invoices/${id}`
                )
              }
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors rounded-lg border border-black/10 hover:border-[#3B82F6]"
            >
              {mode === "view" ? (
                <>
                  <Edit className="w-4 h-4" />
                  Edit
                </>
              ) : (
                <>
                  <EyeIcon className="w-4 h-4" />
                  View
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#3B82F6] hover:bg-[#2563EB] transition-colors rounded-lg"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4">
          <img
            src={`https://ui-avatars.com/api/?name=${customer.name}&background=random`}
            alt={customer.name}
            className="w-10 h-10 rounded-lg border border-black/10"
          />
          <div>
            <Link
              to={`/customers/${customer.id}`}
              className="font-medium text-[#0F172A] hover:text-[#3B82F6] transition-colors"
            >
              {customer.name}
            </Link>
            <div className="text-sm text-[#64748B]">{customer.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
