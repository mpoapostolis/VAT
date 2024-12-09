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
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vat-return")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(
                mode === "view" ? `/invoices/${id}/edit` : `/invoices/${id}`
              )
            }
            className="border-gray-200 hover:bg-gray-50"
          >
            {mode === "view" && <Edit className="w-4 h-4 mr-1.5" />}
            {mode === "edit" && <EyeIcon className="w-4 h-4 mr-1.5" />}
            {mode === "view" ? "Edit Invoice" : "View Invoice"}
          </Button>

          {mode === "view" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="border-gray-200 hover:bg-gray-50"
            >
              <Download className="w-4 h-4 mr-1.5" />
              Download PDF
            </Button>
          )}
          {mode === "edit" && (
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className={clsx(
                  `border-gray-200 hover:bg-gray-50 ${
                    showStatusMenu ? "bg-gray-50" : ""
                  }`,
                  {
                    "bg-green-50 text-green-700 border border-green-200":
                      invoice.status === "paid",
                    "bg-red-50 text-red-700 border border-red-200":
                      invoice.status === "overdue",
                    "bg-gray-50 text-gray-700 border border-gray-200":
                      invoice.status === "draft",
                    "bg-yellow-50 text-yellow-700 border border-yellow-200":
                      invoice.status === "pending",
                  }
                )}
              >
                <CircleDot className="w-4 h-4 mr-1.5" />
                {`${invoice?.status}`}
                <ChevronDown className="w-4 h-4 ml-1.5" />
              </Button>
              {showStatusMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded shadow-lg border border-gray-200 py-1 z-10">
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      handleStatusUpdate("draft");
                      setShowStatusMenu(false);
                    }}
                  >
                    Mark as Draft
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      handleStatusUpdate("pending");
                      setShowStatusMenu(false);
                    }}
                  >
                    Mark as Pending
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      handleStatusUpdate("paid");
                      setShowStatusMenu(false);
                    }}
                  >
                    Mark as Paid
                  </button>
                  <button
                    className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      handleStatusUpdate("overdue");
                      setShowStatusMenu(false);
                    }}
                  >
                    Mark as Overdue
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
