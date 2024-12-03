import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import useSWR from 'swr';
import { pb } from '@/lib/pocketbase';
import type { Invoice, Customer } from '@/lib/pocketbase';

interface SearchResult {
  id: string;
  type: 'invoice' | 'customer';
  title: string;
  subtitle: string;
  href: string;
}

export function Search() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const { data: invoices } = useSWR<{ items: Invoice[] }>('invoices');
  const { data: customers } = useSWR<{ items: Customer[] }>('customers');

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    // Search invoices
    invoices?.items.forEach((invoice) => {
      if (invoice.number.toLowerCase().includes(lowerQuery)) {
        searchResults.push({
          id: invoice.id,
          type: 'invoice',
          title: `Invoice ${invoice.number}`,
          subtitle: `${invoice.total} - ${invoice.status}`,
          href: `/invoices/${invoice.id}`,
        });
      }
    });

    // Search customers
    customers?.items.forEach((customer) => {
      if (
        customer.name.toLowerCase().includes(lowerQuery) ||
        customer.email.toLowerCase().includes(lowerQuery)
      ) {
        searchResults.push({
          id: customer.id,
          type: 'customer',
          title: customer.name,
          subtitle: customer.email,
          href: `/customers/${customer.id}`,
        });
      }
    });

    setResults(searchResults);
  }, [query, invoices, customers]);

  const handleResultClick = (href: string) => {
    navigate(href);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative w-96">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search invoices and customers..."
          className="w-full bg-white/10 text-white placeholder-white/50 pl-10 pr-4 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all"
        />
      </div>

      {results.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 shadow-xl animate-scale-in">
          {results.map((result) => (
            <button
              key={`${result.type}-${result.id}`}
              onClick={() => handleResultClick(result.href)}
              className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className={`p-2 ${
                result.type === 'invoice' ? 'bg-blue-50' : 'bg-green-50'
              }`}>
                <div className={`w-2 h-2 ${
                  result.type === 'invoice' ? 'bg-blue-500' : 'bg-green-500'
                }`} />
              </div>
              <div>
                <div className="font-medium text-gray-900">{result.title}</div>
                <div className="text-sm text-gray-500">{result.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}