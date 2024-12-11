import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatedPage } from "../../components/AnimatedPage";
import { InvoiceForm } from "./create/invoice-form";
import { invoiceService } from "../../lib/services/invoice-service";
import { customerService } from "../../lib/services/customer-service";
import useSWR from "swr";

export function EditInvoice() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: invoice } = useSWR(id ? `invoices/${id}` : null, () =>
    invoiceService.getById(id!)
  );
  const { data: customers } = useSWR("customers", () =>
    customerService.getAll().then((res) => res.items)
  );

  const handleSuccess = () => {
    navigate("/invoices");
  };

  if (!invoice) {
    return null;
  }

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <InvoiceForm
          customers={customers || []}
          onSubmit={(data) => invoiceService.update(id!, data)}
          onCancel={() => navigate("/invoices")}
          isSubmitting={false}
          defaultValues={invoice}
        />
      </div>
    </AnimatedPage>
  );
}
