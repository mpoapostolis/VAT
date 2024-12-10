import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { motion } from "framer-motion";
import { AnimatedPage } from "@/components/AnimatedPage";
import { useToast } from "@/lib/hooks/useToast";
import type { Category } from "@/lib/pocketbase";
import { Tag, FileText, ArrowUpDown, Percent } from "lucide-react";
import { useForm } from "react-hook-form";
import { categoryService } from "@/lib/services/category-service";
import { CategoryHeader } from "./category-header";
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

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

const vatOptions = [
  { value: "0", label: "0%" },
  { value: "13", label: "13%" },
  { value: "24", label: "24%" },
];

export function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { data: category } = useSWR(
    id ? `categories/${id}` : null,
    () => categoryService.getById(id!)
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
      addToast("Category updated successfully", "success");
      navigate(`/categories/${id}/view`);
    } catch (error: any) {
      console.error("Failed to update category:", error);
      addToast(error?.message || "Failed to update category", "error");
    } finally {
      setIsSubmitting(false);
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
      <div className="min-h-screen bg-[#F8FAFC]">
        <CategoryHeader mode="edit" />

        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded-lg overflow-hidden"
          >
            <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
              <h2 className="font-medium text-gray-800">Category Details</h2>
              <p className="text-sm text-gray-500">
                Update the details for this category
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <FormItem>
                <FormLabel required>
                  <Tag className="h-4 w-4 inline-block mr-2" />
                  <span>Category Name</span>
                </FormLabel>
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
                {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
              </FormItem>

              <FormItem>
                <FormLabel>
                  <FileText className="h-4 w-4 inline-block mr-2" />
                  <span>Description</span>
                </FormLabel>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormItem>
                  <FormLabel required>
                    <ArrowUpDown className="h-4 w-4 inline-block mr-2" />
                    <span>Category Type</span>
                  </FormLabel>
                  <Select
                    value={watch("type")}
                    onValueChange={(value) => setValue("type", value)}
                    options={typeOptions}
                    placeholder="Select category type"
                  />
                  {errors.type && <FormMessage>{errors.type.message}</FormMessage>}
                </FormItem>

                <FormItem>
                  <FormLabel required>
                    <Percent className="h-4 w-4 inline-block mr-2" />
                    <span>VAT Rate</span>
                  </FormLabel>
                  <Select
                    value={watch("vat")}
                    onValueChange={(value) => setValue("vat", value)}
                    options={vatOptions}
                    placeholder="Select VAT rate"
                  />
                  {errors.vat && <FormMessage>{errors.vat.message}</FormMessage>}
                </FormItem>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/categories/${id}/view`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
