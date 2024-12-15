import React, { useState, useRef, useEffect } from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  startOfQuarter,
  endOfQuarter,
} from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
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
    label: "Last 7 days",
    getValue: () => ({
      from: subDays(new Date(), 6),
      to: new Date(),
    }),
  },
  {
    label: "Last 30 days",
    getValue: () => ({
      from: subDays(new Date(), 29),
      to: new Date(),
    }),
  },
  {
    label: "This month",
    getValue: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "Last month",
    getValue: () => {
      const lastMonth = subDays(startOfMonth(new Date()), 1);
      return {
        from: startOfMonth(lastMonth),
        to: endOfMonth(lastMonth),
      };
    },
  },
  {
    label: "This quarter",
    getValue: () => ({
      from: startOfQuarter(new Date()),
      to: endOfQuarter(new Date()),
    }),
  },
  {
    label: "This year",
    getValue: () => ({
      from: startOfYear(new Date()),
      to: endOfYear(new Date()),
    }),
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

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);

    if (range?.from) {
      newParams.set("from", range.from.toISOString());
    } else {
      newParams.delete("from");
    }

    if (range?.to) {
      newParams.set("to", range.to.toISOString());
    } else {
      newParams.delete("to");
    }

    setSearchParams(newParams);
  }, [range, searchParams]);

  return (
    <div className={cn("relative inline-block", className)} ref={containerRef}>
      <Button
        variant="outline"
        className={cn(
          "w-[260px]  justify-start text-left text-sm font-medium border-gray-200 bg-white hover:bg-gray-50",
          !range.from && "text-gray-500"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
        <span className="text-gray-700">
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
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 origin-top-right bg-white rounded-lg border shadow-xl"
            style={{
              width: "fit-content",
              transform: "translateX(calc(200px - 100%))",
            }}
          >
            <div className="flex">
              {/* Quick filters on the left */}
              <div className="w-[160px] p-3 border-r border-gray-100">
                <div className="space-y-1">
                  {quickRanges.map((quickRange) => (
                    <Button
                      key={quickRange.label}
                      variant="ghost"
                      className="w-full justify-start text-sm font-normal h-8 text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      onClick={() => handleQuickRangeSelect(quickRange)}
                    >
                      {quickRange.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Calendar on the right */}
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
                  className="[&_.rdrMonthAndYearWrapper]:mb-4 [&_.rdrMonth]:rounded [&_.rdrStartEdge]:!rounded-l-full [&_.rdrEndEdge]:!rounded-r-full [&_.rdrDayStartPreview]:!rounded-l-full [&_.rdrDayEndPreview]:!rounded-r-full [&_.rdrDayToday_.rdrDayNumber]:after:hidden [&_.rdrDayToday]:text-[#0066FF] [&_.rdrDayToday]:font-medium [&_.rdrSelected]:!bg-primary [&_.rdrInRange]:!bg-primary/10 [&_.rdrStartEdge]:!bg-primary [&_.rdrEndEdge]:!bg-primary"
                />
                <div className="flex justify-end mt-3 border-t border-gray-100 pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2 text-sm font-medium bg-white hover:bg-gray-50"
                    onClick={clearRange}
                  >
                    Clear
                  </Button>
                  <Button
                    size="sm"
                    className="text-sm font-medium bg-blue-600 hover:bg-blue-700"
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
