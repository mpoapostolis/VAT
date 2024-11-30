import React from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "./Dropdown";

interface Option {
  value: string;
  label: string;
}

interface FilterDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
}

export function FilterDropdown({
  value,
  onChange,
  options,
  className = "",
}: FilterDropdownProps) {
  return (
    <div className={`relative ${className}`}>
      <Dropdown
        value={value}
        onChange={onChange}
        arrow={false}
        options={options}
        className="min-w-[150px]"
      />
      <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
    </div>
  );
}
