import React, { forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="flex items-center">
        <label className="relative flex items-center">
          <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            {...props}
          />
          <div
            className={cn(
              "w-4 h-4 border grid place-items-center  transition-colors",
              "peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-primary/20",
              "peer-checked:bg-blue-500 peer-checked:border-blue-500",
              "peer-disabled:opacity-50 peer-disabled:cursor-not-allowed",
              error ? "border-red-500" : "border-gray-300",
              className
            )}
          >
            <Check className={cn("w-3 h-3 text-white", "transition-opacity")} />
          </div>
          {label && <span className="ml-2 text-xs text-gray-700">{label}</span>}
        </label>
        {error && <span className="ml-2 text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);
