import React from "react";
import { motion } from "framer-motion";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: {
    value: number;
    label: string;
  };
  isLoading?: boolean;
}

export function StatCard({ icon, label, value, isLoading }: StatCardProps) {
  if (isLoading) {
    return (
      <div className="h-[160px] bg-white rounded-[32px] animate-pulse p-6">
        <div className="space-y-6">
          <div className="w-12 h-12 bg-gray-100 rounded-2xl" />
          <div className="space-y-2">
            <div className="h-5 w-24 bg-gray-100 rounded-lg" />
            <div className="h-8 w-36 bg-gray-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative h-[180px] bg-white border border-gray-200/60  hover:bg-gray-50/50 rounded-xl shadow-sm p-6 transition-all duration-300"
    >
      {/* Decorative elements */}
      <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="absolute -right-4 -bottom-4 w-32 h-32 text-gray-900/[0.02] transform rotate-12 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <div className="relative space-y-6">
        {/* Icon */}
        <div className="inline-flex">
          <div className="relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center">
              {React.cloneElement(icon as React.ReactElement, {
                className: "h-6 w-6 text-gray-600",
              })}
            </div>
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-gray-200/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
            {label}
          </div>
          <div className="text-2xl font-semibold tracking-tight text-gray-900">
            {value}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
