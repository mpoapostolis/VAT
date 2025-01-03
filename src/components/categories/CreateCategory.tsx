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
import { Tag, FileText, ArrowUpDown, Percent } from "lucide-react";
import { useForm } from "react-hook-form";
import { categoryService } from "@/lib/services/category-service";
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
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const category = await categoryService.create(data);
      addToast("Category created successfully", "success");
      navigate(`/categories/${category.id}/view`);
    } catch (error: any) {
      console.error("Failed to create category:", error);
      addToast(error?.message || "Failed to create category", "error");
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6 mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A] tracking-tight">
              Create Category
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Add a new category for your invoices
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/categories")}
            className="gap-2"
          >
            <svg
              className="w-4 h-4"
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
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden"
        >
          <div className="border-b border-gray-200/60 bg-gray-50/50 px-6 py-4">
            <h2 className="font-medium text-gray-800">Category Details</h2>
            <p className="text-sm text-gray-500">
              Fill in the details for your new category
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
                {errors.type && (
                  <FormMessage>{errors.type.message}</FormMessage>
                )}
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
                onClick={() => navigate("/categories")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
