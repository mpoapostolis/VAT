import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { Customer } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { customerService } from "@/lib/services/customer-service";
import {
  ArrowLeft,
  Edit,
  Download,
  CircleDot,
  ChevronDown,
  EyeIcon,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface CustomerHeaderProps {
  mode?: "view" | "edit";
  onDownload?: () => void;
}

export function CustomerHeader({
  mode = "view",
  onDownload,
}: CustomerHeaderProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: customer } = useSWR<Customer>(
    id ? `customers/${id}` : null,
    () => customerService.getById(id!)
  );

  const [showStatusMenu, setShowStatusMenu] = useState(false);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!customer || !id) return;
    try {
      await customerService.update(id, { status: newStatus });
      addToast(`Customer status updated to ${newStatus}`, "success");
    } catch (error) {
      addToast("Failed to update customer status", "error");
    }
  };

  const handleDownload = async () => {
    onDownload?.();
  };

  if (!customer) {
    return (
      <div className="flex items-center justify-center min-h-[100px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between">
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

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate(
                mode === "view" ? `/customers/${id}/edit` : `/customers/${id}`
              )
            }
            className="border-gray-200 hover:bg-gray-50"
          >
            {mode === "view" && <Edit className="w-4 h-4 mr-1.5" />}
            {mode === "edit" && <EyeIcon className="w-4 h-4 mr-1.5" />}
            {mode === "view" ? "Edit Customer" : "View Customer"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
