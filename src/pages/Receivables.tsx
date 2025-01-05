import { InvoiceForm } from "@/components/receivables/invoice-form";
import { InvoiceList } from "@/components/receivables/invoice-list";
import { InvoiceView } from "@/components/receivables/invoice-view";
import { Routes, Route } from "react-router-dom";

export function Receivables() {
  return (
    <Routes>
      <Route path="/" element={<InvoiceList />} />
      <Route path="new" element={<InvoiceForm />} />
      <Route path=":id" element={<InvoiceView />} />
      <Route path=":id/edit" element={<InvoiceForm />} />
    </Routes>
  );
}
