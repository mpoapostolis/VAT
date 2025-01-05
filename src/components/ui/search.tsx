import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Building2,
  FileText,
  FolderOpen,
  Calculator,
  Building,
} from "lucide-react";
import useSWR from "swr";
import { searchService } from "@/lib/services/search-service";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import cn from "classnames";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Command } from "cmdk";

interface SearchGroup {
  title: string;
  icon: React.ElementType;
  results: {
    id: string;
    title: string;
    subtitle: string;
    href: string;
  }[];
}

interface SearchProps {
  className?: string;
}

export function Search({ className }: SearchProps) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const [groupedResults, setGroupedResults] = useState<SearchGroup[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState(0);

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(-1);
    setSelectedGroupIndex(0);
  }, [debouncedQuery]);

  const {
    data: searchResults,
    mutate,
    isLoading,
  } = useSWR(debouncedQuery ? ["search", debouncedQuery] : null, () =>
    searchService.search(debouncedQuery)
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        inputRef.current?.focus();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!groupedResults.length) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) => {
            const currentGroup = groupedResults[selectedGroupIndex];
            if (prev < currentGroup.results.length - 1) {
              return prev + 1;
            }
            if (selectedGroupIndex < groupedResults.length - 1) {
              setSelectedGroupIndex((prevGroup) => prevGroup + 1);
              return 0;
            }
            return prev;
          });
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) => {
            if (prev > 0) {
              return prev - 1;
            }
            if (selectedGroupIndex > 0) {
              setSelectedGroupIndex((prevGroup) => prevGroup - 1);
              return groupedResults[selectedGroupIndex - 1].results.length - 1;
            }
            return prev;
          });
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0) {
            const selectedResult =
              groupedResults[selectedGroupIndex].results[selectedIndex];
            handleResultClick(selectedResult.href);
          }
          break;
      }
    },
    [groupedResults, selectedIndex, selectedGroupIndex]
  );

  useEffect(() => {
    if (!searchResults) {
      setGroupedResults([]);
      return;
    }

    const groups: SearchGroup[] = [
      {
        title: "Invoices",
        icon: FileText,
        results: searchResults.invoices.map((invoice) => ({
          id: invoice.id,
          title: `Invoice ${invoice.number}`,
          subtitle: `${invoice.type || "Unknown"} - ${formatCurrency(
            invoice.total
          )}`,
          href: `/${
            invoice.type === "receivable" ? "receivables" : "payables"
          }/${invoice.id}`,
        })),
      },
      {
        title: "Companies",
        icon: Building,
        results: searchResults.companies.map((company) => ({
          id: company.id,
          title: company.companyNameEN,
          subtitle: company.vatNumber || "No VAT Number",
          href: `/companies/${company.id}`,
        })),
      },
      {
        title: "Customers",
        icon: Building2,
        results: searchResults.customers.map((customer) => ({
          id: customer.id,
          title: customer.contactFirstName || customer.companyName,
          subtitle: customer.email,
          href: `/customers/${customer.id}/edit`,
        })),
      },
      {
        title: "Categories",
        icon: FolderOpen,
        results: searchResults.categories.map((category) => ({
          id: category.id,
          title: category.name,
          subtitle:
            category.type.charAt(0).toUpperCase() + category.type.slice(1),
          href: `/categories/${category.id}/edit`,
        })),
      },
      {
        title: "VAT Returns",
        icon: Calculator,
        results: searchResults.vatReturns.map((vatReturn) => ({
          id: vatReturn.id,
          title: `VAT Return ${vatReturn.period}`,
          subtitle: formatCurrency(vatReturn.netVat),
          href: `/vat-return/${vatReturn.id}`,
        })),
      },
    ].filter((group) => group.results.length > 0);

    setGroupedResults(groups);
  }, [searchResults]);

  const handleResultClick = (href: string) => {
    navigate(href);
    setQuery("");
    setGroupedResults([]);
    setOpen(false);
  };

  const getGroupColors = (groupTitle: string) => {
    switch (groupTitle) {
      case "Invoices":
        return {
          bg: "from-slate-50/90 to-white",
          ring: "ring-slate-200/70",
          icon: "text-blue-600",
          hover: "hover:bg-slate-50/80",
          selected:
            "bg-slate-50/90 ring-1 ring-slate-200/70 shadow-[0_4px_12px_-4px_rgba(71,85,105,0.12)]",
          iconSelected: "text-blue-700",
        };
      case "Companies":
        return {
          bg: "from-slate-50/90 to-white",
          ring: "ring-slate-200/70",
          icon: "text-amber-600",
          hover: "hover:bg-slate-50/80",
          selected:
            "bg-slate-50/90 ring-1 ring-slate-200/70 shadow-[0_4px_12px_-4px_rgba(71,85,105,0.12)]",
          iconSelected: "text-amber-700",
        };
      case "Customers":
        return {
          bg: "from-slate-50/90 to-white",
          ring: "ring-slate-200/70",
          icon: "text-emerald-600",
          hover: "hover:bg-slate-50/80",
          selected:
            "bg-slate-50/90 ring-1 ring-slate-200/70 shadow-[0_4px_12px_-4px_rgba(71,85,105,0.12)]",
          iconSelected: "text-emerald-700",
        };
      case "Categories":
        return {
          bg: "from-slate-50/90 to-white",
          ring: "ring-slate-200/70",
          icon: "text-violet-600",
          hover: "hover:bg-slate-50/80",
          selected:
            "bg-slate-50/90 ring-1 ring-slate-200/70 shadow-[0_4px_12px_-4px_rgba(71,85,105,0.12)]",
          iconSelected: "text-violet-700",
        };
      case "VAT Returns":
        return {
          bg: "from-slate-50/90 to-white",
          ring: "ring-slate-200/70",
          icon: "text-rose-600",
          hover: "hover:bg-slate-50/80",
          selected:
            "bg-slate-50/90 ring-1 ring-slate-200/70 shadow-[0_4px_12px_-4px_rgba(71,85,105,0.12)]",
          iconSelected: "text-rose-700",
        };
      default:
        return {
          bg: "from-slate-50/90 to-white",
          ring: "ring-slate-200/70",
          icon: "text-slate-600",
          hover: "hover:bg-slate-50/80",
          selected:
            "bg-slate-50/90 ring-1 ring-slate-200/70 shadow-[0_4px_12px_-4px_rgba(71,85,105,0.12)]",
          iconSelected: "text-slate-700",
        };
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setOpen(true);
          inputRef.current?.focus();
        }}
        className={cn(
          "group relative w-full lg:w-64 flex items-center",
          "focus:outline-none",
          className
        )}
      >
        <div
          className={cn(
            // Layout
            "flex items-center w-full",
            // Visual
            "h-10 px-3.5 text-sm rounded",
            "bg-white/95 backdrop-blur-xl border border-slate-200/70",
            "shadow-[0_2px_8px_-4px_rgba(71,85,105,0.08)]",
            // States
            "hover:bg-slate-50/80 hover:border-slate-300/70",
            "group-focus:ring-2 group-focus:ring-slate-200",
            // Animation
            "transition-all duration-200 ease-out"
          )}
        >
          <SearchIcon className="w-4 h-4 text-slate-400 group-hover:text-slate-500 transition-colors duration-200" />
          <span className="ml-2.5 text-slate-500 group-hover:text-slate-600 transition-colors duration-200">
            Quick search...
          </span>
          <kbd className="ml-auto inline-flex items-center gap-1 rounded bg-slate-100/80 px-2 py-0.5 text-xs font-medium text-slate-500 transition-colors group-hover:text-slate-600">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </button>

      <Command.Dialog
        open={open}
        onOpenChange={setOpen}
        className="fixed inset-0 z-50 overflow-y-auto p-4 pt-[20vh]"
        overlayClassName="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
      >
        <div
          className={cn(
            // Layout
            "relative mx-auto max-w-2xl",
            // Visual
            "bg-white/95 backdrop-blur-2xl rounded",
            "shadow-[0_24px_48px_-12px_rgba(71,85,105,0.14),0_0_0_1px_rgba(71,85,105,0.02)]",
            // Animation
            "animate-in fade-in slide-in-from-top-8 duration-300 ease-out"
          )}
        >
          <div
            className={cn(
              // Layout
              "relative flex items-center",
              "border-b border-gray-200/50",
              // Visual
              "bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl",
              // Typography
              "text-xs font-semibold tracking-wider",
              // Animation
              "transition-all duration-300 ease-out"
            )}
          >
            <SearchIcon
              className={cn(
                "absolute left-4 w-5 h-5",
                isLoading ? "text-blue-500/80" : "text-gray-400/80"
              )}
            />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={groupedResults.length > 0}
              aria-controls="search-results"
              aria-label="Search invoices, customers, and more"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search invoices, customers, and more..."
              className={cn(
                // Layout
                "w-full py-4 pl-12 pr-4",
                // Typography
                "text-base text-slate-900 placeholder-slate-400/90",
                // Visual
                "bg-transparent",
                // States
                "focus:outline-none",
                // Animation
                "transition-all duration-300 ease-out"
              )}
            />
            {isLoading && (
              <div className="absolute right-4 flex items-center gap-2">
                <div className="h-5 w-5">
                  <svg
                    className="animate-spin h-full w-full text-blue-500/80"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                </div>
                <span className="text-sm text-blue-500/80">Searching...</span>
              </div>
            )}
          </div>

          <AnimatePresence mode="wait">
            {groupedResults.length > 0 && (
              <motion.div
                id="search-results"
                role="listbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  // Layout
                  "relative",
                  // Scroll
                  "max-h-[min(65vh,400px)] overflow-y-auto overscroll-contain",
                  // Visual
                  "divide-y divide-gray-200/50",
                  // Scroll styling
                  "scrollbar-thin scrollbar-track-gray-100/50 scrollbar-thumb-gray-300/50",
                  // Animation
                  "transition-all duration-300 ease-out"
                )}
              >
                {groupedResults.map((group, groupIndex) => {
                  const colors = getGroupColors(group.title);
                  return (
                    <div
                      key={group.title}
                      role="group"
                      aria-label={group.title}
                    >
                      <div
                        className={cn(
                          // Layout
                          "sticky top-0 z-10",
                          "px-4 py-2.5 flex items-center gap-2",
                          // Visual
                          "bg-gradient-to-b from-white/95 to-white/90 backdrop-blur-xl",
                          // Typography
                          "text-xs font-semibold tracking-wider",
                          colors.icon
                        )}
                      >
                        <group.icon className="w-3.5 h-3.5 opacity-80" />
                        {group.title}
                        <span className="opacity-60">
                          ({group.results.length})
                        </span>
                      </div>
                      <div className="px-1.5 py-1.5">
                        {group.results.map((result, index) => {
                          const isSelected =
                            selectedGroupIndex === groupIndex &&
                            selectedIndex === index;
                          return (
                            <motion.button
                              key={result.id}
                              role="option"
                              aria-selected={isSelected}
                              onClick={() => handleResultClick(result.href)}
                              className={cn(
                                // Layout
                                "w-full px-2.5 py-2.5",
                                "flex items-start gap-3",
                                "rounded",
                                // States
                                colors.hover,
                                isSelected && colors.selected,
                                // Animation
                                "transition-all duration-300 ease-out"
                              )}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.03,
                                ease: [0.25, 0.1, 0.25, 1],
                              }}
                            >
                              <div
                                className={cn(
                                  // Layout
                                  "relative flex-shrink-0",
                                  "w-10 h-10 rounded",
                                  "flex items-center justify-center",
                                  // Visual
                                  `bg-gradient-to-br ${colors.bg}`,
                                  isSelected
                                    ? `ring-1 ${colors.ring} shadow-[0_4px_12px_-4px_rgba(71,85,105,0.12)]`
                                    : "ring-1 ring-slate-200/40",
                                  // Animation
                                  "transition-all duration-300 ease-out"
                                )}
                              >
                                <group.icon
                                  className={cn(
                                    "w-4.5 h-4.5",
                                    isSelected
                                      ? colors.iconSelected
                                      : colors.icon
                                  )}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center flex-1 min-w-0 gap-2">
                                    <span className="truncate mr-auto text-xs leading-5 font-medium text-slate-900">
                                      {result.title}
                                    </span>
                                    {result.subtitle
                                      .toLowerCase()
                                      .includes("receivable") && (
                                      <span className="flex-shrink-0  inline-flex items-center rounded bg-emerald-50 px-2 py-[2px] text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                                        Receivable
                                      </span>
                                    )}
                                    {result.subtitle
                                      .toLowerCase()
                                      .includes("payable") && (
                                      <span className="flex-shrink-0 inline-flex items-center rounded bg-rose-50 px-2 py-[2px] text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-600/20">
                                        Expense
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-shrink-0">
                                    <kbd className="inline-flex items-center rounded px-1.5 text-xs font-medium text-slate-400/80 bg-slate-100/50 select-none">
                                      ↵
                                    </kbd>
                                  </div>
                                </div>
                                <div
                                  className={cn(
                                    "mt-1 text-xs  text-left w-full leading-5 truncate",
                                    result.subtitle
                                      .toLowerCase()
                                      .includes("receivable")
                                      ? "text-emerald-600/90"
                                      : result.subtitle
                                          .toLowerCase()
                                          .includes("payable")
                                      ? "text-rose-600/90"
                                      : "text-slate-500/90"
                                  )}
                                >
                                  {result.subtitle}
                                </div>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}

            {query && !isLoading && groupedResults.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="px-6 py-14 text-center"
              >
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-100/80 ring-1 ring-slate-200/60 flex items-center justify-center">
                  <SearchIcon className="w-5 h-5 text-slate-400/80" />
                </div>
                <div className="mt-4 text-sm font-medium text-slate-900">
                  No results found
                </div>
                <div className="mt-1 text-sm text-slate-500/90">
                  Try adjusting your search terms
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {groupedResults.length > 0 && (
            <div
              className={cn(
                // Layout
                "sticky bottom-0",
                "p-3 flex items-center justify-between",
                // Visual
                "border-t border-gray-200/50",
                "bg-gradient-to-b from-white/50 via-white/80 to-white/95 backdrop-blur-xl",
                // Typography
                "text-xs text-slate-500/90",
                // Animation
                "transition-all duration-300 ease-out"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <kbd className="inline-flex items-center rounded px-1.5 font-medium bg-slate-100/70 text-slate-500/80">
                    ↑
                  </kbd>
                  <kbd className="inline-flex items-center rounded px-1.5 font-medium bg-slate-100/70 text-slate-500/80">
                    ↓
                  </kbd>
                  <span className="ml-1">to navigate</span>
                </div>
                <div className="flex items-center gap-1">
                  <kbd className="inline-flex items-center rounded px-1.5 font-medium bg-slate-100/70 text-slate-500/80">
                    ↵
                  </kbd>
                  <span className="ml-1">to select</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="inline-flex items-center rounded px-1.5 font-medium bg-slate-100/70 text-slate-500/80">
                  esc
                </kbd>
                <span className="ml-1">to close</span>
              </div>
            </div>
          )}
        </div>
      </Command.Dialog>
    </>
  );
}
