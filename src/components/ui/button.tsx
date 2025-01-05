import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | string;
  size?: "sm" | "md" | "lg" | "icon";
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
          "inline-fle text-xs rounded items-center justify-center font-medium transition-all duration-200",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          {
            // Variants
            "[background:var(--primary)] text-white hover:[background:var(--primary-dark)]":
              variant === "primary",
            "bg-gray-100 text-gray-900 hover:bg-gray-200":
              variant === "secondary",
            "border border-gray-300 bg-white hover:bg-gray-50":
              variant === "outline",
            "hover:bg-gray-100": variant === "ghost",
            "bg-red-600 text-white hover:bg-red-700": variant === "danger",
            // Sizes
            "h-9 px-4 text-xs": size === "sm",
            "h-10 px-4": size === "md",
            "h-11 px-8": size === "lg",
            "h-10 w-10 p-0": size === "icon",
          },
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
