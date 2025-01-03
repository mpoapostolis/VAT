import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import useSWR from "swr";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import {
  Calculator,
  Edit,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardList,
  Calendar,
  FileText,
  ArrowLeft,
  Receipt,
  CreditCard,
  Building2,
  Clock,
  BadgeEuro,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
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

  if (isLoading || !vatReturn) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const netVat = (vatReturn.salesVat || 0) - (vatReturn.purchasesVat || 0);

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
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/vat-return/${id}/edit`)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit VAT Return
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
                  VAT Return for {vatReturn.period}
                </h2>
                <div className="flex items-center gap-2 text-sm text-[#64748B]">
                  <Clock className="w-4 h-4" />
                  <span>Created on {formatDate(vatReturn.created)}</span>
                  <span
                    className={`ml-2 px-2 py-0.5 text-xs font-medium rounded-full ${
                      vatReturn.status === "draft"
                        ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
                        : "bg-green-50 text-green-800 border border-green-200"
                    }`}
                  >
                    {vatReturn.status.charAt(0).toUpperCase() +
                      vatReturn.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-8">
            {/* Sales Information */}
            <div>
              <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4 text-[#3B82F6]" />
                Sales Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Total Sales
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {formatCurrency(vatReturn.sales || 0)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <BadgeEuro className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Sales VAT
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {formatCurrency(vatReturn.salesVat || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchases Information */}
            <div>
              <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                <ArrowDownRight className="w-4 h-4 text-[#3B82F6]" />
                Purchases Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <CreditCard className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Total Purchases
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {formatCurrency(vatReturn.purchases || 0)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-[#F1F5F9]">
                    <BadgeEuro className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[#0F172A]">
                      Purchases VAT
                    </div>
                    <div className="text-sm text-[#64748B]">
                      {formatCurrency(vatReturn.purchasesVat || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Net VAT */}
            <div>
              <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#3B82F6]" />
                Net VAT
              </h3>
              <div className="bg-[#F8FAFC] border border-black/5 rounded p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-[#0F172A]">
                    Amount to Pay
                  </div>
                  <div
                    className={`text-lg font-semibold ${
                      netVat >= 0 ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(Math.abs(netVat))}
                    <span className="text-sm ml-1">
                      {netVat >= 0 ? "Payable" : "Refundable"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes */}
            {vatReturn.notes && (
              <div>
                <h3 className="text-sm font-medium text-[#0F172A] mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#3B82F6]" />
                  Additional Notes
                </h3>
                <div className="bg-[#F8FAFC] border border-black/5 rounded p-4">
                  <div className="text-sm text-[#64748B] whitespace-pre-wrap">
                    {vatReturn.notes}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}
