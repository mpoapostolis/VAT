import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export function Select({ options, value, onChange, placeholder, className, error }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<SelectOption | undefined>(
    options.find(option => option.value === value)
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SelectOption) => {
    setSelectedOption(option);
    onChange?.(option.value);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-10 w-full items-center justify-between border bg-white px-3 py-2 text-left text-sm transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent',
          error ? 'border-red-500' : 'border-gray-200',
          className
        )}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
          {selectedOption ? selectedOption.label : placeholder || 'Select an option'}
        </span>
        <ChevronDown className={cn(
          'h-4 w-4 text-gray-500 transition-transform duration-200',
          isOpen && 'transform rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-60 overflow-auto animate-scale-in">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSelect(option)}
              className={cn(
                'w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50',
                selectedOption?.value === option.value && 'bg-blue-50 text-blue-600'
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