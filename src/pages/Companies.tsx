import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { Plus } from "lucide-react";
import { companyService } from "../lib/services/company";
import { Button } from "../components/ui/button";
import { CompanyForm } from "../components/company/company-form";
import { CompanyList } from "../components/company/company-list";
import { AnimatedPage } from "../components/AnimatedPage";
import { CompanyFormPage } from "./CompanyForm";
import { DetailPage } from "@/components/ui/page-templates";

export function Companies() {
  const navigate = useNavigate();
  const {
    data: response,
    error,
    mutate,
  } = useSWR("companies/1/30", companyService.getCompanies);

  const handleSuccess = () => {
    navigate("/companies");
    mutate();
  };

  if (error) {
    return <div>Failed to load companies</div>;
  }

  if (!response) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route
        index
        element={
          <AnimatedPage>
            <DetailPage
              title="Company Details"
              subtitle="Company details and registration information"
              backTo="/companies"
            >
              asasd
            </DetailPage>
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CompanyFormPage />} />
      <Route path=":id/edit" element={<CompanyFormPage />} />
    </Routes>
  );
}
