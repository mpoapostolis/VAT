import React, { forwardRef } from 'react';
import ReactDatePicker from 'react-datepicker';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import "react-datepicker/dist/react-datepicker.css";
import './datepicker.css';

interface DatePickerProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

export function DatePicker({ value, onChange, className, placeholder }: DatePickerProps) {
  const CustomInput = forwardRef<HTMLButtonElement, { value?: string; onClick?: () => void }>(
    ({ value, onClick }, ref) => (
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={onClick}
        ref={ref}
        type="button"
        className={`w-full flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 ${className}`}
      >
        <CalendarIcon className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2" />
        <span className="text-gray-700 dark:text-gray-300">{value || placeholder || 'Select date...'}</span>
      </motion.button>
    )
  );

  return (
    <ReactDatePicker
      selected={value}
      onChange={onChange}
      customInput={<CustomInput />}
      dateFormat="PPP"
      showPopperArrow={false}
      calendarClassName="custom-datepicker"
    />
  );
}