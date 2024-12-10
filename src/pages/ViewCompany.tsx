import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { Company } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { CompanyHeader } from "@/components/company/company-header";
import { CompanyDetails } from "@/components/company/company-details";
import { companyService } from "@/lib/services/company";
import html2pdf from "html2pdf.js";

export function ViewCompany() {
  const { id } = useParams();
  const { addToast } = useToast();
  const companyRef = useRef<HTMLDivElement>(null);

  const { data: company } = useSWR<Company>(
    id ? `companies/${id}` : null,
    () => companyService.getById(id!)
  );

  const handleDownload = async () => {
    if (!companyRef.current || !company) return;

    const element = companyRef.current;
    const opt = {
      margin: [10, 10],
      filename: `company-${company.companyNameEn}.pdf`,
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

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto space-y-6"
    >
      <CompanyHeader mode="view" onDownload={handleDownload} />
      <div ref={companyRef}>
        <CompanyDetails company={company} />
      </div>
    </motion.div>
  );
}
