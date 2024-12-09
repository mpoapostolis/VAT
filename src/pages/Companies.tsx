import { useState } from 'react';
import useSWR from 'swr';
import { Plus } from 'lucide-react';
import { companyService } from '../lib/services/company';
import { Button } from '../components/ui/button';
import { CompanyForm } from '../components/company/company-form';
import { CompanyList } from '../components/company/company-list';
import { Dialog } from '../components/ui/dialog';

export function Companies() {
  const [isOpen, setIsOpen] = useState(false);
  const { data, error, mutate } = useSWR('companies/1/30', companyService.getCompanies);

  const handleSuccess = () => {
    setIsOpen(false);
    mutate();
  };

  if (error) {
    return <div>Failed to load companies</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Companies</h1>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Company
        </Button>
      </div>

      <CompanyList companies={data.items} onRefresh={() => mutate()} />

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Add New Company"
      >
        <CompanyForm onSuccess={handleSuccess} />
      </Dialog>
    </div>
  );
}
