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

/* ----------------------------------------------
   QUICK RANGES
---------------------------------------------- */
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

/* ----------------------------------------------
   PROPS
---------------------------------------------- */
interface DateRangePickerProps {
  onChange?: (range: { from: Date | undefined; to: Date | undefined }) => void;
  value?: { from: Date | undefined; to: Date | undefined };
  className?: string;
}

/* ----------------------------------------------
   COMPONENT
---------------------------------------------- */
export function DateRangePicker({
  onChange,
  value,
  className,
}: DateRangePickerProps) {
  const [searchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track the currently chosen date range
  const [range, setRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>(
    value || {
      from: undefined,
      to: undefined,
    }
  );

  // Dynamically control how many months to show:
  // 1 month if width < 1024px (lg), otherwise 2 months.
  const [monthsToShow, setMonthsToShow] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setMonthsToShow(window.innerWidth < 768 ? 1 : 2);
    };
    handleResize(); // initialize
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // If ?from= and ?to= are in the URL, pre-set them
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

  // Called when the user selects a date range on the calendar
  const handleSelect = (ranges: any) => {
    const newRange = {
      from: ranges.selection.startDate,
      to: ranges.selection.endDate,
    };
    setRange(newRange);
    onChange?.(newRange);
  };

  // Resets the date range
  const clearRange = () => {
    const newRange = { from: undefined, to: undefined };
    setRange(newRange);
    onChange?.(newRange);
    setIsOpen(false);
  };

  // Handler for picking a "Quick Range"
  const handleQuickRangeSelect = (quickRange: (typeof quickRanges)[0]) => {
    const newRange = quickRange.getValue();
    setRange(newRange);
    onChange?.(newRange);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn("relative inline-block", className)}>
      {/* Button that toggles date range panel */}
      <Button
        id="date-range-picker-button"
        variant="outline"
        className={cn(
          "w-full flex truncate items-center text-sm justify-start text-left font-medium group",
          "border-gray-200 bg-white hover:bg-gray-100",
          "focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500",
          "transition-colors duration-200",
          !range.from && "text-gray-500"
        )}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
        {range.from ? (
          range.to ? (
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
              {format(range.from, "MMM d, yyyy")} -{" "}
              {format(range.to, "MMM d, yyyy")}
            </span>
          ) : (
            <span className="text-gray-700 group-hover:text-gray-900 transition-colors duration-200">
              {format(range.from, "MMM d, yyyy")}
            </span>
          )
        ) : (
          <span>Select date range</span>
        )}
        {/* Clear button if there is a range */}
        {range.from && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-6 w-6 rounded-full opacity-70 hover:opacity-100 hover:bg-gray-100"
            onClick={(e) => {
              e.stopPropagation();
              clearRange();
            }}
          >
            <CloseIcon className="h-3 w-3 text-gray-600" />
            <span className="sr-only">Clear date range</span>
          </Button>
        )}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: window.innerWidth < 1024 ? "100%" : 8,
              scale: window.innerWidth < 1024 ? 1 : 0.98,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: window.innerWidth < 1024 ? "100%" : 8,
              scale: window.innerWidth < 1024 ? 1 : 0.98,
            }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className={cn(
              "fixed inset-0 z-50 lg:absolute lg:inset-auto",
              "lg:right-0 lg:mt-2 lg:origin-top-right",
              "w-full h-[100dvh] lg:h-auto lg:w-auto lg:max-w-[90vw]",
              "bg-white lg:rounded lg:border lg:border-gray-200 lg:shadow-lg",
              "flex flex-col"
            )}
          >
            {/* Mobile header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 lg:hidden">
              <h3 className="text-lg font-semibold text-gray-900">
                Select Date Range
              </h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setIsOpen(false)}
              >
                <CloseIcon className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            <div className="flex-1 overflow-auto">
              <div
                className={cn(
                  "flex flex-col lg:flex-row h-full",
                  "divide-y divide-gray-200 lg:divide-y-0 lg:divide-x"
                )}
              >
                {/* Quick Ranges Panel */}
                <div className="p-4 lg:w-[220px] lg:flex-shrink-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-3 hidden lg:block">
                    Quick Ranges
                  </h4>
                  <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                    {quickRanges.map((item, idx) => {
                      const qr = item.getValue();
                      const isSelected =
                        range.from?.getTime() === qr.from.getTime() &&
                        range.to?.getTime() === qr.to.getTime();

                      return (
                        <Button
                          key={idx}
                          variant={isSelected ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start text-xs h-8",
                            "transition-colors duration-200",
                            isSelected
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                            // Subtle ring for "Today" if not selected
                            isToday(qr.from) &&
                              isToday(qr.to) &&
                              !isSelected &&
                              "ring-1 ring-blue-500/20"
                          )}
                          onClick={() => handleQuickRangeSelect(item)}
                        >
                          {item.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Calendar Panel */}
                <div className="flex-1 p-4 flex flex-col">
                  <DateRange
                    ranges={[
                      {
                        startDate: range.from || new Date(),
                        endDate: range.to || new Date(),
                        key: "selection",
                      },
                    ]}
                    onChange={handleSelect}
                    months={monthsToShow}
                    direction={monthsToShow > 1 ? "horizontal" : "vertical"}
                    weekStartsOn={1}
                    showMonthAndYearPickers={true}
                    showDateDisplay={false}
                    rangeColors={["#2563eb"]}
                    color="#2563eb"
                    className={cn(
                      // Expand to fill parent if needed
                      "flex-1",

                      /* ----------------------------------
     * MONTH WRAPPER & NAVIGATION
     ---------------------------------- */
                      "[&_.rdrMonths_horizontal]:gap-2", // spacing between months in horizontal mode
                      // Each month container
                      "[&_.rdrMonth]:!w-full [&_.rdrMonth]:max-w-none lg:[&_.rdrMonth]:!w-[280px]",
                      // Month & Year Picker
                      "[&_.rdrMonthAndYearWrapper]:px-2 [&_.rdrMonthAndYearWrapper]:mb-3",
                      "[&_.rdrMonthAndYearPickers_select]:text-base [&_.rdrMonthAndYearPickers_select]:font-medium",
                      "[&_.rdrMonthAndYearPickers_select]:p-1",
                      // Navigation buttons
                      "[&_.rdrNextPrevButton]:w-8 [&_.rdrNextPrevButton]:h-8",
                      "[&_.rdrNextPrevButton]:transition-colors [&_.rdrNextPrevButton]:rounded-md",
                      "[&_.rdrNextPrevButton]:hover:bg-gray-100",

                      /* ----------------------------------
     * WEEKDAYS
     ---------------------------------- */
                      "[&_.rdrWeekDay]:font-medium [&_.rdrWeekDay]:text-gray-500",

                      /* ----------------------------------
     * DAYS / CELLS
     ---------------------------------- */
                      // Container for each day cell
                      "[&_.rdrDay]:!w-[14.28%]", // Force 7 columns (100/7 ~ 14.28)
                      // For bigger screens, optionally narrower cells:
                      "lg:[&_.rdrDay]:!w-10",
                      "[&_.rdrDay]:aspect-square", // keep squares on smaller screens
                      // The day number container
                      "[&_.rdrDayNumber]:!w-full [&_.rdrDayNumber]:!h-full",
                      "[&_.rdrDayNumber]:flex [&_.rdrDayNumber]:items-center [&_.rdrDayNumber]:justify-center",
                      "[&_.rdrDayNumber]:[&>span]:w-10 [&_.rdrDayNumber]:[&>span]:h-10",
                      "[&_.rdrDayNumber]:[&>span]:flex [&_.rdrDayNumber]:[&>span]:items-center [&_.rdrDayNumber]:[&>span]:justify-center",
                      "[&_.rdrDayNumber]:[&>span]:text-sm [&_.rdrDayNumber]:[&>span]:font-medium",
                      // Disabled days
                      "[&_.rdrDayDisabled]:opacity-30",

                      /* ----------------------------------
     * HIGHLIGHTING & COLORS
     ---------------------------------- */
                      // "Today"
                      "[&_.rdrDayToday]:text-blue-600 [&_.rdrDayToday]:font-semibold",
                      "[&_.rdrDayToday_.rdrDayNumber]:after:hidden", // kill default ring
                      // Hover effect
                      "[&_.rdrDayHovered]:!bg-blue-50",
                      // Range selection
                      "[&_.rdrStartEdge]:!bg-blue-600 [&_.rdrStartEdge]:!rounded-l-full",
                      "[&_.rdrEndEdge]:!bg-blue-600 [&_.rdrEndEdge]:!rounded-r-full",
                      "[&_.rdrInRange]:!bg-blue-600/80 [&_.rdrInRange]:!rounded-none",
                      // Preview selection on hover
                      "[&_.rdrDayInPreview]:!bg-blue-50 [&_.rdrDayInPreview]:!border-blue-600/50",
                      "[&_.rdrDayStartPreview]:!rounded-l-full [&_.rdrDayStartPreview]:!border-blue-600/50",
                      "[&_.rdrDayEndPreview]:!rounded-r-full [&_.rdrDayEndPreview]:!border-blue-600/50",
                      // Selected day text
                      "[&_.rdrSelected]:text-white"
                    )}
                  />
                </div>
              </div>
            </div>

            {/* Action buttons - fixed to bottom on mobile */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-3 lg:justify-end">
                <Button
                  variant="outline"
                  className="flex-1 lg:flex-none text-sm font-medium bg-white hover:bg-gray-50"
                  onClick={clearRange}
                >
                  Clear
                </Button>
                <Button
                  className="flex-1 lg:flex-none text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setIsOpen(false)}
                >
                  Apply
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
