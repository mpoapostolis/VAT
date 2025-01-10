import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Tag, Receipt, Percent } from "lucide-react";
import { FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCategories } from "@/lib/hooks/useCategories";
import { useNavigate, useParams } from "react-router-dom";
import { pb } from "@/lib/pocketbase";
import { toast } from "sonner";

interface CategoryFormProps {
  onSuccess?: () => void;
  mode?: "view" | "edit";
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  vatRate: z.number().min(0).max(100),
  isActive: z.boolean().default(true),
  type: z.enum(["income", "expense"]),
});

type FormData = z.infer<typeof schema>;

export function CategoryForm({ onSuccess, mode = "edit" }: CategoryFormProps) {
  const { categories } = useCategories();
  const { id } = useParams();
  const navigate = useNavigate();
  const category = categories?.find((c) => c.id === id);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      vatRate: 5,
      isActive: true,
      type: "income",
      ...category,
    },
  });

  useEffect(() => {
    if (category) {
      reset(category);
    }
  }, [category, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      if (id && id !== "new") {
        await pb.collection("categories").update(id, data);
        toast.success("Category updated successfully");
      } else {
        await pb.collection("categories").create({
          ...data,
          userId: pb.authStore.model?.id,
        });
        toast.success("Category created successfully");
        reset();
      }
      onSuccess?.();
      navigate("/categories");
    } catch (error) {
      console.error("Error submitting category:", error);
      toast.error("Failed to save category");
    }
  };

  const typeOptions = [
    { value: "income", label: "Income" },
    { value: "expense", label: "Expense" },
  ];

  return (
    <form
      id="category-form"
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white  border border-black/10 shadow-sm overflow-hidden"
    >
      <div className="p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Basic Information */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-6">
            <div className="p-2 bg-blue-50  lg">
              <Tag className="h-5 w-5 text-blue-500" />
            </div>
            <h2 className="text-xs font-medium text-gray-900">
              Basic Information
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Name</FormLabel>
              <Input
                {...register("name")}
                placeholder="Category name"
                disabled={mode === "view"}
                className=" xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && <FormMessage>{errors.name.message}</FormMessage>}
            </FormItem>

            <FormItem>
              <FormLabel className="text-gray-700 font-medium">Type</FormLabel>
              <Select
                options={typeOptions}
                value={watch("type")}
                onChange={(value) => setValue("type", value)}
                disabled={mode === "view"}
                error={!!errors.type}
                className=" xl"
              />
              {errors.type && <FormMessage>{errors.type.message}</FormMessage>}
            </FormItem>

            <FormItem className="col-span-1 lg:col-span-2">
              <FormLabel className="text-gray-700 font-medium">
                Description
              </FormLabel>
              <Input
                {...register("description")}
                placeholder="Category description"
                disabled={mode === "view"}
                className=" xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.description && (
                <FormMessage>{errors.description.message}</FormMessage>
              )}
            </FormItem>
          </div>
        </div>

        {/* VAT Settings */}
        <div className="space-y-4 md:space-y-6">
          <div className="flex items-center space-x-3 mb-4 md:mb-6">
            <div className="p-2 bg-green-50  lg">
              <Percent className="h-5 w-5 text-green-500" />
            </div>
            <h2 className="text-xs font-medium text-gray-900">VAT Settings</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <FormItem>
              <FormLabel className="text-gray-700 font-medium">
                VAT Rate (%)
              </FormLabel>
              <Input
                type="number"
                {...register("vatRate", { valueAsNumber: true })}
                placeholder="5"
                disabled={mode === "view"}
                className=" xl border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.vatRate && (
                <FormMessage>{errors.vatRate.message}</FormMessage>
              )}
            </FormItem>

            <FormItem className="flex flex-row items-start space-x-3 space-y-0  border p-4">
              <div className="flex h-4 items-center">
                <Checkbox
                  {...register("isActive")}
                  disabled={mode === "view"}
                  className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                />
              </div>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-gray-700 font-medium">
                  Active
                </FormLabel>
                <p className="text-xs text-gray-500">
                  Inactive categories won't appear in selection lists
                </p>
              </div>
            </FormItem>
          </div>
        </div>
      </div>

      {mode === "edit" && (
        <div className="px-4 md:px-8 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/categories")}
            disabled={isSubmitting}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[100px] bg-blue-500 hover:bg-blue-600"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {id && id !== "new" ? "Update" : "Create"} Category
          </Button>
        </div>
      )}
    </form>
  );
}
