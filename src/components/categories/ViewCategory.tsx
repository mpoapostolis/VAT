import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { categoryService } from "@/lib/services/category-service";
import type { Category } from "@/lib/pocketbase";
import { Button } from "@/components/ui/button";
import { 
  Tag, 
  FileText, 
  BarChart, 
  CreditCard, 
  Receipt, 
  ArrowUpDown, 
  Percent,
  Edit3,
  Clock,
  Euro,
  ChevronLeft,
  Trash2
} from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

export function ViewCategory() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { data: category } = useSWR(
    id ? `categories/${id}` : null,
    () => categoryService.getById(id!)
  );

  const { data: stats } = useSWR(
    id ? `categories/${id}/stats` : null,
    () => categoryService.getStats(id!)
  );

  const handleDelete = async () => {
    if (!category || !id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete category "${category.name}"? This action cannot be undone.`
    );

    if (confirmed) {
      try {
        await categoryService.delete(id);
        toast.success("Category deleted successfully");
        navigate("/categories");
      } catch (error) {
        console.error("Failed to delete category:", error);
        toast.error("Failed to delete category");
      }
    }
  };

  if (!category) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <AnimatedPage>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-[1200px] mx-auto px-6"
      >
        <motion.div
          variants={itemVariants}
          className="bg-white border border-black/5 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="border-b border-black/5 bg-slate-50/50 px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate("/categories")}>
                <ChevronLeft className="w-4 h-4 text-slate-400" />
              </button>

              <div className="p-3 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/80">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900 text-xl mb-1">
                  {category.name}
                </h2>
                <div className="flex items-center gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <span>Created on {formatDate(category.created)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="w-4 h-4 text-slate-400" />
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                        category.type === "income"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {category.type}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/categories/${id}/edit`)}
                className="hover:bg-slate-50 transition-colors w-[140px] rounded-full"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Category
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="hover:bg-red-600 transition-colors w-[140px] rounded-full"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Statistics */}
            <div>
              <h3 className="text-sm font-medium text-slate-900 mb-6 flex items-center gap-2">
                <BarChart className="w-4 h-4 text-blue-600" />
                Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <Receipt className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Total Invoices</div>
                    <div className="text-xl font-semibold text-slate-900 mt-1">
                      {stats?.invoiceCount || 0}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <Euro className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Total Amount</div>
                    <div className="text-xl font-semibold text-slate-900 mt-1">
                      {formatCurrency(stats?.totalAmount || 0)}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-50">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Average Amount</div>
                    <div className="text-xl font-semibold text-slate-900 mt-1">
                      {formatCurrency(stats?.averageAmount || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {category.description && (
              <div>
                <h3 className="text-sm font-medium text-slate-900 mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Description
                </h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="text-sm text-slate-600 whitespace-pre-wrap">
                    {category.description}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
