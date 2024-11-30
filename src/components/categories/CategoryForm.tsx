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
import { Dropdown } from "../ui/Dropdown";

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

const VAT_RATE_OPTIONS = [
  { value: "STANDARD", label: "Standard Rate (20%)" },
  { value: "REDUCED", label: "Reduced Rate (5%)" },
  { value: "ZERO", label: "Zero Rate (0%)" },
  { value: "EXEMPT", label: "VAT Exempt" },
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
        {/* Name and Type Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full h-10 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              placeholder="Enter category name"
            />
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {errors.name.message}
              </motion.p>
            )}
          </div>

          {/* Type Field */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <Dropdown
              value={watch("type")}
              onChange={(value) => {
                register("type").onChange(value);
              }}
              options={TYPE_OPTIONS}
              className="w-full"
            />
            {errors.type && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm text-red-600 dark:text-red-400"
              >
                {errors.type.message}
              </motion.p>
            )}
          </div>
        </div>

        {/* Parent Category and VAT Rate Row */}
        <div className="grid grid-cols-2 gap-6">
          {/* Parent Category Field */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Parent Category
            </label>
            <select
              {...register("parentId")}
              className="w-full h-10 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
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

          {/* VAT Rate Field */}
          <div className="col-span-2 sm:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              VAT Rate
            </label>
            <Dropdown
              value={watch("vatRate")}
              onChange={(value) => {
                register("vatRate").onChange(value);
              }}
              options={VAT_RATE_OPTIONS}
              className="w-full"
            />
          </div>
        </div>

        {/* Logistics Type Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Logistics Type
          </label>
          <Controller
            name="logisticsType"
            control={control}
            rules={{ required: "Logistics type is required" }}
            render={({ field }) => (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {LOGISTICS_TYPES.map(({ type, label, emoji }) => (
                  <motion.button
                    key={type}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => field.onChange(type)}
                    className={`flex items-center justify-center p-3 rounded-lg border ${
                      field.value === type
                        ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-400 dark:hover:border-indigo-500"
                    }`}
                  >
                    <span className="text-xl mr-2">{emoji}</span>
                    <span className="text-sm">{label}</span>
                  </motion.button>
                ))}
              </div>
            )}
          />
          {errors.logisticsType && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-600 dark:text-red-400"
            >
              {errors.logisticsType.message}
            </motion.p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <textarea
            {...register("description")}
            rows={3}
            className="w-full text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Enter category description"
          />
        </div>

        {/* Tags and Color Row */}
        {/* Tags Field */}
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Tags
          </label>
          <input
            {...register("tags")}
            className="w-full h-10 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
            placeholder="Enter tags separated by commas"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
