import React from "react";
import { motion } from "framer-motion";
import { FileX } from "lucide-react";
import { Button } from "./button";

interface TableEmptyStateProps {
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function TableEmptyState({
  title,
  description,
  action,
}: TableEmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-12"
    >
      <div className="w-16 h-16 mb-4 -full bg-gray-50 flex items-center justify-center">
        <FileX className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-xs font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-xs text-gray-500 mb-6 text-center max-w-sm">
        {description}
      </p>
      {action && (
        <Button onClick={action.onClick} className="min-w-[200px]">
          {action.label}
        </Button>
      )}
    </motion.div>
  );
}
