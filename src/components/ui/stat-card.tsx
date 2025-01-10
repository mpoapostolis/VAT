import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type StatCardVariant = "emerald" | "rose" | "blue" | "violet";

interface TrendData {
  value: number;
  label: string;
  previousValue?: number;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | undefined;
  trend?: TrendData;
  variant?: StatCardVariant;
  isLoading?: boolean;
  className?: string;
  tooltipContent?: string;
}

const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    y: -4,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

const variantStyles: Record<
  StatCardVariant,
  {
    icon: string;
    trend: string;
    decoration: string;
    shadow: string;
  }
> = {
  emerald: {
    icon: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20",
    trend: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-500/20",
    decoration: "from-emerald-500/5 to-transparent",
    shadow: "shadow-emerald-100",
  },
  rose: {
    icon: "bg-rose-500/10 text-rose-600 ring-1 ring-rose-500/20",
    trend: "bg-rose-50 text-rose-700 ring-1 ring-rose-500/20",
    decoration: "from-rose-500/5 to-transparent",
    shadow: "shadow-rose-100",
  },
  blue: {
    icon: "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20",
    trend: "bg-blue-50 text-blue-700 ring-1 ring-blue-500/20",
    decoration: "from-blue-500/5 to-transparent",
    shadow: "shadow-blue-100",
  },
  violet: {
    icon: "bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20",
    trend: "bg-violet-50 text-violet-700 ring-1 ring-violet-500/20",
    decoration: "from-violet-500/5 to-transparent",
    shadow: "shadow-violet-100",
  },
};

export function StatCard({
  icon,
  label,
  value,
  trend,
  variant = "emerald",
  isLoading,
  className,
  tooltipContent,
}: StatCardProps) {
  if (isLoading) {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={variants}
        className={cn(
          "h-[190px] bg-white/50 backdrop-blur-sm border border-gray-200/60 animate-pulse p-4",
          "lg",
          className
        )}
      >
        <div className="space-y-4">
          <div className="w-11 h-11 bg-gray-100 lg animate-pulse" />
          <div className="space-y-3">
            <div className="h-4 w-24 bg-gray-100 rounded animate-pulse" />
            <div className="h-7 w-36 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 w-20 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </motion.div>
    );
  }

  const isTrendPositive = trend?.value && trend.value > 0;
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      // whileHover="hover"
      variants={variants}
      className={cn(
        // Base styles
        "relative h-fit bg-white/50 backdrop-blur-sm border border-gray-200/60 p-5",
        // Rounded corners and shadow
        "lg",
        styles.shadow,
        // Interactive states
        "hover:bg-gray-50/50 transition-all duration-300",
        // Shadow transitions
        "shadow-sm hover:shadow-lg",
        // Custom classes
        className
      )}
      title={tooltipContent}
    >
      {/* Decorative gradient */}
      <div
        className={cn(
          "absolute inset-0 lg bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          styles.decoration
        )}
      />

      <div className="relative flex items-start justify-between">
        {/* Icon with subtle animation */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={cn(
            "flex items-center justify-center w-8 h-8 lg",
            styles.icon
          )}
        >
          {React.cloneElement(icon as React.ReactElement, {
            className: "h-6 w-6",
          })}
        </motion.div>

        {/* Trend Indicator with AnimatePresence */}
        <AnimatePresence mode="wait">
          {trend && (
            <motion.span
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={cn(
                "inline-flex items-center px-2.5 py-1 full text-xs font-medium",
                isTrendPositive ? styles.trend : variantStyles.rose.trend
              )}
            >
              {isTrendPositive ? (
                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />
              )}
              {trend.value}%
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Content with staggered animation */}
      <motion.div
        className="mt-4 space-y-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="text-xs font-medium text-gray-500">{label}</div>
        <motion.div
          className="text-lg font-semibold text-gray-900"
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {value}
        </motion.div>
        {trend && (
          <motion.div
            className="text-xs text-gray-500 mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {trend.label}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
