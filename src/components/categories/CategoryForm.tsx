import React from "react";
import { useAtom } from "jotai";
import { useForm, Controller } from "react-hook-form";
import { categoryFormAtom } from "@/lib/state/atoms";
import { AccountingCategory, LogisticsCategoryType } from "@/types";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { useCategories } from "@/lib/hooks/useCategories";
import {
  TagIcon,
  ArrowUpIcon,
  DocumentTextIcon,
  SwatchIcon,
  CurrencyDollarIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";

interface CategoryFormProps {
  onSubmit: (data: Partial<AccountingCategory>) => Promise<void>;
  initialData?: AccountingCategory;
  onCancel: () => void;
}

const LOGISTICS_TYPES: {
  type: LogisticsCategoryType;
  label: string;
  emoji: string;
}[] = [
  { type: "TRANSPORTATION", label: "Transportation", emoji: "🚛" },
  { type: "WAREHOUSING", label: "Warehousing", emoji: "🏭" },
  { type: "FREIGHT", label: "Freight", emoji: "🚢" },
  { type: "CUSTOMS", label: "Customs", emoji: "📋" },
  { type: "PACKAGING", label: "Packaging", emoji: "📦" },
  { type: "HANDLING", label: "Handling", emoji: "🔧" },
  { type: "DISTRIBUTION", label: "Distribution", emoji: "🚚" },
  { type: "OTHER", label: "Other", emoji: "📝" },
];

const TYPE_OPTIONS = [
  { value: "REVENUE", label: "Revenue" },
  { value: "EXPENSE", label: "Expense" },
];

export function CategoryForm({
  onSubmit,
  initialData,
  onCancel,
}: CategoryFormProps) {
  const [formData, setFormData] = useAtom(categoryFormAtom);
  const { categories } = useCategories();

  const defaultValues = initialData
    ? {
        ...initialData,
        tags: initialData.metadata?.tags?.join(", ") || "",
      }
    : formData;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues,
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
          tags:
            data.tags
              ?.split(",")
              .map((t: string) => t.trim())
              .filter(Boolean) || [],
          notes: data.notes,
        },
      });
      setFormData({}); // Reset form after successful submission
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
            <CurrencyDollarIcon className="h-4 w-4 mr-2" />
            Type
          </label>
          <select
            {...register("type", { required: "Type is required" })}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
          >
            <option value="">Select type...</option>
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.type.message}
            </motion.p>
          )}
        </div>

        {/* Logistics Type Field */}
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Logistics Type
          </label>
          <Controller
            name="logisticsType"
            control={control}
            rules={{ required: "Logistics type is required" }}
            render={({ field }) => (
              <div className=" flex flex-wrap gap-4">
                {LOGISTICS_TYPES.map(({ type, label, emoji }) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => field.onChange(type)}
                    className={`flex  items-center text-xs justify-center p-2 rounded-lg border ${
                      field.value === type
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500"
                    }`}
                  >
                    <span className="mr-2 text-xl">{emoji}</span>
                    {label}
                  </motion.button>
                ))}
              </div>
            )}
          />
          {errors.logisticsType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-sm text-red-600 dark:text-red-400"
            >
              {errors.logisticsType.message}
            </motion.p>
          )}
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
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Saving...
            </span>
          ) : initialData ? (
            "Update Category"
          ) : (
            "Create Category"
          )}
        </motion.button>
      </div>
    </form>
  );
}
