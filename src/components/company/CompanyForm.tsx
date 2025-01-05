import { useNavigate, useParams } from "react-router-dom";
import { CompanyForm } from "./company-form";
import { AnimatedPage } from "../AnimatedPage";
import { motion } from "framer-motion";

export function CompanyFormPage() {
  const navigate = useNavigate();

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
          <CompanyForm onSuccess={handleSuccess} />
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
