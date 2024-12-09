import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useSWR from "swr";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { VatReturnHeader } from "./vat-return-header";
import {
  Calculator,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  Calendar,
  FileText,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { vatReturnService } from "@/lib/services/vat-return-service";
import { useToast } from "@/lib/hooks/useToast";
import type { VatReturn } from "@/lib/pocketbase";

export function ViewVatReturn() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { data: vatReturn, isLoading } = useSWR<VatReturn>(
    id ? `vat-returns/${id}` : null,
    () => vatReturnService.getById(id!)
  );

  const handleDownload = async () => {
    try {
      // Implement download logic here
      addToast("VAT return downloaded successfully", "success");
    } catch (error) {
      addToast("Failed to download VAT return", "error");
    }
  };

  if (isLoading || !vatReturn) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const netVat = (vatReturn.salesVat || 0) - (vatReturn.purchasesVat || 0);

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        size="sm"
        variant="outline"
        onClick={() => navigate(`/vat-return/${id}/edit`)}
      >
        <Edit className="h-4 w-4 mr-2" />
        Edit
      </Button>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="space-y-6   mx-auto">
        <VatReturnHeader mode="view" actions={headerActions} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Period Info */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded p-6">
              <div className="flex w-full items-center justify-between mb-6">
                <div className="flex w-full items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded">
                    <ClipboardList className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {vatReturn.period}
                    </h3>
                    <p className="text-sm text-gray-500">Tax Period</p>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 text-xs font-medium rounded-full ${
                    vatReturn.status === "draft"
                      ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                      : "bg-green-50 text-green-800 border border-green-200"
                  }`}
                >
                  {vatReturn.status.charAt(0).toUpperCase() +
                    vatReturn.status.slice(1)}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Start Date</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(vatReturn.startDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">End Date</span>
                  </div>
                  <span className="text-sm font-medium">
                    {new Date(vatReturn.endDate).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Last Updated</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {new Date(vatReturn.updated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {vatReturn.notes && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-6"
              >
                <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-blue-50 rounded">
                      <ClipboardList className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Notes</h3>
                  </div>
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {vatReturn.notes}
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* VAT Calculations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* VAT Summary */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-blue-50 rounded">
                  <Calculator className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">VAT Summary</h3>
                  <p className="text-sm text-gray-500">
                    For period {vatReturn.period}
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ArrowUpRight className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Sales VAT
                      </span>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      {formatCurrency(vatReturn.salesVat)}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <ArrowDownRight className="h-5 w-5 text-red-600" />
                      <span className="text-sm font-medium text-gray-700">
                        Purchases VAT
                      </span>
                    </div>
                    <span className="text-base font-bold text-gray-900">
                      {formatCurrency(vatReturn.purchasesVat)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-blue-50 rounded border border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-blue-600">
                      Net VAT
                    </span>
                    <p className="text-sm text-blue-600/70">
                      {netVat >= 0 ? "Amount to pay" : "Amount to reclaim"}
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
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 flex items-center justify-end">
                <Calculator className="h-3 w-3 mr-1" />
                <span>
                  Calculated from{" "}
                  {new Date(vatReturn.startDate).toLocaleDateString()} to{" "}
                  {new Date(vatReturn.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
