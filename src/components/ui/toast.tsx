import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Toast as ToastType } from "@/lib/hooks/useToast";

interface ToastProps extends ToastType {
  onRemove: (id: string) => void;
}

export function Toast({ id, message, type, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [id, onRemove]);

  const Icon = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        "flex items-center justify-between w-full max-w-sm px-4 py-3 rounded shadow-lg",
        {
          "bg-green-50 text-green-800 border border-green-200":
            type === "success",
          "bg-red-50 text-red-800 border border-red-200": type === "error",
          "bg-blue-50 text-blue-800 border border-blue-200": type === "info",
        }
      )}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}
