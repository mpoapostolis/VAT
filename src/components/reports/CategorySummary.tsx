import React from "react";
import { motion } from "framer-motion";
import { useInvoices } from "@/lib/hooks/useInvoices";
import { useCategories } from "@/lib/hooks/useCategories";
import { calculateCategoryTotals } from "@/lib/utils/category-utils";
import { formatCurrency } from "@/lib/utils";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
} from "@heroicons/react/24/solid";

interface Category {
  name: string;
  value: number;
  percentage: number;
  trend: "up" | "down" | "neutral";
}

interface Props {
  data: Category[];
}

export function CategorySummary() {
  const { invoices } = useInvoices();
  const { categories } = useCategories();

  const categoryTotals = calculateCategoryTotals(invoices, categories);
  const data = categoryTotals.map((total) => ({
    name: categories.find((c) => c.id === total.categoryId)?.name || "Unknown",
    value: total.total,
    percentage:
      (total.total /
        categoryTotals.reduce((acc, curr) => acc + curr.total, 0)) *
      100,
    trend: total.total > 0 ? "up" : total.total < 0 ? "down" : "neutral",
  }));

  const getGradient = (index: number) => {
    const gradients = [
      "from-violet-500 to-violet-600",
      "from-blue-500 to-blue-600",
      "from-indigo-500 to-indigo-600",
      "from-purple-500 to-purple-600",
      "from-pink-500 to-pink-600",
    ];
    return gradients[index % gradients.length];
  };

  const getTrendIcon = (trend: "up" | "down" | "neutral") => {
    switch (trend) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4 text-emerald-500" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />;
      default:
        return <MinusIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        {data.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900 dark:text-white">
                  {category.name}
                </span>
                {getTrendIcon(category.trend)}
              </div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {formatCurrency(category.value)}
              </div>
            </div>
            <div className="relative h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`absolute left-0 top-0 h-full rounded-full bg-gradient-to-r ${getGradient(
                  index
                )}`}
                initial={{ width: 0 }}
                animate={{ width: `${category.percentage}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
              <span>{category.percentage}%</span>
              <span className="flex items-center space-x-1">
                <span>
                  {category.trend === "up" ? "+" : ""}
                  {Math.round(Math.random() * 10)}% vs last month
                </span>
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Top Category
            </div>
            <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {data?.[0]?.name}
            </div>
            <div className="text-sm text-violet-600 dark:text-violet-400">
              {data?.[0]?.percentage}% of total
            </div>
          </div>
          <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20">
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Growth Leader
            </div>
            <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
              {data.find((cat) => cat.trend === "up")?.name}
            </div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400">
              +{Math.round(Math.random() * 15)}% growth
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
