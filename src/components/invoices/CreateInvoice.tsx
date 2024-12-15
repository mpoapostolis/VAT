import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { InvoiceForm } from "./create/invoice-form";
import { invoiceService } from "@/lib/services/invoice-service";
import { customerService } from "@/lib/services/customer-service";
import useSWR from "swr";

export function CreateInvoice() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type") as "receivable" | "payable" || "receivable";
  
  const { data: customers } = useSWR("customers", () =>
    customerService.getAll().then((res) => res.items)
  );

  const handleSubmit = async (data: any) => {
    await invoiceService.create({ ...data, type });
    navigate("/invoices");
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <InvoiceForm
          customers={customers || []}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/invoices")}
          isSubmitting={false}
          defaultValues={{ type }}
        />
      </div>
    </AnimatedPage>
  );
}
