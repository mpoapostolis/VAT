import React, { useState, useRef, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './button';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
}

export function DateRangePicker({ onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRangeSelect = (range: { from: Date | undefined; to: Date | undefined }) => {
    setRange(range);
    onChange?.(range);
  };

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-[280px] justify-start text-left font-normal border-gray-200 bg-white hover:bg-gray-50"
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-[#0066FF]" />
        {range.from ? (
          range.to ? (
            <>
              {format(range.from, "LLL dd, y")} - {format(range.to, "LLL dd, y")}
            </>
          ) : (
            format(range.from, "LLL dd, y")
          )
        ) : (
          <span className="text-gray-500">Pick a date range</span>
        )}
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 z-50 mt-2 bg-white border border-gray-100 shadow-xl rounded-lg p-4"
            style={{ width: '600px' }}
          >
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              numberOfMonths={2}
              className="bg-white"
              classNames={{
                months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                month: "space-y-4",
                caption: "flex justify-center pt-1 relative items-center px-8",
                caption_label: "text-base font-semibold text-gray-900",
                nav: "space-x-1 flex items-center",
                nav_button: "h-8 w-8 bg-transparent p-0 hover:bg-[#0066FF]/10 text-[#0066FF] rounded-full transition-colors duration-150",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                table: "w-full border-collapse space-y-1",
                head_row: "flex",
                head_cell: "text-gray-600 rounded-md w-9 font-medium text-[0.875rem] px-0",
                row: "flex w-full mt-2",
                cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
                day: "h-9 w-9 p-0 font-normal hover:bg-[#0066FF]/10 rounded-full transition-colors duration-150",
                day_selected: "bg-[#0066FF] text-white hover:bg-[#0066FF] hover:text-white rounded-full font-medium",
                day_today: "bg-gray-50 text-[#0066FF] font-semibold",
                day_outside: "text-gray-400 opacity-50",
                day_disabled: "text-gray-400 opacity-50",
                day_hidden: "invisible",
                day_range_start: "bg-[#0066FF] text-white rounded-full",
                day_range_end: "bg-[#0066FF] text-white rounded-full",
                day_range_middle: "bg-[#0066FF]/10 text-black hover:bg-[#0066FF]/20 hover:text-black",
              }}
              components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}