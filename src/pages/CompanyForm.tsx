import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Eye, Edit } from 'lucide-react';
import { CompanyForm } from '../components/company/company-form';
import { Button } from '../components/ui/button';
import useSWR from 'swr';
import { companyService } from '../lib/services/company';
import { AnimatedPage } from '../components/AnimatedPage';
import { motion } from 'framer-motion';

export function CompanyFormPage({ mode = 'view' }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: company } = useSWR(
    id ? `company/${id}` : null,
    () => id ? companyService.getById(id) : null
  );

  const handleSuccess = () => {
    navigate('/companies');
  };

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        onClick={() => navigate('/companies')}
        className="border-gray-200 hover:bg-gray-50"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        form="company-form"
        className="bg-[#0066FF] hover:bg-blue-600"
      >
        Save Changes
      </Button>
    </div>
  );

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/companies')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>

            {headerActions}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl overflow-hidden"
        >
          <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
            <h2 className="font-medium text-gray-800">Company Details</h2>
            <p className="text-sm text-gray-500">
              Basic information about the company
            </p>
          </div>

          <div className="p-6">
            <CompanyForm company={company} onSuccess={handleSuccess} />
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
