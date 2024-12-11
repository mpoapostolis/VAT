import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { VatReturnList } from "@/components/vat-return/VatReturnList";
import { CreateVatReturn } from "@/components/vat-return/CreateVatReturn";
import { EditVatReturn } from "@/components/vat-return/EditVatReturn";
import { ViewVatReturn } from "@/components/vat-return/ViewVatReturn";
import { Plus } from "lucide-react";

export function VatReturn() {
  const navigate = useNavigate();
  return (
    <Routes>
      <Route
        index
        element={
          <AnimatedPage>
            <div className="space-y-6">
              <VatReturnList />
            </div>
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CreateVatReturn />} />
      <Route path="/:id" element={<ViewVatReturn />} />
      <Route path="/:id/edit" element={<EditVatReturn />} />
    </Routes>
  );
}
