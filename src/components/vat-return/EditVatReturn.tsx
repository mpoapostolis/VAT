import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Calendar,
  Calculator,
  FileText,
  DollarSign,
  ClipboardList,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { pb } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { formatCurrency } from "@/lib/utils";
import useSWR from "swr";
import { motion } from "framer-motion";
import { VatReturnHeader } from "./vat-return-header";
import { set } from "date-fns";

export function EditVatReturn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: vatReturn, mutate } = useSWR(`vat-returns/${id}`);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: vatReturn,
  });

  const startDate = watch("startDate", vatReturn?.startDate);
  const endDate = watch("endDate", vatReturn?.endDate);
  const salesVat = watch("salesVat", vatReturn?.salesVat || 0);
  const purchasesVat = watch("purchasesVat", vatReturn?.purchasesVat || 0);
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
      await pb.collection("vat-returns").update(id!, data);
      addToast("VAT return updated successfully", "success");
      navigate("/vat-return");
    } catch (error) {
      addToast("Failed to update VAT return", "error");
    }
  };

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate("/vat-return/" + id)}
        className="border-gray-200 hover:bg-gray-50"
      >
        View
      </Button>
      <Button
        size="sm"
        onClick={handleSubmit(onSubmit)}
        disabled={isSubmitting}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );

  if (!vatReturn) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 max-w-6xl mx-auto"
      >
        <VatReturnHeader mode="edit" actions={headerActions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Period Info */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl p-6">
              <div className="flex w-full items-center justify-between mb-6">
                <div className="flex w-full items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="col-span-2 w-full ">
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
                      defaultValue={vatReturn.startDate}
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
                      defaultValue={vatReturn.endDate}
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
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Notes</h3>
              </div>
              <textarea
                {...register("notes")}
                className="w-full h-32 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any notes or comments here..."
              />
            </div>
          </motion.div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
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
                    <p className="text-sm text-gray-500">
                      For period {vatReturn.period}
                    </p>
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
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60">
                  <div className="flex items-center justify-between">
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
                      {...register("salesVat", {
                        required: "Sales VAT is required",
                        min: 0,
                      })}
                      defaultValue={vatReturn.salesVat}
                      className="w-40 text-right font-bold"
                    />
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/60">
                  <div className="flex items-center justify-between">
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
                      {...register("purchasesVat", {
                        required: "Purchases VAT is required",
                        min: 0,
                      })}
                      defaultValue={vatReturn.purchasesVat}
                      className="w-40 text-right font-bold"
                    />
                  </div>
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
                      className={`text-xl font-bold ${
                        netVat >= 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(netVat)}
                    </span>
                    <p className="text-xs text-blue-700 mt-1">
                      {netVat >= 0 ? "Amount to pay" : "Amount to reclaim"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 flex items-center justify-end">
                <Calculator className="h-3 w-3 mr-1" />
                <span>
                  Calculated from {new Date(startDate).toLocaleDateString()} to{" "}
                  {new Date(endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </form>
    </AnimatedPage>
  );
}
