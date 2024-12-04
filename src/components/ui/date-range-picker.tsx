import React, { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangePickerProps {
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  value?: { from: Date | undefined; to: Date | undefined };
}

export function DateRangePicker({ onChange, value }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(
    value || {
      from: undefined,
      to: undefined,
    }
  );
  const containerRef = useRef<HTMLDivElement>(null);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (ranges: any) => {
    const newRange = {
      from: ranges.selection.startDate,
      to: ranges.selection.endDate,
    };
    setRange(newRange);
    onChange?.(newRange);
  };

  const clearRange = () => {
    const newRange = { from: undefined, to: undefined };
    setRange(newRange);
    onChange?.(newRange);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-gray-300 transition-colors duration-200"
        >
          <div className="flex items-center gap-2 text-gray-500">
            <CalendarIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Date range</span>
          </div>
          {range.from ? (
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">
                {format(range.from, "MMM dd")}
              </span>
              {range.to && (
                <>
                  <span className="mx-2 text-gray-400">→</span>
                  <span className="text-sm font-medium text-gray-900">
                    {format(range.to, "MMM dd")}
                  </span>
                </>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">Select dates</span>
          )}
        </div>
        {(range.from || range.to) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              clearRange();
            }}
            className="h-9 w-9 rounded-full hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 origin-top-right bg-white border border-gray-200 rounded-xl shadow-xl"
            style={{
              boxShadow: "0 4px 24px rgba(0, 0, 0, 0.12)",
            }}
          >
            <div className="p-3">
              <DateRange
                ranges={[
                  {
                    startDate: range.from || new Date(),
                    endDate: range.to || new Date(),
                    key: "selection",
                  },
                ]}
                onChange={handleSelect}
                months={2}
                direction="horizontal"
                weekStartsOn={1}
                showMonthAndYearPickers={true}
                showDateDisplay={false}
                rangeColors={["#0066FF"]}
                color="#0066FF"
                className="[&_.rdrMonthAndYearWrapper]:mb-4 [&_.rdrMonth]:rounded-lg [&_.rdrStartEdge]:!rounded-l-full [&_.rdrEndEdge]:!rounded-r-full [&_.rdrDayStartPreview]:!rounded-l-full [&_.rdrDayEndPreview]:!rounded-r-full [&_.rdrDayToday_.rdrDayNumber]:after:hidden [&_.rdrDayToday]:text-[#0066FF] [&_.rdrDayToday]:font-medium"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
