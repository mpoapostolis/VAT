import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { Category } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { categoryService } from "@/lib/services/category-service";
import { ArrowLeft, Edit, Download, EyeIcon, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategoryHeaderProps {
  mode?: "view" | "edit";
  onDownload?: () => void;
}

export function CategoryHeader({
  mode = "view",
  onDownload,
}: CategoryHeaderProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: category } = useSWR<Category>(
    id ? `categories/${id}` : null,
    () => categoryService.getById(id!)
  );

  if (!category) {
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
                mode === "view"
                  ? `/categories/${id}/edit`
                  : `/categories/${id}/view`
              )
            }
            className="border-gray-200 hover:bg-gray-50"
          >
            {mode === "view" && <Edit className="w-4 h-4 mr-1.5" />}
            {mode === "edit" && <EyeIcon className="w-4 h-4 mr-1.5" />}
            {mode === "view" ? "Edit Category" : "View Category"}
          </Button>
        </div>
      </div>

      <div className="mt-6"></div>
    </motion.div>
  );
}
