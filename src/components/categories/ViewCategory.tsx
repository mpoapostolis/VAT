import React from "react";
import { useParams } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { categoryService } from "@/lib/services/category-service";
import type { Category } from "@/lib/pocketbase";
import { CategoryHeader } from "./category-header";
import { Tag, FileText, Calendar, BarChart } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function ViewCategory() {
  const { id } = useParams();
  const { data: category } = useSWR<Category>(
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
    <AnimatedPage>
      <div className="space-y-6 max-w-6xl mx-auto">
        <CategoryHeader mode="view" />

        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            {/* Basic Information */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
                <h2 className="font-medium text-gray-800">Basic Information</h2>
                <p className="text-sm text-gray-500">Category details and metadata</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start space-x-3">
                  <Tag className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">Category Name</div>
                  </div>
                </div>

                {category.description && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900 whitespace-pre-wrap">
                        {category.description}
                      </div>
                      <div className="text-sm text-gray-500">Description</div>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(category.created)}
                    </div>
                    <div className="text-sm text-gray-500">Created Date</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-xl overflow-hidden">
              <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
                <h2 className="font-medium text-gray-800">Statistics</h2>
                <p className="text-sm text-gray-500">Usage and performance metrics</p>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-start space-x-3">
                  <BarChart className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Coming Soon</div>
                    <div className="text-sm text-gray-500">Category Statistics</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
