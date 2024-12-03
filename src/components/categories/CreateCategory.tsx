import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { categoryService } from "@/lib/services/category-service";
import { useToast } from "@/lib/hooks/useToast";
import type { Category } from "@/lib/pocketbase";

type CategoryFormData = Omit<Category, "id" | "transactions" | "amount">;

const typeOptions = [
  { value: "income", label: "Income" },
  { value: "expense", label: "Expense" },
];

export function CreateCategory() {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>();

  const onSubmit = async (data: CategoryFormData) => {
    try {
      await categoryService.create(data);
      addToast("Category created successfully", "success");
      navigate("/categories");
    } catch (error) {
      console.error("Failed to create category:", error);
      addToast("Failed to create category", "error");
    }
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/categories")}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              New Category
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Create a new transaction category
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <Input
                  {...register("name", {
                    required: "Category name is required",
                  })}
                  placeholder="Enter category name"
                />
                {errors.name && (
                  <FormMessage>{errors.name.message}</FormMessage>
                )}
              </FormItem>

              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  options={typeOptions}
                  placeholder="Select type"
                  onChange={(value) =>
                    setValue("type", value as "income" | "expense")
                  }
                  error={!!errors.type}
                />
                {errors.type && (
                  <FormMessage>{errors.type.message}</FormMessage>
                )}
              </FormItem>
            </div>

            <FormItem>
              <FormLabel>Description</FormLabel>
              <Input
                {...register("description", {
                  required: "Description is required",
                })}
                placeholder="Enter category description"
              />
              {errors.description && (
                <FormMessage>{errors.description.message}</FormMessage>
              )}
            </FormItem>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
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
        </div>
      </div>
    </AnimatedPage>
  );
}
