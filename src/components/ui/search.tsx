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
    <div className="relative md:w-96 w-80">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search invoices, customers, and more..."
          className="w-full bg-gray-50 text-gray-900 placeholder-gray-500 pl-10 pr-4 py-2.5 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0066FF]/10 focus:border-[#0066FF] transition-all rounded text-sm"
        />
      </div>

      <AnimatePresence>
        {groupedResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-lg shadow-gray-100/40 rounded divide-y divide-gray-100 overflow-hidden z-50 max-h-[80vh] overflow-y-auto"
          >
            {groupedResults.map((group, groupIndex) => (
              <div key={group.title}>
                <div className="px-4 py-2 bg-gray-50/50 flex items-center space-x-2">
                  <group.icon className="h-4 w-4 text-gray-400" />
                  <div className="text-sm font-medium text-gray-700">
                    {group.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    ({group.results.length})
                  </div>
                </div>
                <div>
                  {group.results.map((result, index) => (
                    <motion.button
                      key={result.id}
                      onClick={() => handleResultClick(result.href)}
                      className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left group"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div
                        className={`p-2 rounded ${
                          group.title === "Invoices"
                            ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100"
                            : group.title === "Customers"
                            ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                            : group.title === "Categories"
                            ? "bg-violet-50 text-violet-600 group-hover:bg-violet-100"
                            : "bg-amber-50 text-amber-600 group-hover:bg-amber-100"
                        }`}
                      >
                        <group.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {result.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {result.subtitle}
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
