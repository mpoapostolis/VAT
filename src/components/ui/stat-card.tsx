import React from "react";
import { motion } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: {
    value: number;
    label: string;
  };
  variant?: "emerald" | "rose" | "blue" | "violet";
  isLoading?: boolean;
}

export function StatCard({
  icon,
  label,
  value,
  trend,
  variant = "emerald",
  isLoading,
}: StatCardProps) {
  if (isLoading) {
    return (
      <div className="h-[120px] bg-white rounded border border-gray-200/60 animate-pulse p-4">
        <div className="space-y-4">
          <div className="w-10 h-10 bg-gray-100 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-20 bg-gray-100 rounded" />
            <div className="h-6 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const isTrendPositive = trend?.value && trend.value > 0;

  const variantStyles = {
    emerald: {
      icon: "bg-emerald-500/10 text-emerald-600",
      trend: "bg-emerald-50 text-emerald-700",
      decoration: "from-emerald-500/5 to-transparent",
    },
    rose: {
      icon: "bg-rose-500/10 text-rose-600",
      trend: "bg-rose-50 text-rose-700",
      decoration: "from-rose-500/5 to-transparent",
    },
    blue: {
      icon: "bg-blue-500/10 text-blue-600",
      trend: "bg-blue-50 text-blue-700",
      decoration: "from-blue-500/5 to-transparent",
    },
    violet: {
      icon: "bg-violet-500/10 text-violet-600",
      trend: "bg-violet-50 text-violet-700",
      decoration: "from-violet-500/5 to-transparent",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        // Base styles
        "group relative h-[190px] bg-white rounded border border-gray-200/60 p-5",
        // Interactive states
        "hover:bg-gray-50/50 transition-all duration-300",
        // Shadow
        "shadow-sm hover:shadow-md"
      )}
    >
      {/* Decorative gradient */}
      <div
        className={cn(
          "absolute inset-0 rounded bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          variantStyles[variant].decoration
        )}
      />

      <div className="relative flex items-start justify-between">
        {/* Icon */}
        <div
          className={cn(
            "flex items-center justify-center w-11 h-11 rounded",
            variantStyles[variant].icon
          )}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: "h-6 w-6",
          })}
        </div>

        {/* Trend Indicator */}
        {trend && (
          <span
            className={cn(
              "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium",
              isTrendPositive
                ? variantStyles.emerald.trend
                : variantStyles.rose.trend
            )}
          >
            {isTrendPositive ? (
              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
            )}
            {trend.value}%
          </span>
        )}
      </div>

      {/* Content */}
      <div className="mt-4 space-y-1.5">
        <div className="text-sm font-medium text-gray-500">{label}</div>
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        {trend && (
          <div className="text-xs text-gray-500 mt-1">{trend.label}</div>
        )}
      </div>
    </motion.div>
  );
}
