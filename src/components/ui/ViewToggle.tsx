import React from 'react';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-1 flex space-x-1">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('grid')}
        className={`p-2 rounded-md transition-colors ${
          view === 'grid'
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <Squares2X2Icon className="h-5 w-5" />
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onViewChange('list')}
        className={`p-2 rounded-md transition-colors ${
          view === 'list'
            ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
        }`}
      >
        <ListBulletIcon className="h-5 w-5" />
      </motion.button>
    </div>
  );
}