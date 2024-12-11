import React from "react";
import { Routes, Route } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { CompanyList } from "@/components/company/company-list";
import { CompanyFormPage } from "../components/company/CompanyForm";

export function Companies() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <div className="space-y-6">
              <CompanyList />
            </div>
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CompanyFormPage />} />

      <Route path=":id" element={<CompanyFormPage mode="view" />} />
      <Route path=":id/edit" element={<CompanyFormPage mode="edit" />} />
    </Routes>
  );
}
