import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { pb } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { VatReturnHeader } from "./vat-return-header";

import {
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  Calendar,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import useSWR from "swr";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { AnimatedPage } from "../AnimatedPage";

export function CreateVatReturn() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      salesVat: 0,
      purchasesVat: 0,
      status: "draft",
    },
  });

  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const salesVat = watch("salesVat", 0);
  const purchasesVat = watch("purchasesVat", 0);
  const netVat = (salesVat || 0) - (purchasesVat || 0);

  const { data: invoices } = useSWR(
    startDate && endDate ? ["invoices", startDate, endDate] : null,
    async () => {
      return await pb.collection("invoices").getList(1, 500, {
        sort: "-created",
        filter: `status = "paid" && date >= "${startDate}" && date <= "${endDate}"`,
      });
    }
  );

  const calculateVAT = () => {
    if (!startDate || !endDate) {
      addToast("Please select a date range first", "error");
      return;
    }

    if (!invoices?.items?.length) {
      addToast("No paid invoices found", "error");
      return;
    }

    const filteredInvoices = invoices.items;

    const salesTotal = filteredInvoices.reduce(
      (sum, invoice) => sum + (invoice.vat || 0),
      0
    );

    setValue("salesVat", salesTotal);

    const netAmount = salesTotal - purchasesVat;
    addToast(
      `VAT calculated from ${filteredInvoices.length} paid invoices`,
      "success"
    );
  };

  const onSubmit = async (data: any) => {
    try {
      await pb.collection("vat-returns").create(data);
      addToast("VAT return created successfully", "success");
      navigate("/vat-return");
    } catch (error) {
      addToast("Failed to create VAT return", "error");
    }
  };

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate("/vat-return")}
        className="border-gray-200 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        size="sm"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        Save Return
      </Button>
    </div>
  );

  return (
    <AnimatedPage>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-6xl mx-auto"
      >
        <VatReturnHeader mode="create" actions={headerActions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Period Info */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl p-6">
              <div className="flex w-full items-center justify-between mb-6">
                <div className="flex w-full items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="col-span-2 w-full">
                    <FormItem className="mb-0">
                      <div className="flex w-full items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <FormLabel className="text-sm font-medium text-gray-700">
                            Period
                          </FormLabel>
                        </div>
                        <Input
                          {...register("period", {
                            required: "Period is required",
                          })}
                          placeholder="e.g. Q1 2024"
                          className="w-40 text-right"
                        />
                        {errors.period && (
                          <FormMessage>{errors.period.message}</FormMessage>
                        )}
                      </div>
                    </FormItem>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <FormItem>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <FormLabel className="text-sm text-gray-600 mb-0">
                        Start Date
                      </FormLabel>
                    </div>
                    <Input
                      type="date"
                      {...register("startDate", {
                        required: "Start date is required",
                      })}
                      className="w-40"
                    />
                  </div>
                  {errors.startDate && (
                    <FormMessage>{errors.startDate.message}</FormMessage>
                  )}
                </FormItem>

                <FormItem>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <FormLabel className="text-sm text-gray-600 mb-0">
                        End Date
                      </FormLabel>
                    </div>
                    <Input
                      type="date"
                      {...register("endDate", {
                        required: "End date is required",
                      })}
                      className="w-40"
                    />
                  </div>
                  {errors.endDate && (
                    <FormMessage>{errors.endDate.message}</FormMessage>
                  )}
                </FormItem>
              </div>
            </div>

            {/* Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6"
            >
              <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Notes</h3>
                </div>
                <Textarea
                  {...register("notes")}
                  placeholder="Add any notes or comments about this VAT return..."
                  className="min-h-[120px]"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* VAT Calculations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* VAT Summary */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Calculator className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">VAT Summary</h3>
                    <p className="text-sm text-gray-500">For new VAT return</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={calculateVAT}
                  size="sm"
                  className="text-blue-600 text-sm"
                >
                  <Calculator className="h-4 w-4 mr-2" />
                  Calculate
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ArrowUpRight className="h-5 w-5 text-green-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Sales VAT
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Total VAT charged on sales
                      </p>
                    </div>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("salesVat")}
                    className="text-right mt-3"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <ArrowDownRight className="h-5 w-5 text-red-600" />
                    <div>
                      <span className="text-sm font-medium text-gray-700">
                        Purchases VAT
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Total VAT paid on purchases
                      </p>
                    </div>
                  </div>
                  <Input
                    type="number"
                    step="0.01"
                    {...register("purchasesVat")}
                    className="text-right mt-3"
                  />
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-blue-900">
                      Net VAT
                    </h4>
                    <p className="text-xs text-blue-700">
                      Sales VAT - Purchases VAT
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-2xl font-bold ${
                        netVat >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(netVat)}
                    </span>
                    <p className="text-xs text-blue-700 mt-1">
                      {netVat >= 0 ? "To Pay" : "To Reclaim"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 flex items-center justify-end">
                <Calculator className="h-3 w-3 mr-1" />
                <span>
                  Calculated from{" "}
                  {startDate ? new Date(startDate).toLocaleDateString() : "..."}{" "}
                  to {endDate ? new Date(endDate).toLocaleDateString() : "..."}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </AnimatedPage>
  );
}
