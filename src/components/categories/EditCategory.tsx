import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import type { Category } from "@/lib/pocketbase";
import {
  Tag,
  FileText,
  ArrowUpDown,
  Percent,
  ChevronLeft,
  Calendar,
  Save,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { categoryService } from "@/lib/services/category-service";
import { toast } from "sonner";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const vatOptions = [
  { value: "0", label: "0%" },
  { value: "13", label: "13%" },
  { value: "24", label: "24%" },
];

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

export function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: category } = useSWR(id ? `categories/${id}` : null, () =>
    categoryService.getById(id!)
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      type: "expense",
      vat: "24",
    },
  });

  React.useEffect(() => {
    if (category) {
      setValue("name", category.name || "");
      setValue("description", category.description || "");
      setValue("type", category.type || "expense");
      setValue("vat", category.vat?.toString() || "24");
    }
  }, [category, setValue]);

  const onSubmit = async (data: any) => {
    if (!id) return;
    setIsSubmitting(true);

    try {
      await categoryService.update(id, data);
      toast.success("Category updated successfully");
      navigate(`/categories/${id}/view`);
    } catch (error: any) {
      console.error("Failed to update category:", error);
      toast.error(error?.message || "Failed to update category");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!category) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      </AnimatedPage>
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
          className="bg-white border border-black/5 rounded overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="border-b border-black/5 bg-slate-50/50 px-8 py-6">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(`/categories/${id}/view`)}>
                    <ChevronLeft className="w-4 h-4 text-slate-400" />
                  </button>

                  <div className="p-3 rounded bg-gradient-to-br from-blue-50 to-blue-100/80">
                    <Tag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-slate-900 text-xl mb-1">
                      Edit Category
                    </h2>
                    <div className="flex items-center gap-6 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>Created on {formatDate(category.created)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 font-medium mb-4">
                  <Tag className="w-4 h-4 text-slate-400" />
                  Basic Information
                </div>

                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <Input
                    {...register("name", {
                      required: "Category name is required",
                      minLength: {
                        value: 2,
                        message: "Category name must be at least 2 characters",
                      },
                      maxLength: {
                        value: 50,
                        message: "Category name must be at most 50 characters",
                      },
                    })}
                    className="bg-white"
                    placeholder="Enter category name"
                  />
                  {errors.name && (
                    <FormMessage>{errors.name.message}</FormMessage>
                  )}
                </FormItem>

                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    {...register("description")}
                    className="bg-white"
                    placeholder="Enter category description (optional)"
                    rows={4}
                  />
                  {errors.description && (
                    <FormMessage>{errors.description.message}</FormMessage>
                  )}
                </FormItem>
              </div>

              {/* Category Settings */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-slate-900 font-medium mb-4">
                  <ArrowUpDown className="w-4 h-4 text-slate-400" />
                  Category Settings
                </div>

                <FormItem>
                  <FormLabel>Category Type</FormLabel>
                  <Select
                    value={watch("type")}
                    onValueChange={(value) => setValue("type", value)}
                    options={typeOptions}
                    placeholder="Select category type"
                  />
                  {errors.type && (
                    <FormMessage>{errors.type.message}</FormMessage>
                  )}
                </FormItem>

                <FormItem>
                  <FormLabel>VAT Rate</FormLabel>
                  <Select
                    value={watch("vat")}
                    onValueChange={(value) => setValue("vat", value)}
                    options={vatOptions}
                    placeholder="Select VAT rate"
                  />
                  {errors.vat && (
                    <FormMessage>{errors.vat.message}</FormMessage>
                  )}
                </FormItem>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-6 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate(`/categories/${id}/view`)}
                className="hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="hover:bg-blue-600 transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatedPage>
  );
}
