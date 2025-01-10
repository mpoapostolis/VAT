import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AnimatedPage } from "../AnimatedPage";
import { VatReturnForm } from "./vat-return-form";

export function VatReturnFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get("duplicate");
  const id = searchParams.get("id");

  const handleSuccess = () => {
    navigate("/vat-returns");
  };

  return (
    <AnimatedPage>
      <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vat-returns")}
            className="text-xs"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xs font-medium text-gray-900">
            {id ? "Edit VAT Return" : "New VAT Return"}
          </h1>
        </div>

        <VatReturnForm onSuccess={handleSuccess} mode={id ? "edit" : "view"} />
      </div>
    </AnimatedPage>
  );
}
