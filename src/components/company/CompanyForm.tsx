import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Eye, Edit } from "lucide-react";
import { CompanyForm } from "./company-form";
import { Button } from "../ui/button";
import useSWR from "swr";
import { companyService } from "../../lib/services/company";
import { AnimatedPage } from "../AnimatedPage";
import { motion } from "framer-motion";

export function CompanyFormPage({ mode = "view" }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: company } = useSWR(id ? `company/${id}` : null, () =>
    id ? companyService.getById(id) : null
  );

  const handleSuccess = () => {
    navigate("/companies");
  };

  const headerActions = (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        onClick={() => navigate("/companies")}
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6">
            <CompanyForm company={company} onSuccess={handleSuccess} />
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
