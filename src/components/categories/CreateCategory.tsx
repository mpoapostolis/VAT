import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useToast } from "@/lib/hooks/useToast";
import { motion } from "framer-motion";
import { Tag, FileText, Settings, Percent } from "lucide-react";
import { useForm } from "react-hook-form";
import { categoryService } from "@/lib/services/category-service";
import { Select } from "@/components/ui/select";

export function CreateCategory() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      type: "expense",
      vat: "24",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const category = await categoryService.create(data);
      addToast("Category created successfully", "success");
      navigate(`/categories/${category.id}`);
    } catch (error) {
      console.error("Failed to create category:", error);
      addToast("Failed to create category", "error");
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6   mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/categories")}
              className="inline-flex items-center justify-center h-9 px-3 text-sm font-medium text-gray-700 transition-colors bg-white border rounded-md hover:bg-gray-50 active:bg-gray-100"
            >
              <svg
                className="w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Categories
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden"
          >
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
              <h2 className="font-medium text-gray-800">Basic Information</h2>
              <p className="text-sm text-gray-500">
                Enter the category's basic details
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <FormItem>
                <FormLabel>
                  <Tag className="h-4 w-4 inline-block mr-2" />
                  <span>Category Name</span>
                </FormLabel>
                <Input
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  className="bg-white"
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <FileText className="h-4 w-4 inline-block mr-2" />
                  <span>Description</span>
                </FormLabel>
                <Textarea
                  {...register("description")}
                  className="bg-white resize-none"
                  placeholder="Enter category description"
                  rows={4}
                />
                {errors.description && (
                  <FormMessage>{errors.description.message}</FormMessage>
                )}
              </FormItem>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/categories")}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isSubmitting ? "Creating..." : "Create Category"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Additional Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden"
          >
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
              <h2 className="font-medium text-gray-800">Additional Settings</h2>
              <p className="text-sm text-gray-500">
                Configure category settings and preferences
              </p>
            </div>

            <div className="p-6 space-y-6">
              <FormItem>
                <FormLabel>
                  <Settings className="h-4 w-4 inline-block mr-2" />
                  <span>Category Type</span>
                </FormLabel>
                <Select
                  options={[
                    { value: "expense", label: "Expense" },
                    { value: "income", label: "Income" },
                  ]}
                  value={watch("type")}
                  onChange={(value) => setValue("type", value)}
                  error={!!errors.type}
                  className="bg-white"
                />{" "}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <Percent className="h-4 w-4 inline-block mr-2" />
                  <span>VAT Rate</span>
                </FormLabel>
                <Select
                  options={[
                    { value: "0", label: "0%" },
                    { value: "24", label: "24%" },
                    { value: "10", label: "10%" },
                  ]}
                  value={watch("vat")}
                  onChange={(value) => setValue("vat", value)}
                  error={!!errors.vat}
                  className="bg-white"
                />{" "}
              </FormItem>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
