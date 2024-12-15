import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { InvoiceForm } from "./create/invoice-form";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";
import { toast } from "sonner";
import useSWR from "swr";

export function EditInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { data: invoice, error: invoiceError } = useSWR(
    id ? `invoices/${id}` : null,
    () => invoiceService.getById(id!)
  );

  const { data: customers, error: customersError } = useSWR("customers", () =>
    customerService.getAll()
  );

  const handleSubmit = async (data: any) => {
    if (!id) return;
    
    try {
      await invoiceService.update(id, {
        ...data,
        type: invoice?.type // Preserve the invoice type
      });
      toast.success("Invoice updated successfully");
      navigate("/invoices");
    } catch (error) {
      console.error("Failed to update invoice:", error);
      toast.error("Failed to update invoice");
    }
  };

  if (invoiceError || customersError) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900">
            {invoiceError ? "Invoice not found" : "Failed to load customers"}
          </h2>
          <p className="mt-2 text-gray-600">
            {invoiceError
              ? "The invoice you're trying to edit doesn't exist or you don't have access to it."
              : "Failed to load customer data. Please try again later."}
          </p>
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

  if (!invoice || !customers) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Edit Invoice #{invoice.number}</h1>
          <p className="text-gray-600 mt-1">
            Make changes to the invoice details below
          </p>
        </div>

        <InvoiceForm
          customers={customers}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/invoices")}
          isSubmitting={false}
          defaultValues={invoice}
        />
      </div>
    </AnimatedPage>
  );
}
