import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Receipt, Calculator } from "lucide-react";
import { vatReturnService } from "@/lib/services/vat-return-service";
import { useToast } from "@/lib/hooks/useToast";
import { AnimatedPage } from "@/components/AnimatedPage";

type FormValues = {
  period: string;
  startDate: string;
  endDate: string;
  sales: number;
  salesVat: number;
  purchases: number;
  purchasesVat: number;
  notes?: string;
};

export function CreateVatReturn() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      await vatReturnService.create({
        ...data,
        status: "draft",
      });
      addToast("VAT return created successfully", "success");
      navigate("/vat-return");
    } catch (error) {
      addToast("Failed to create VAT return", "error");
    }
  };

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/vat-return")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to VAT Returns
            </Button>
          </div>
        </div>

        <div className="bg-white border border-black/10 rounded overflow-hidden">
          <div className="border-b border-black/10 bg-slate-50/50 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#F1F5F9]">
                <Receipt className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <h2 className="font-medium text-[#0F172A] text-lg">
                  Create New VAT Return
                </h2>
                <p className="text-sm text-[#64748B]">
                  Fill in the VAT return details below
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
            {/* Period Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#0F172A] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#3B82F6]" />
                Period Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">
                    Period
                  </label>
                  <Input
                    {...register("period", { required: "Period is required" })}
                    placeholder="e.g., Q1 2024"
                    error={errors.period?.message}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    {...register("startDate", {
                      required: "Start date is required",
                    })}
                    error={errors.startDate?.message}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">
                    End Date
                  </label>
                  <Input
                    type="date"
                    {...register("endDate", {
                      required: "End date is required",
                    })}
                    error={errors.endDate?.message}
                  />
                </div>
              </div>
            </div>

            {/* Sales Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#0F172A] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#3B82F6]" />
                Sales Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">
                    Total Sales
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("sales", {
                      required: "Sales amount is required",
                      min: { value: 0, message: "Sales cannot be negative" },
                    })}
                    placeholder="0.00"
                    error={errors.sales?.message}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">
                    Sales VAT
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("salesVat", {
                      required: "Sales VAT is required",
                      min: {
                        value: 0,
                        message: "Sales VAT cannot be negative",
                      },
                    })}
                    placeholder="0.00"
                    error={errors.salesVat?.message}
                  />
                </div>
              </div>
            </div>

            {/* Purchases Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#0F172A] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#3B82F6]" />
                Purchases Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">
                    Total Purchases
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("purchases", {
                      required: "Purchases amount is required",
                      min: {
                        value: 0,
                        message: "Purchases cannot be negative",
                      },
                    })}
                    placeholder="0.00"
                    error={errors.purchases?.message}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#0F172A]">
                    Purchases VAT
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("purchasesVat", {
                      required: "Purchases VAT is required",
                      min: {
                        value: 0,
                        message: "Purchases VAT cannot be negative",
                      },
                    })}
                    placeholder="0.00"
                    error={errors.purchasesVat?.message}
                  />
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-[#0F172A] flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#3B82F6]" />
                Additional Notes
              </h3>
              <Textarea
                {...register("notes")}
                placeholder="Add any additional notes..."
                className="h-32"
              />
            </div>

            <div className="flex justify-end space-x-4 pt-4">
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
      </motion.div>
    </AnimatedPage>
  );
}
