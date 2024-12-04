import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useToast } from "@/lib/hooks/useToast";
import useSWR from "swr";
import type { Customer, Invoice } from "@/lib/pocketbase";
import { invoiceService } from "@/lib/services/invoice-service";
import { motion } from "framer-motion";
import { InvoiceForm } from "./create/invoice-form";

export function CreateInvoice() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: customersData } = useSWR<{ items: Customer[] }>("customers");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: Omit<Invoice, "id">) => {
    setIsSubmitting(true);
    try {
      const invoice = await invoiceService.create(data);
      addToast("Invoice created successfully", "success");
      navigate(`/invoices/${invoice.id}`);
    } catch (error) {
      console.error("Failed to create invoice:", error);
      addToast("Failed to create invoice", "error");
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/invoices")}
              className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium text-gray-700 transition-colors bg-white border rounded-md hover:bg-gray-50 active:bg-gray-100"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Invoices
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl overflow-hidden"
          >
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
              <h2 className="font-medium text-gray-800">Invoice Information</h2>
              <p className="text-sm text-gray-500">
                Create a new invoice with customer and item details
              </p>
            </div>

            <div className="p-6">
              <InvoiceForm
                customers={customersData?.items || []}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                onCancel={() => navigate("/invoices")}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
