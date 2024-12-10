import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search as SearchIcon,
  Building2,
  FileText,
  FolderOpen,
  Calculator,
} from "lucide-react";
import useSWR from "swr";
import { searchService } from "@/lib/services/search-service";
import { formatCurrency } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [groupedResults, setGroupedResults] = useState<SearchGroup[]>([]);
  const { data: searchResults, mutate } = useSWR(
    query ? ["search", query] : null,
    () => searchService.search(query)
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
          subtitle: `${
            invoice.expand?.customerId?.name || "Unknown"
          } - ${formatCurrency(invoice.total)}`,
          href: `/invoices/${invoice.id}`,
        })),
      },
      {
        title: "Customers",
        icon: Building2,
        results: searchResults.customers.map((customer) => ({
          id: customer.id,
          title: customer.name,
          subtitle: customer.email,
          href: `/customers/${customer.id}`,
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
          href: `/categories/${category.id}`,
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
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <SearchIcon className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search invoices, customers, and more..."
          className="w-full h-10 pl-10 pr-4 text-sm text-[#0F172A] placeholder-[#94A3B8] bg-[#F8FAFC] border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all"
        />
      </div>

      <AnimatePresence>
        {groupedResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-1 bg-white border border-black/10 rounded-lg shadow-lg overflow-hidden"
          >
            {groupedResults.map((group, groupIndex) => (
              <div key={group.title}>
                <div className="px-4 py-2 bg-[#F8FAFC] flex items-center space-x-2">
                  <group.icon className="w-4 h-4 text-[#64748B]" />
                  <div className="text-sm font-medium text-[#0F172A] tracking-tight">
                    {group.title}
                  </div>
                  <div className="text-[11px] text-[#64748B] font-medium tracking-wide uppercase">
                    ({group.results.length})
                  </div>
                </div>
                <div>
                  {group.results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      onClick={() => handleResultClick(result.href)}
                      className="w-full px-4 py-2 text-left hover:bg-[#F8FAFC] transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center">
                          <group.icon className="w-4 h-4 text-[#3B82F6]" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-[#0F172A]">
                            {result.title}
                          </div>
                          <div className="text-xs text-[#64748B]">
                            {result.subtitle}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
