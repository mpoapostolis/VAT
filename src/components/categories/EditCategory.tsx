import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
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
import type { Category } from "@/lib/pocketbase";
import { motion } from "framer-motion";
import { Tag, FileText, CreditCard } from "lucide-react";
import { CategoryHeader } from "./category-header";
import { useForm } from "react-hook-form";
import { categoryService } from "@/lib/services/category-service";
import { Select } from "@/components/ui/select";

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { data: category } = useSWR<Category>(
    id ? `categories/${id}` : null,
    () => categoryService.getById(id!)
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    if (!id) return;

    try {
      await categoryService.update(id, data);
      addToast("Category updated successfully", "success");
      navigate(`/categories`);
    } catch (error) {
      console.error("Failed to update category:", error);
      addToast("Failed to update category", "error");
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
      <div className="space-y-6   mx-auto">
        <CategoryHeader mode="edit" />

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
                Basic information about the category
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
                  defaultValue={category.name}
                  className="bg-white"
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <CreditCard className="h-4 w-4 inline-block mr-2" />
                  <span>Type</span>
                </FormLabel>
                <Select
                  options={typeOptions}
                  value={category.type}
                  onChange={(value) => setValue("type", value)}
                  error={!!errors.type}
                  className="bg-white"
                />
                {errors.type && (
                  <FormMessage>{errors.type.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <FileText className="h-4 w-4 inline-block mr-2" />
                  <span>Description</span>
                </FormLabel>
                <Textarea
                  {...register("description")}
                  defaultValue={category.description}
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
                  onClick={() => navigate(`/categories/${id}`)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>

          {/* Additional Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden"
          >
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
              <h2 className="font-medium text-gray-800">Additional Settings</h2>
              <p className="text-sm text-gray-500">
                Optional settings and configurations
              </p>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-500">
                More settings will be available soon.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
