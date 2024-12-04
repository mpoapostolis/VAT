import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { vatReturnService } from "@/lib/services/vat-return-service";
import { useToast } from "@/lib/hooks/useToast";
import { formatCurrency } from "@/lib/utils";

interface VatReturnFormData {
  period: string;
  startDate: string;
  endDate: string;
  salesVat: number;
  purchasesVat: number;
  notes?: string;
}

export function CreateVatReturn() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<VatReturnFormData>();

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const salesVat = watch("salesVat", 0);
  const purchasesVat = watch("purchasesVat", 0);
  const netVat = (salesVat || 0) - (purchasesVat || 0);

  const calculateVatTotals = async () => {
    if (!startDate || !endDate) {
      addToast("Please select both start and end dates", "error");
      return;
    }

    try {
      const totals = await vatReturnService.calculateVatTotals(
        startDate,
        endDate
      );
      setValue("salesVat", totals.salesVat);
      setValue("purchasesVat", totals.purchasesVat);
    } catch (error) {
      addToast("Failed to calculate VAT totals", "error");
    }
  };

  const onSubmit = async (data: VatReturnFormData) => {
    try {
      await vatReturnService.create({
        ...data,
        status: "draft",
        netVAT: netVat,
      });
      addToast("VAT return created successfully", "success");
      navigate("/vat-return");
    } catch (error) {
      addToast("Failed to create VAT return", "error");
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/vat-return")}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              New VAT Return
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Prepare a new VAT return
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <FormItem>
                <FormLabel>Period</FormLabel>
                <Input
                  {...register("period", { required: "Period is required" })}
                  placeholder="e.g., Q1 2024"
                />
                {errors.period && (
                  <FormMessage>{errors.period.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <Input
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                />
                {errors.startDate && (
                  <FormMessage>{errors.startDate.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>End Date</FormLabel>
                <Input
                  type="date"
                  {...register("endDate", { required: "End date is required" })}
                />
                {errors.endDate && (
                  <FormMessage>{errors.endDate.message}</FormMessage>
                )}
              </FormItem>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={calculateVatTotals}
                className="text-[#0066FF]"
              >
                Calculate from Invoices
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Sales VAT</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("salesVat", {
                    required: "Sales VAT is required",
                    min: 0,
                  })}
                  placeholder="Enter sales VAT amount"
                />
                {errors.salesVat && (
                  <FormMessage>{errors.salesVat.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Purchases VAT</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("purchasesVat", {
                    required: "Purchases VAT is required",
                    min: 0,
                  })}
                  placeholder="Enter purchases VAT amount"
                />
                {errors.purchasesVat && (
                  <FormMessage>{errors.purchasesVat.message}</FormMessage>
                )}
              </FormItem>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Net VAT</span>
                <span
                  className={`text-lg font-bold ${
                    netVat >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatCurrency(netVat)}
                </span>
              </div>
            </div>

            <FormItem>
              <FormLabel>Notes</FormLabel>
              <textarea
                {...register("notes")}
                className="w-full h-24 border border-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent resize-none"
                placeholder="Enter any additional notes"
              />
            </FormItem>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/vat-return")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create VAT Return"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
}
