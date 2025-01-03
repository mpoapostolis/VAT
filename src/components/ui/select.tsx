import { useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { cn } from "../../lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export const Select = (props: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { options, value, onChange, placeholder, className, error } = props;
  const selectedOption = options?.find((option) => option.value === value);

  const handleSelect = (option: SelectOption) => {
    onChange(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full text-left items-center justify-between rounded-md border bg-white px-3 py-2 text-sm",
          "transition-colors hover:bg-gray-50",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
          {
            "border-red-500": error,
            "border-gray-200": !error,
            "ring-2 ring-blue-500": isOpen,
          },
          className
        )}
      >
        <span className={!selectedOption ? "text-gray-500" : "text-gray-900"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn("h-4 w-4 text-gray-500 transition-transform", {
            "rotate-180": isOpen,
          })}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999]"
            onClick={() => setIsOpen(false)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                position: "absolute",
                top:
                  buttonRef.current?.getBoundingClientRect().bottom +
                    window.scrollY +
                    8 || 0,
                left:
                  buttonRef.current?.getBoundingClientRect().left +
                    window.scrollX || 0,
                width: buttonRef.current?.offsetWidth,
                maxHeight: "200px",
              }}
              className="rounded-md border border-gray-200 bg-white py-1 shadow-xl z-[99999] overflow-auto"
            >
              {options.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={cn(
                      "flex text-left w-full items-center px-3 py-2 text-sm",
                      "transition-colors hover:bg-gray-100",
                      {
                        "bg-gray-50 text-gray-900": option.value === value,
                        "text-gray-700": option.value !== value,
                      }
                    )}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
