import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  index: number;
}

export function StatCard({ title, value, change, trend, icon: Icon, color, index }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div 
        className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-all duration-500 blur-xl rounded-xl -z-10"
        style={{ backgroundImage: `linear-gradient(to right, ${color})` }} 
      />
      <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center space-x-2">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${color}`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">{title}</h3>
            </div>
            {trend && (
              <div className={`flex items-center space-x-1 text-sm ${
                trend === 'up' ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
              }`}>
                {trend === 'up' ? (
                  <ArrowUpIcon className="h-4 w-4" />
                ) : (
                  <ArrowDownIcon className="h-4 w-4" />
                )}
                <span>{change}</span>
              </div>
            )}
          </div>
          <div className="mt-3">
            <div 
              className="text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent animate-gradient-x"
              style={{ backgroundImage: `linear-gradient(to right, ${color})` }}
            >
              {value}
            </div>
          </div>
        </div>
        <div 
          className="h-1 bg-gradient-to-r w-full" 
          style={{ backgroundImage: `linear-gradient(to right, ${color})` }} 
        />
      </div>
    </motion.div>
  );
}