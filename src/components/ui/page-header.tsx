import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "./button";
import { motion } from "framer-motion";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  actions?: React.ReactNode;
  type?: "income" | "expense";
}

export function PageHeader({
  title,
  subtitle,
  onBack,
  actions,
  type,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 rounded overflow-hidden"
    >
      <div
        className={`h-2 ${
          type === "income"
            ? "bg-green-500"
            : type === "expense"
            ? "bg-red-500"
            : "bg-blue-500"
        }`}
      />

      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="ghost"
                onClick={onBack}
                className="rounded-full w-10 h-10 p-0 hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </Button>
            </motion.div>

            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-gray-900 tracking-tight"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-gray-500 mt-1"
              >
                {subtitle}
              </motion.p>
            </div>
          </div>

          {actions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-3"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
