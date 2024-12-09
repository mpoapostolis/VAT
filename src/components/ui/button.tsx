import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", disabled, ...props },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          "inline-flex rounded items-center justify-center font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Primary button
            "bg-[#0066FF] text-white shadow-sm": variant === "primary",
            "hover:bg-[#0052CC] active:bg-[#004499]":
              variant === "primary" && !disabled,
            "focus-visible:ring-[#0066FF]/30": variant === "primary",

            // Secondary button
            "bg-gray-100 text-gray-900": variant === "secondary",
            "hover:bg-gray-200 active:bg-gray-300":
              variant === "secondary" && !disabled,

            // Outline button
            "border border-gray-200 bg-white text-gray-700":
              variant === "outline",
            "hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100":
              variant === "outline" && !disabled,

            // Ghost button
            "text-gray-700": variant === "ghost",
            "hover:bg-gray-100 active:bg-gray-200":
              variant === "ghost" && !disabled,

            // Danger button
            "bg-red-600 text-white shadow-sm": variant === "danger",
            "hover:bg-red-700 active:bg-red-800":
              variant === "danger" && !disabled,
            "focus-visible:ring-red-600/30": variant === "danger",

            // Focus rings for secondary, outline, and ghost
            "focus-visible:ring-gray-400/30": [
              "secondary",
              "outline",
              "ghost",
            ].includes(variant),

            // Sizes
            "text-sm px-3.5 h-9 gap-1.5": size === "sm",
            "text-sm px-4 h-10 gap-2": size === "md",
            "text-base px-5 h-11 gap-2": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
