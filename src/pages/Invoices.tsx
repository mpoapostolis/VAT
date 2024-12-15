import React from "react";
import { Routes, Route } from "react-router-dom";
import { CreateInvoice } from "@/components/invoices/CreateInvoice";
import { EditInvoice } from "@/components/invoices/EditInvoice";
import { ViewInvoice } from "@/components/invoices/ViewInvoice";
import { InvoicesListingTabs } from "@/components/invoices/InvoicesListingTabs";

export function Invoices() {
  return (
    <Routes>
      <Route path="/" element={<InvoicesListingTabs />} />
      <Route path="/new" element={<CreateInvoice />} />
      <Route path="/:id" element={<ViewInvoice />} />
      <Route path="/:id/edit" element={<EditInvoice />} />
      <Route path="/:id/view" element={<ViewInvoice />} />
    </Routes>
  );
}
