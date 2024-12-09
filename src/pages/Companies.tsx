import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { companyService } from '../lib/services/company';
import { Button } from '../components/ui/button';
import { CompanyForm } from '../components/company/company-form';
import { CompanyList } from '../components/company/company-list';
import { AnimatedPage } from '../components/AnimatedPage';
import { CompanyFormPage } from './CompanyForm';

export function Companies() {
  const navigate = useNavigate();
  const { data: response, error, mutate } = useSWR('companies/1/30', companyService.getCompanies);

  const handleSuccess = () => {
    navigate('/companies');
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
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">
                    Companies
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your company profiles
                  </p>
                </div>
                <Button size="sm" onClick={() => navigate('new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Company
                </Button>
              </div>
              <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
                <CompanyList companies={response.items || []} onRefresh={() => mutate()} />
              </div>
            </div>
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CompanyFormPage />} />
      <Route path=":id/edit" element={<CompanyFormPage />} />
    </Routes>
  );
}
