import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { InvoiceForm } from "./create/invoice-form";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";
import { companyService } from "@/lib/services/company";
import { useToast } from "@/lib/hooks/useToast";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { ArrowLeft } from "lucide-react";
import { FileText } from "lucide-react";

export function EditInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch invoice, companies and customers from PocketBase
  const { data: invoice, error: invoiceError } = useSWR(
    id ? `invoices/${id}` : null,
    () => invoiceService.getById(id!)
  );

  const { data: companiesData, error: companiesError } = useSWR(
    "companies",
    () => companyService.getList({ page: 1, perPage: 100, sort: "-created" })
  );

  const { data: customersData, error: customersError } = useSWR(
    "customers",
    () => customerService.getList({ page: 1, perPage: 100, sort: "-created" })
  );

  const handleSubmit = async (data: any) => {
    if (!id) return;

    try {
      setIsSubmitting(true);
      await invoiceService.update(id, data);
      addToast("Invoice updated successfully", "success");
      navigate("/invoices");
    } catch (error) {
      console.error("Failed to update invoice:", error);
      addToast("Failed to update invoice", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (invoiceError || companiesError || customersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            {invoiceError ? "Invoice Not Found" : "Failed to Load Data"}
          </h2>
          <p className="text-gray-600">
            {invoiceError
              ? "The invoice you're trying to edit doesn't exist or you don't have access to it."
              : companiesError
              ? "Failed to load companies"
              : "Failed to load customers"}
          </p>
        </div>
        <button
          onClick={() => navigate("/invoices")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Go back to invoices
        </button>
      </div>
    );
  }

  if (!invoice || !companiesData?.items || !customersData?.items) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-gray-50">
        <InvoiceForm
          companies={companiesData.items}
          customers={customersData.items}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/invoices")}
          isSubmitting={isSubmitting}
          defaultValues={invoice}
          mode="edit"
        />
      </div>
    </AnimatedPage>
  );
}
