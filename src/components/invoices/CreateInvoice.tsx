import React from "react";
import { useNavigate } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { InvoiceForm } from "./create/invoice-form";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";
import useSWR from "swr";

export function CreateInvoice() {
  const navigate = useNavigate();
  const { data: customers } = useSWR("customers", () =>
    customerService.getAll().then((res) => res.items)
  );

  const handleSuccess = () => {
    navigate("/invoices");
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <InvoiceForm
          customers={customers || []}
          onSubmit={invoiceService.create}
          onCancel={() => navigate("/invoices")}
          isSubmitting={false}
        />
      </div>
    </AnimatedPage>
  );
}
