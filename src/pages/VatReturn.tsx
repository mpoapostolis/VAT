import { Routes, Route } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { VatReturnList } from "@/components/vat-returns/vat-return-list";
import { VatReturnForm } from "@/components/vat-returns/vat-return-form";

export function VatReturn() {
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
      <Route path="new" element={<VatReturnForm />} />
      <Route path=":id/edit" element={<VatReturnForm />} />
    </Routes>
  );
}
