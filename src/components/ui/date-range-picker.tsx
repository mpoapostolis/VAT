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
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="min-w-[280px] justify-start text-left font-normal border-gray-200 bg-white hover:bg-gray-50"
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-[#0066FF]" />
          {range.from ? (
            range.to ? (
              <>
                {format(range.from, "LLL dd, y")} -{" "}
                {format(range.to, "LLL dd, y")}
              </>
            ) : (
              format(range.from, "LLL dd, y")
            )
          ) : (
            <span className="text-gray-500">Pick a date range</span>
          )}
        </Button>
        {(range.from || range.to) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={clearRange}
            className="h-10 w-10 rounded-full hover:bg-gray-100"
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
            className="absolute right-0 z-50 mt-2 origin-top-right bg-white border border-gray-200 rounded-lg shadow-lg"
          >
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
              className="p-2"
              weekStartsOn={1}
              showMonthAndYearPickers={true}
              showDateDisplay={false}
              rangeColors={["#0066FF"]}
              color="#0066FF"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
