import React from "react";
import { useAtom } from "jotai";
import { useForm, Controller } from "react-hook-form";
import { categoryFormAtom } from "@/lib/state/atoms";
import { AccountingCategory, LogisticsCategoryType } from "@/types";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useCategories } from "@/lib/hooks/useCategories";
import {
  FolderIcon,
  TagIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  SwatchIcon,
  TruckIcon,
  CurrencyDollarIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";

interface CategoryFormProps {
  onSubmit: (data: Partial<AccountingCategory>) => Promise<void>;
  initialData?: AccountingCategory;
}

const LOGISTICS_TYPES: {
  type: LogisticsCategoryType;
  label: string;
  icon: string;
}[] = [
  { type: "TRANSPORTATION", label: "Transportation", icon: "🚛" },
  { type: "WAREHOUSING", label: "Warehousing", icon: "🏭" },
  { type: "FREIGHT", label: "Freight", icon: "🚢" },
  { type: "CUSTOMS", label: "Customs", icon: "📋" },
  { type: "PACKAGING", label: "Packaging", icon: "📦" },
  { type: "HANDLING", label: "Handling", icon: "🔧" },
  { type: "DISTRIBUTION", label: "Distribution", icon: "🚚" },
  { type: "OTHER", label: "Other", icon: "📝" },
];

export function CategoryForm({ onSubmit, initialData }: CategoryFormProps) {
  const [formData, setFormData] = useAtom(categoryFormAtom);
  const { categories } = useCategories();
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || formData,
  });

  const selectedType = watch("type");
  const selectedParentId = watch("parentId");
  const selectedLogisticsType = watch("logisticsType");

  const availableParentCategories = categories.filter(
    (c) =>
      c.id !== initialData?.id &&
      (!selectedParentId ||
        !categories.some(
          (pc) => pc.parentId === initialData?.id && pc.id === selectedParentId
        ))
  );

  const handleFormSubmit = async (data: any) => {
    try {
      await onSubmit({
        ...data,
        isActive: true,
        metadata: {
          tags: data.tags?.split(",").map((t: string) => t.trim()) || [],
          notes: data.notes,
        },
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save category");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-6">
        {/* Name Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <TagIcon className="h-4 w-4 mr-2" />
            Name
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Enter category name"
          />
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Type Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FolderIcon className="h-4 w-4 mr-2" />
            Type
          </label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-4">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => field.onChange("REVENUE")}
                  className={`flex items-center justify-center p-4 rounded-lg border ${
                    field.value === "REVENUE"
                      ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-green-400 dark:hover:border-green-500"
                  }`}
                >
                  <ArrowUpIcon className="h-5 w-5 mr-2" />
                  Revenue
                </motion.button>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => field.onChange("EXPENSE")}
                  className={`flex items-center justify-center p-4 rounded-lg border ${
                    field.value === "EXPENSE"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300"
                      : "border-gray-200 dark:border-gray-700 hover:border-red-400 dark:hover:border-red-500"
                  }`}
                >
                  <ArrowUpIcon className="h-5 w-5 mr-2 rotate-180" />
                  Expense
                </motion.button>
              </div>
            )}
          />
        </div>

        {/* Logistics Type Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <TruckIcon className="h-4 w-4 mr-2" />
            Logistics Type
          </label>
          <Controller
            name="logisticsType"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {LOGISTICS_TYPES.map(({ type, label, icon }) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => field.onChange(type)}
                    className={`flex items-center text-xs justify-center p-4 rounded-lg border ${
                      field.value === type
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500"
                    }`}
                  >
                    <span className="mr-2">{icon}</span>
                    {label}
                  </motion.button>
                ))}
              </div>
            )}
          />
        </div>

        {/* VAT Rate Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            VAT Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            {...register("vatRate")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Enter VAT rate (e.g., 24)"
          />
        </div>

        {/* Parent Category Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <ArrowUpIcon className="h-4 w-4 mr-2" />
            Parent Category (Optional)
          </label>
          <select
            {...register("parentId")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          >
            <option value="">None</option>
            {availableParentCategories
              .filter((c) => c.type === selectedType)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </div>

        {/* Description Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <DocumentTextIcon className="h-4 w-4 mr-2" />
            Description (Optional)
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Enter category description"
          />
        </div>

        {/* Tags Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <HashtagIcon className="h-4 w-4 mr-2" />
            Tags (Optional)
          </label>
          <input
            {...register("tags")}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Enter tags separated by commas (e.g., international, express, ground)"
          />
        </div>

        {/* Color Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <SwatchIcon className="h-4 w-4 mr-2" />
            Color
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="color"
              {...register("color")}
              className="h-10 w-20 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer"
            />
            <input
              type="text"
              {...register("color")}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          {initialData ? "Update Category" : "Create Category"}
        </motion.button>
      </div>
    </form>
  );
}
