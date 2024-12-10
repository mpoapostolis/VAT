import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { InvoicesList } from "@/components/invoices/InvoicesList";
import { CreateInvoice } from "@/components/invoices/CreateInvoice";
import { ViewInvoice } from "@/components/invoices/ViewInvoice";
import { EditInvoice } from "@/components/invoices/EditInvoice";

export function Invoices() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <div className="space-y-6">
              <InvoicesList />
            </div>
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CreateInvoice />} />
      <Route path=":id" element={<ViewInvoice />} />
      <Route path=":id/edit" element={<EditInvoice />} />
    </Routes>
  );
}
