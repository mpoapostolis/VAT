import { InvoiceForm } from "@/components/payables/invoice-form";
import { InvoiceList } from "@/components/payables/invoice-list";
import { InvoiceView } from "@/components/payables/invoice-view";
import { Routes, Route } from "react-router-dom";

export function Payables() {
  return (
    <Routes>
      <Route path="/" element={<InvoiceList />} />
      <Route path="new" element={<InvoiceForm />} />
      <Route path=":id" element={<InvoiceView />} />
      <Route path=":id/edit" element={<InvoiceForm />} />
    </Routes>
  );
}
