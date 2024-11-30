import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useVatReturns } from '@/lib/hooks/useVatReturns';
import { PlusIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { VatReturnCard } from './VatReturnCard';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ViewToggle } from '../ui/ViewToggle';
import { motion, AnimatePresence } from 'framer-motion';

export function VatReturnList() {
  const { vatReturns, isLoading, isError } = useVatReturns();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-600 dark:text-red-400">Error loading VAT returns</div>
    );
  }

  const filteredReturns = vatReturns?.filter(vatReturn => 
    statusFilter === 'all' || vatReturn.status === statusFilter
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            VAT Returns
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your VAT returns and submissions
          </p>
        </div>
        <div className="flex items-center gap-4">
          <ViewToggle view={view} onViewChange={setView} />
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg pl-4 pr-10 py-2 text-sm text-gray-700 dark:text-gray-300 shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
            >
              <option value="all">All Status</option>
              <option value="DRAFT">Draft</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
            </select>
            <FunnelIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
          <Link
            to="/vat-returns/new"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            New VAT Return
          </Link>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={
            view === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
              : 'space-y-4'
          }
        >
          {filteredReturns?.map((vatReturn) => (
            <VatReturnCard 
              key={vatReturn.id} 
              vatReturn={vatReturn}
              layout={view}
            />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}