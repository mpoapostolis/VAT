import { useNavigate, useParams } from "react-router-dom";
import { CompanyForm } from "./company-form";
import useSWR from "swr";
import { companyService } from "../../lib/services/company";
import { AnimatedPage } from "../AnimatedPage";
import { motion } from "framer-motion";

export function CompanyFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: company } = useSWR(id ? `company/${id}` : null, () =>
    id ? companyService.getById(id) : null
  );

  const handleSuccess = () => {
    navigate("/companies");
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CompanyForm company={company} onSuccess={handleSuccess} />
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
