import React, { useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Calendar,
  CreditCard,
} from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { customerService } from "@/lib/services/customer-service";
import { formatDate } from "@/lib/utils";
import type { Customer } from "@/lib/pocketbase";
import { motion } from "framer-motion";
import { CustomerHeader } from "./customer-header";
import html2pdf from "html2pdf.js";
import { useToast } from "@/lib/hooks/useToast";

export function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const customerRef = useRef<HTMLDivElement>(null);

  const { data: customer } = useSWR<Customer>(
    id ? `customers/${id}` : null,
    () => customerService.getById(id!)
  );

  const handleDownload = async () => {
    if (!customerRef.current || !customer) return;

    const element = customerRef.current;
    const opt = {
      margin: [10, 10],
      filename: `customer-${customer.name}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      addToast("Generating PDF...", "info");
      await html2pdf().set(opt).from(element).save();
      addToast("PDF downloaded successfully", "success");
    } catch (error) {
      addToast("Failed to generate PDF", "error");
      console.error("PDF generation error:", error);
    }
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <div className="space-y-6   mx-auto">
        <CustomerHeader mode="view" onDownload={handleDownload} />

        <div ref={customerRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Basic Information */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden">
              <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
                <h2 className="font-medium text-gray-800">Basic Information</h2>
                <p className="text-sm text-gray-500">
                  Customer details and contact information
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start space-x-3">
                  <Building2 className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {customer.name}
                    </div>
                    <div className="text-sm text-gray-500">Company Name</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {customer.email}
                    </div>
                    <div className="text-sm text-gray-500">Email Address</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {customer.phone}
                    </div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CreditCard className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {customer.trn}
                    </div>
                    <div className="text-sm text-gray-500">
                      Tax Registration Number
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden">
              <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
                <h2 className="font-medium text-gray-800">
                  Additional Information
                </h2>
                <p className="text-sm text-gray-500">
                  Address and other details
                </p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900 whitespace-pre-wrap">
                      {customer.address}
                    </div>
                    <div className="text-sm text-gray-500">
                      Business Address
                    </div>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(customer.created)}
                    </div>
                    <div className="text-sm text-gray-500">Customer Since</div>
                  </div>
                </div>

                {customer.notes && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 whitespace-pre-wrap">
                        {customer.notes}
                      </div>
                      <div className="text-sm text-gray-500">
                        Additional Notes
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
