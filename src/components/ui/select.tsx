import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function Select({
  options,
  value,
  onChange,
  placeholder,
  className,
  error,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options?.find((option) => option.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between border bg-white px-3 py-2 text-sm",
          "transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent",
          {
            "border-red-500": error,
            "border-gray-200": !error,
          },
          className
        )}
      >
        <span className={!selectedOption ? "text-gray-500" : undefined}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", {
            "rotate-180": isOpen,
          })}
        />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange?.(option.value);
                setIsOpen(false);
              }}
              className={cn(
                "flex w-full items-center px-3 py-2 text-sm",
                "hover:bg-gray-100",
                {
                  "bg-gray-50": option.value === value,
                }
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
