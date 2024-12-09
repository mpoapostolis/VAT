import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { AnimatedPage } from "@/components/AnimatedPage";
import { InvoiceHeader } from "./invoice-header";
import { InvoiceForm } from "./create/invoice-form";
import type { Invoice, Customer } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";

export function EditInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: invoice } = useSWR(id ? `invoices/${id}` : null, () =>
    invoiceService.getById(id!)
  );

  const { data: customersData } = useSWR<{ items: Customer[] }>(
    "customers",
    () => customerService.getAll()
  );

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: Partial<Invoice>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await invoiceService.update(id, data);
      addToast("Invoice updated successfully", "success");
      navigate("/invoices");
    } catch (error) {
      addToast("Failed to update invoice", "error");
      setIsSubmitting(false);
    }
  };

  console.log(invoice, customersData);

  if (!invoice || !customersData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="  mx-auto">
      <InvoiceHeader mode="edit" />

      <div className="my-6"></div>

      <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded p-6">
        <InvoiceForm
          customers={customersData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          onCancel={() => navigate("/invoices")}
          defaultValues={invoice}
        />
      </div>
    </div>
  );
}
