import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { InvoiceCard } from './InvoiceCard';
import { InvoiceFilters } from './InvoiceFilters';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ViewToggle } from '../ui/ViewToggle';
import { motion, AnimatePresence } from 'framer-motion';

interface InvoiceFilters {
  status?: string;
  dateFrom?: Date;
  dateTo?: Date;
  categoryId?: string;
  minAmount?: number;
  maxAmount?: number;
}

export function InvoiceList() {
  const { invoices, isLoading, isError } = useInvoices();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<InvoiceFilters>({});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">Error loading invoices</div>
    );
  }

  const filteredInvoices = invoices?.filter(invoice => {
    if (filters.status && invoice.status !== filters.status) return false;
    if (filters.categoryId && invoice.categoryId !== filters.categoryId) return false;
    if (filters.dateFrom && new Date(invoice.date) < filters.dateFrom) return false;
    if (filters.dateTo && new Date(invoice.date) > filters.dateTo) return false;
    if (filters.minAmount && invoice.totalIncVat < filters.minAmount) return false;
    if (filters.maxAmount && invoice.totalIncVat > filters.maxAmount) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent font-display">
            Invoices
          </h1>
          <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
            Manage and track your invoices
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-200 dark:border-gray-700 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filters
          </button>
          <ViewToggle view={view} onViewChange={setView} />
          <Link
            to="/invoices/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New Invoice
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <InvoiceFilters
            filters={filters}
            onFilterChange={setFilters}
            onReset={() => setFilters({})}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {filteredInvoices?.map((invoice) => (
            <InvoiceCard 
              key={invoice.id} 
              invoice={invoice} 
              layout={view}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}