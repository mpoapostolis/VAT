import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Loader2, Calculator, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useParams } from "react-router-dom";
import { useVatReturn } from "@/lib/hooks/useVatReturn";
import { useInvoices } from "@/lib/hooks/useInvoices";

const vatReturnSchema = z.object({
  period: z.string().min(1, "Period is required"),
  startDate: z.date(),
  endDate: z.date(),
  vatDue: z.number().min(0, "VAT due must be a positive number"),
  salesExVat: z.number().min(0, "Sales ex VAT must be a positive number"),
  purchasesExVat: z
    .number()
    .min(0, "Purchases ex VAT must be a positive number"),
  vatOnSales: z.number().min(0, "VAT on sales must be a positive number"),
  vatOnPurchases: z
    .number()
    .min(0, "VAT on purchases must be a positive number"),
  notes: z.string().optional(),
});

type VatReturnFormData = z.infer<typeof vatReturnSchema>;

export function VatReturnForm() {
  const currentYear = new Date().getFullYear();
  const id = useParams<{ id: string }>().id;
  const periods = [
    { label: `Q1 ${currentYear}`, value: `Q1 ${currentYear}` },
    { label: `Q2 ${currentYear}`, value: `Q2 ${currentYear}` },
    { label: `Q3 ${currentYear}`, value: `Q3 ${currentYear}` },
    { label: `Q4 ${currentYear}`, value: `Q4 ${currentYear}` },
  ];

  const { data: vatReturn } = useVatReturn(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<VatReturnFormData>({
    resolver: zodResolver(vatReturnSchema),
    defaultValues: vatReturn || {
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
  const from = watch("startDate").toString();
  const to = watch("endDate").toString();
  const { invoices } = useInvoices({
    from,
    to,
    status: "paid",
  });
  console.log(invoices);
  const onSubmit = async (data: VatReturnFormData) => {
    try {
      // TODO: Implement submission logic
      onSuccess();
    } catch (error) {
      console.error("Error submitting VAT return:", error);
    }
  };

  return (
    <form
      id="vat-return-form"
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="bg-white border border-black/10 shadow-sm overflow-hidden">
        <div className="p-4 md:p-8 space-y-6 md:space-y-8">
          {/* Period Information */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="p-2 bg-blue-50">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xs font-medium text-gray-900">
                Period Information
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Period
                </FormLabel>
                <Select
                  options={periods}
                  value={watch("period")}
                  onChange={(value) => setValue("period", value)}
                  error={!!errors.period}
                  className="xl"
                />
                <FormMessage>{errors.period?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Start Date
                </FormLabel>
                <Input
                  type="date"
                  {...register("startDate")}
                  className="xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.startDate?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  End Date
                </FormLabel>
                <Input
                  type="date"
                  {...register("endDate")}
                  className="xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.endDate?.message}</FormMessage>
              </FormItem>
            </div>
          </div>

          {/* Financial Information */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="p-2 bg-blue-50">
                <Calculator className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xs font-medium text-gray-900">
                Financial Information
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Sales (ex VAT)
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("salesExVat", { valueAsNumber: true })}
                  className="xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.salesExVat?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  VAT on Sales
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("vatOnSales", { valueAsNumber: true })}
                  className="xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.vatOnSales?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  Purchases (ex VAT)
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("purchasesExVat", { valueAsNumber: true })}
                  className="xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.purchasesExVat?.message}</FormMessage>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700 font-medium">
                  VAT on Purchases
                </FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  {...register("vatOnPurchases", { valueAsNumber: true })}
                  className="xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
                <FormMessage>{errors.vatOnPurchases?.message}</FormMessage>
              </FormItem>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-6">
              <div className="p-2 bg-blue-50">
                <FileText className="h-5 w-5 text-blue-500" />
              </div>
              <h2 className="text-xs font-medium text-gray-900">
                Additional Information
              </h2>
            </div>

            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Notes</FormLabel>
              <Input
                {...register("notes")}
                className="xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Add any additional notes..."
              />
              <FormMessage>{errors.notes?.message}</FormMessage>
            </FormItem>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 text-xs bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save VAT Return
        </Button>
      </div>
    </form>
  );
}
