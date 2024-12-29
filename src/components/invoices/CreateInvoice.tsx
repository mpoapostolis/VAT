import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { InvoiceForm } from "./create/invoice-form";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";
import { companyService } from "@/lib/services/company";
import { useToast } from "@/lib/hooks/useToast";
import useSWR from "swr";
import { Loader2 } from "lucide-react";

export function CreateInvoice() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Fetch companies and customers from PocketBase
  const { data: companiesData, error: companiesError } = useSWR(
    "companies",
    async () => {
      const data = await companyService.getList({ page: 1, perPage: 100, sort: "-created" });
      console.log("Companies data:", data);
      return data;
    }
  );

  const { data: customersData, error: customersError } = useSWR(
    "customers",
    () => customerService.getList({ page: 1, perPage: 100, sort: "-created" })
  );

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      await invoiceService.create(data);
      addToast("Invoice created successfully", "success");
      navigate("/invoices");
    } catch (error) {
      console.error("Failed to create invoice:", error);
      addToast("Failed to create invoice", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (companiesError || customersError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold text-gray-900">
            Failed to Load Data
          </h2>
          <p className="text-gray-600">
            {companiesError
              ? "Failed to load companies"
              : "Failed to load customers"}
          </p>
        </div>
        <button
          onClick={() => navigate("/invoices")}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go back to invoices
        </button>
      </div>
    );
  }

  if (!companiesData?.items || !customersData?.items) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  console.log("Companies items:", companiesData.items);

  return (
    <AnimatedPage>
      <InvoiceForm
        companies={companiesData.items}
        customers={customersData.items}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/invoices")}
        isSubmitting={isSubmitting}
      />
    </AnimatedPage>
  );
}
