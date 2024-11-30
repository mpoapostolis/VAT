import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Column {
  key: string;
  title: string;
  width?: number;
  render?: (value: any, item: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  keyField: string;
  onRowClick?: (item: any) => void;
  actions?: (item: any) => React.ReactNode;
  isLoading?: boolean;
}

export function DataTable({ columns, data, keyField, onRowClick, actions, isLoading }: DataTableProps) {
  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
      <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-100"
                style={column.width ? { width: column.width } : undefined}
              >
                {column.title}
              </th>
            ))}
            {actions && (
              <th scope="col" className="relative py-3.5 pl-3 pr-4">
                <span className="sr-only">Actions</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
          <AnimatePresence>
            {data.map((item) => (
              <motion.tr
                key={item[keyField]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onRowClick?.(item)}
                className={`${
                  onRowClick ? 'cursor-pointer' : ''
                } hover:bg-gray-50 dark:hover:bg-gray-800`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400"
                  >
                    {column.render
                      ? column.render(item[column.key], item)
                      : item[column.key]}
                  </td>
                ))}
                {actions && (
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium">
                    {actions(item)}
                  </td>
                )}
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
