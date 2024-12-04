import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";

interface VatReturnHeaderProps {
  mode: "create" | "edit" | "view";
  actions?: React.ReactNode;
}

export function VatReturnHeader({ mode, actions }: VatReturnHeaderProps) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between"
    >
      <div className="flex items-center space-x-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/vat-return")}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {actions && <div className="flex items-center space-x-3">{actions}</div>}
    </motion.div>
  );
}
