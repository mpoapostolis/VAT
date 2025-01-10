import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Select } from "@/components/ui/select";
import { AnimatedPage } from "../AnimatedPage";

const vatReturnSchema = z.object({
  period: z.string().min(1, "Period is required"),
  startDate: z.date(),
  endDate: z.date(),
  vatDue: z.number().min(0, "VAT due must be a positive number"),
  salesExVat: z.number().min(0, "Sales ex VAT must be a positive number"),
  purchasesExVat: z.number().min(0, "Purchases ex VAT must be a positive number"),
  vatOnSales: z.number().min(0, "VAT on sales must be a positive number"),
  vatOnPurchases: z.number().min(0, "VAT on purchases must be a positive number"),
  notes: z.string().optional(),
});

type VatReturnFormData = z.infer<typeof vatReturnSchema>;

interface VatReturnFormProps {
  initialData?: VatReturnFormData;
  isEditing?: boolean;
}

export function VatReturnForm({ initialData, isEditing }: VatReturnFormProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const duplicateId = searchParams.get("duplicate");

  useEffect(() => {
    if (duplicateId) {
      console.log("Duplicating VAT return:", duplicateId);
    }
  }, [duplicateId]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<VatReturnFormData>({
    resolver: zodResolver(vatReturnSchema),
    defaultValues: initialData || {
      period: "",
      startDate: new Date(),
      endDate: new Date(),
      vatDue: 0,
      salesExVat: 0,
      purchasesExVat: 0,
      vatOnSales: 0,
      vatOnPurchases: 0,
      notes: "",
    },
  });

  const onSubmit = async (data: VatReturnFormData) => {
    try {
      // TODO: Implement submission logic
      navigate("/vat-returns");
    } catch (error) {
      console.error("Error submitting VAT return:", error);
    }
  };

  const currentYear = new Date().getFullYear();
  const periods = [
    { label: `Q1 ${currentYear}`, value: `Q1 ${currentYear}` },
    { label: `Q2 ${currentYear}`, value: `Q2 ${currentYear}` },
    { label: `Q3 ${currentYear}`, value: `Q3 ${currentYear}` },
    { label: `Q4 ${currentYear}`, value: `Q4 ${currentYear}` },
  ];

  return (
    <AnimatedPage>
      <div className={cn(
        // Layout
        "flex flex-col gap-4 p-4",
        // Typography
        "text-xs",
        // Visual
        "bg-white"
      )}>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/vat-returns")}
            className={cn(
              // Typography
              "text-xs",
              // Visual
              "bg-transparent",
              // States
              "hover:bg-gray-50"
            )}
            aria-label="Go back to VAT returns"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xs font-medium text-gray-900">
            {isEditing ? "Edit VAT Return" : "New VAT Return"}
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Card className={cn(
            // Layout
            "p-4",
            // Visual
            "bg-white shadow-sm",
            // Typography
            "text-xs"
          )}>
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600" htmlFor="period">Period</label>
                  <Select
                    id="period"
                    {...register("period")}
                    error={errors.period?.message}
                    options={periods}
                    aria-invalid={!!errors.period}
                    aria-describedby={errors.period ? "period-error" : undefined}
                  />
                  {errors.period && (
                    <span id="period-error" className="text-xs text-rose-500">
                      {errors.period.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600" htmlFor="startDate">Start Date</label>
                  <DatePicker
                    id="startDate"
                    value={watch("startDate")}
                    onChange={(date) => setValue("startDate", date)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600" htmlFor="endDate">End Date</label>
                  <DatePicker
                    id="endDate"
                    value={watch("endDate")}
                    onChange={(date) => setValue("endDate", date)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600" htmlFor="salesExVat">Sales (ex VAT)</label>
                  <Input
                    id="salesExVat"
                    type="number"
                    step="0.01"
                    className="text-xs"
                    {...register("salesExVat", { valueAsNumber: true })}
                    error={errors.salesExVat?.message}
                    aria-invalid={!!errors.salesExVat}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600" htmlFor="vatOnSales">VAT on Sales</label>
                  <Input
                    id="vatOnSales"
                    type="number"
                    step="0.01"
                    className="text-xs"
                    {...register("vatOnSales", { valueAsNumber: true })}
                    error={errors.vatOnSales?.message}
                    aria-invalid={!!errors.vatOnSales}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600" htmlFor="purchasesExVat">Purchases (ex VAT)</label>
                  <Input
                    id="purchasesExVat"
                    type="number"
                    step="0.01"
                    className="text-xs"
                    {...register("purchasesExVat", { valueAsNumber: true })}
                    error={errors.purchasesExVat?.message}
                    aria-invalid={!!errors.purchasesExVat}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600" htmlFor="vatOnPurchases">VAT on Purchases</label>
                  <Input
                    id="vatOnPurchases"
                    type="number"
                    step="0.01"
                    className="text-xs"
                    {...register("vatOnPurchases", { valueAsNumber: true })}
                    error={errors.vatOnPurchases?.message}
                    aria-invalid={!!errors.vatOnPurchases}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-600" htmlFor="notes">Notes</label>
                <Input
                  id="notes"
                  {...register("notes")}
                  error={errors.notes?.message}
                  placeholder="Add any additional notes..."
                  className="text-xs"
                  aria-invalid={!!errors.notes}
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate("/vat-returns")}
              className={cn(
                // Typography
                "text-xs",
                // Visual
                "bg-transparent",
                // States
                "hover:bg-gray-50"
              )}
              aria-label="Cancel and go back"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                // Typography
                "text-xs",
                // Visual
                "bg-blue-600",
                // States
                "hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-2",
                // Disabled state
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              aria-label={isSubmitting ? "Saving VAT return..." : "Save VAT return"}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save VAT Return
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AnimatedPage>
  );
