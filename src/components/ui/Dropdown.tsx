import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface Option {
  value: string;
  label: string;
}

interface DropdownProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  arrow?: boolean;
}

export function Dropdown({
  options,
  value,
  arrow = true,
  onChange,
  placeholder = "Select...",
  className = "",
  label,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center justify-between text-sm w-full px-4 py-2.5 
          bg-white dark:bg-gray-800 
          rounded-lg cursor-pointer
          hover:border-indigo-500 dark:hover:border-indigo-400
          transition-colors
          ${className}
        `}
      >
        <span
          className={`${
            !selectedOption
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-900 dark:text-gray-100"
          }`}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        {arrow && (
          <ChevronDownIcon
            className={`h-5 w-5 text-gray-400 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`
                  px-4 py-2.5 cursor-pointer
                  ${
                    option.value === value
                      ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                      : "text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }
                `}
              >
                {option.label}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
