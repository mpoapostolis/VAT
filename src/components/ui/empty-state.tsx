import React from "react";
import { motion } from "framer-motion";
import { Button } from "./button";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-8 text-center bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded"
    >
      <div className="w-16 h-16 mb-4 rounded-full bg-gray-50 flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {action && (
        <Button onClick={action.onClick} className="min-w-[200px]">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
