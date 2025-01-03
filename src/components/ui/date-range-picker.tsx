import React, { useState, useRef, useEffect } from "react";
import {
  format,
  subDays,
  subWeeks,
  subMonths,
  subQuarters,
  subYears,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
  startOfWeek,
  endOfWeek,
  isToday,
} from "date-fns";
import { Calendar as CalendarIcon, X as CloseIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./button";
import { DateRange } from "react-date-range";
import { cn } from "@/lib/utils";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useSearchParams } from "react-router-dom";

interface DateRangePickerProps {
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  value?: { from: Date | undefined; to: Date | undefined };
  className?: string;
}

const quickRanges = [
  {
    label: "Today",
    getValue: () => ({ from: new Date(), to: new Date() }),
  },
  {
    label: "Yesterday",
    getValue: () => {
      const yesterday = subDays(new Date(), 1);
      return { from: yesterday, to: yesterday };
    },
  },
  {
    label: "Last 7 Days",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 14 Days",
    getValue: () => ({
      from: subDays(new Date(), 13),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 Days",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "Last 90 Days",
    getValue: () => ({
      from: subDays(new Date(), 89),
      to: new Date(),
    }),
  },
  {
    label: "This Week",
    getValue: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }),
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "Last Week",
    getValue: () => {
      const lastWeek = subWeeks(new Date(), 1);
      return {
        from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      };
    },
  },
  {
    label: "This Month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last Month",
    getValue: () => {
      const lastMonth = subMonths(new Date(), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: "This Quarter",
    getValue: () => ({
      from: startOfQuarter(new Date()),
      to: endOfQuarter(new Date()),
    }),
  },
  {
    label: "Last Quarter",
    getValue: () => {
      const lastQuarter = subQuarters(new Date(), 1);
      return {
        from: startOfQuarter(lastQuarter),
        to: endOfQuarter(lastQuarter),
      };
    },
  },
  {
    label: "This Year",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
  },
  {
    label: "Last Year",
    getValue: () => {
      const lastYear = subYears(new Date(), 1);
      return {
        from: startOfYear(lastYear),
        to: endOfYear(lastYear),
      };
    },
  },
];

export function DateRangePicker({
  onChange,
  value,
  className,
}: DateRangePickerProps) {
  const [searchParams, setSearchParams] = useSearchParams();
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
    setIsOpen(false);
  };

  const handleQuickRangeSelect = (quickRange: (typeof quickRanges)[0]) => {
    const newRange = quickRange.getValue();
    setRange(newRange);
    onChange?.(newRange);
    setIsOpen(false);
  };

  useEffect(() => {
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (from && to) {
      setRange({
        from: new Date(from),
        to: new Date(to),
      });
    }
  }, [searchParams]);

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      <div className="relative">
        <Button
          id="date-range-picker-button"
          variant="outline"
          className={cn(
            "w-[250px] flex items-center text-xs justify-start text-left font-medium relative group",
            "border-gray-200 bg-white hover:bg-gray-50/80",
            "transition-all duration-200 ease-in-out",
            "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
            !range.from && "text-gray-500"
          )}
          onClick={() => setIsOpen(!isOpen)}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500 group-hover:text-blue-600 transition-colors duration-200" />
          <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
            {range.from ? (
              range.to ? (
                <>
                  {format(range.from, "MMM d, yyyy")} -{" "}
                  {format(range.to, "MMM d, yyyy")}
                </>
              ) : (
                format(range.from, "MMM d, yyyy")
              )
            ) : (
              <span>Select date range</span>
            )}
          </span>
          {range.from && (
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto h-6 w-6 rounded-full opacity-70 hover:opacity-100 transition-all duration-200 hover:bg-gray-100"
              onClick={(e) => {
                e.stopPropagation();
                clearRange();
              }}
            >
              <CloseIcon className="h-3 w-3" />
              <span className="sr-only">Clear date range</span>
            </Button>
          )}
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={cn(
              "absolute right-0 z-[9999] mt-2 origin-top-right",
              "rounded border border-gray-200 bg-white shadow-xl",
              "backdrop-blur-sm",
              "overflow-hidden"
            )}
            style={{
              width: "fit-content",
            }}
          >
            <div className="flex">
              <div className="w-[200px] p-4 border-r border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 mb-3 px-2">
                  Quick Ranges
                </h4>
                <div className="space-y-0">
                  {quickRanges.map((quickRange, index) => {
                    const rangeValue = quickRange.getValue();
                    const isSelected =
                      range.from?.getTime() === rangeValue.from.getTime() &&
                      range.to?.getTime() === rangeValue.to.getTime();

                    return (
                      <Button
                        key={index}
                        variant={isSelected ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-xs font-normal h-8",
                          "transition-all duration-200",
                          isSelected
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70",
                          isToday(rangeValue.from) &&
                            isToday(rangeValue.to) &&
                            !isSelected &&
                            "ring-1 ring-blue-500/20"
                        )}
                        onClick={() => handleQuickRangeSelect(quickRange)}
                      >
                        {quickRange.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
              <div className="p-4">
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
                  rangeColors={["#2563eb"]}
                  color="#2563eb"
                  className={cn(
                    // Month and Year Wrapper
                    "[&_.rdrMonthAndYearWrapper]:mb-4",
                    "[&_.rdrMonthAndYearWrapper]:px-1.5",

                    // Month
                    "[&_.rdrMonth]:rounded",
                    "[&_.rdrMonth]:bg-gray-50/50",
                    "[&_.rdrMonth]:p-2",

                    // Calendar Navigation
                    "[&_.rdrNextPrevButton]:hover:bg-gray-100",
                    "[&_.rdrNextPrevButton]:transition-colors",
                    "[&_.rdrNextPrevButton]:rounded-md",

                    // Day Selection
                    "[&_.rdrStartEdge]:!rounded-l-full",
                    "[&_.rdrEndEdge]:!rounded-r-full",
                    "[&_.rdrDayStartPreview]:!rounded-l-full",
                    "[&_.rdrDayEndPreview]:!rounded-r-full",
                    "[&_.rdrDayToday_.rdrDayNumber]:after:hidden",

                    // Colors and States
                    "[&_.rdrDayToday]:text-blue-600",
                    "[&_.rdrDayToday]:font-medium",
                    "[&_.rdrSelected]:!bg-blue-600",
                    "[&_.rdrInRange]:!bg-blue-600/80",
                    "[&_.rdrStartEdge]:!bg-blue-600",
                    "[&_.rdrEndEdge]:!bg-blue-600",
                    "[&_.rdrDayHovered]:!bg-gray-100",

                    // Selects
                    "[&_.rdrMonthAndYearPickers_select]:bg-white",
                    "[&_.rdrMonthAndYearPickers_select]:border-gray-200",
                    "[&_.rdrMonthAndYearPickers_select]:rounded-md",
                    "[&_.rdrMonthAndYearPickers_select]:px-2",
                    "[&_.rdrMonthAndYearPickers_select]:py-1",
                    "[&_.rdrMonthAndYearPickers_select]:hover:border-gray-300",
                    "[&_.rdrMonthAndYearPickers_select]:focus:border-blue-500",
                    "[&_.rdrMonthAndYearPickers_select]:focus:ring-2",
                    "[&_.rdrMonthAndYearPickers_select]:focus:ring-blue-500/20",

                    // Week Days
                    "[&_.rdrWeekDay]:text-gray-500",
                    "[&_.rdrWeekDay]:font-normal",

                    // Day Numbers
                    "[&_.rdrDayNumber]:font-normal",
                    "[&_.rdrDayNumber]:transition-colors",
                    "[&_.rdrDayNumber]:duration-200"
                  )}
                />
                <div className="flex mt-3 justify-end border-t border-gray-100 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "mr-2 text-sm font-medium",
                      "bg-white hover:bg-gray-50/80",
                      "border-gray-200 hover:border-gray-300",
                      "transition-all duration-200"
                    )}
                    onClick={clearRange}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className={cn(
                      "text-sm font-medium",
                      "bg-blue-600 text-white",
                      "hover:bg-blue-700",
                      "transition-all duration-200",
                      "shadow-sm"
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
