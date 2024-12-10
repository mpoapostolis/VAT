import { Link } from "react-router-dom";
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import type { Category } from "@/lib/pocketbase";
import { useToast } from "@/lib/hooks/useToast";
import { categoryService } from "@/lib/services/category-service";
import { ArrowLeft, Edit, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

interface CategoryHeaderProps {
  mode?: "view" | "edit";
}

export function CategoryHeader({ mode = "view" }: CategoryHeaderProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: category } = useSWR(
    id ? `categories/${id}` : null,
    () => categoryService.getById(id!)
  );

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-black/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/categories")}
              className="flex items-center gap-2 text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Categories
            </button>

            <div className="flex items-center gap-4">
              <h1 className="text-lg font-medium text-[#0F172A]">
                {category.name}
              </h1>
              <div
                className={clsx(
                  "px-2.5 py-0.5 rounded-md text-xs font-medium",
                  {
                    "bg-[#DCFCE7] text-[#10B981]":
                      category.type === "income",
                    "bg-[#FEE2E2] text-[#EF4444]":
                      category.type === "expense",
                  }
                )}
              >
                {category.type}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === "view" ? (
              <Button
                variant="outline"
                onClick={() => navigate(`/categories/${id}/edit`)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={() => navigate(`/categories/${id}/view`)}
                className="gap-2"
              >
                <EyeIcon className="w-4 h-4" />
                View
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
