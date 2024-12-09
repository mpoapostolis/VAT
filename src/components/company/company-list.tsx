import { useState } from 'react';
import type { Company } from '../../types/company';
import { companyService } from '../../lib/services/company';
import { Dialog } from '../ui/dialog';
import { CompanyForm } from './company-form';
import { Button } from '../ui/button';
import { Pencil, Trash2 } from 'lucide-react';

interface CompanyListProps {
  companies: Company[];
  onRefresh: () => void;
}

export function CompanyList({ companies, onRefresh }: CompanyListProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this company?')) {
      return;
    }

    try {
      await companyService.delete(id);
      onRefresh();
    } catch (error) {
      console.error('Failed to delete company:', error);
    }
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedCompany(null);
    onRefresh();
  };

  if (companies.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No companies found. Add your first company to get started.
      </div>
    );
  }

  return (
    <>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Emirate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                VAT Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {companies.map((company) => (
              <tr key={company.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{company.companyNameEn}</div>
                  <div className="text-sm text-gray-500">{company.companyNameAr}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.tradeLicenseNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.primaryBusinessType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.emirate}
                  {company.freeZone && (
                    <div className="text-xs text-gray-400">{company.freeZone}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {company.defaultVatRate}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(company)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => company.id && handleDelete(company.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        title="Edit Company"
      >
        {selectedCompany && (
          <CompanyForm 
            company={selectedCompany} 
            onSuccess={handleEditSuccess} 
          />
        )}
      </Dialog>
    </>
  );
}
