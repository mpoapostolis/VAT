import React from 'react';
import { motion } from 'framer-motion';
import { VatReturn } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  DocumentCheckIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  AdjustmentsHorizontalIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

interface VatReturnCardProps {
  vatReturn: VatReturn;
  onClick?: () => void;
  layout?: 'grid' | 'list';
}

export function VatReturnCard({ vatReturn, onClick, layout = 'grid' }: VatReturnCardProps) {
  const statusConfig = {
    DRAFT: { 
      className: 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700' 
    },
    SUBMITTED: { 
      className: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50' 
    },
    ACCEPTED: { 
      className: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800/50' 
    },
    REJECTED: { 
      className: 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50' 
    }
  };

  if (layout === 'list') {
    return (
      <motion.div
        whileHover={{ x: 4 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
        onClick={onClick}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
                <DocumentCheckIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(vatReturn.startDate)} - {formatDate(vatReturn.endDate)}
                    </span>
                  </div>
                  <div className={`px-3 py-1 rounded-full ${statusConfig[vatReturn.status].className}`}>
                    <span className="text-sm font-medium">{vatReturn.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {formatCurrency(vatReturn.netVatDue)}
              </span>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Net VAT Due
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border border-gray-100 dark:border-gray-700"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg">
              <DocumentCheckIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(vatReturn.startDate)} - {formatDate(vatReturn.endDate)}
                </span>
              </div>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full ${statusConfig[vatReturn.status].className}`}>
            <span className="text-sm font-medium">{vatReturn.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 space-y-2">
            <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
              <ArrowTrendingUpIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Sales VAT</span>
            </div>
            <p className="text-lg font-semibold text-green-700 dark:text-green-300">
              {formatCurrency(vatReturn.salesVat)}
            </p>
          </div>
          
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 space-y-2">
            <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
              <ArrowTrendingDownIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Purchases VAT</span>
            </div>
            <p className="text-lg font-semibold text-red-700 dark:text-red-300">
              {formatCurrency(vatReturn.purchasesVat)}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="text-sm">Adjustments</span>
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatCurrency(vatReturn.adjustments)}
            </span>
          </div>

          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20 p-4 rounded-lg">
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Net VAT Due</span>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 dark:from-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              {formatCurrency(vatReturn.netVatDue)}
            </span>
          </div>
        </div>
      </div>

      <div className="h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500" />
    </motion.div>
  );
}