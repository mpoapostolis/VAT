import React from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";

interface SearchResult {
  id: string;
  type: "invoice" | "customer";
  title: string;
  subtitle: string;
  href: string;
}

const mockResults: SearchResult[] = [
  {
    id: "1",
    type: "invoice",
    title: "Invoice #890642",
    subtitle: "Wade Warren - $624,00.90",
    href: "/invoices/1",
  },
  {
    id: "2",
    type: "customer",
    title: "Floyed Miles",
    subtitle: "Employee Manager",
    href: "/customers/2",
  },
  {
    id: "3",
    type: "invoice",
    title: "Invoice #230642",
    subtitle: "Theresa Wedd - $624,00.90",
    href: "/invoices/3",
  },
];

interface SearchDropdownProps {
  onClose: () => void;
}

export function SearchDropdown({ onClose }: SearchDropdownProps) {
  return (
    <div className="absolute top-full left-0 w-96 mt-2 bg-white shadow-xl border border-gray-200/60">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>
      </div>

      <div className="border-t border-gray-100">
        {mockResults.map((result) => (
          <Link
            key={result.id}
            to={result.href}
            className="block px-4 py-3 hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            <div className="flex items-center space-x-3">
              <div
                className={`p-2 ${
                  result.type === "invoice" ? "bg-blue-50" : "bg-green-50"
                }`}
              >
                <div
                  className={`w-2 h-2 ${
                    result.type === "invoice" ? "bg-blue-500" : "bg-green-500"
                  }`}
                />
              </div>
              <div>
                <div className="font-medium text-gray-900">{result.title}</div>
                <div className="text-xs text-gray-500">{result.subtitle}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="text-xs text-gray-500">
          Press{" "}
          <kbd className="px-2 py-1 bg-white border border-gray-200">↵</kbd> to
          select
        </div>
      </div>
    </div>
  );
}
