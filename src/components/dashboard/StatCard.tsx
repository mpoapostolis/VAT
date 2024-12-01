import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any;
  color: string;
  bgGlow: string;
  index: number;
}

export function StatCard({ title, value, change, trend, icon: Icon, color, bgGlow, index }: StatCardProps) {
  const trendColor = trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' 
    : trend === 'down' ? 'text-red-600 dark:text-red-400'
    : 'text-gray-600 dark:text-gray-400';

  const trendIcon = trend === 'up' ? '↑' 
    : trend === 'down' ? '↓'
    : '→';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm before:absolute before:inset-0 before:rounded-2xl before:opacity-[0.15] before:transition-opacity hover:before:opacity-[0.25] ${bgGlow}`}
    >
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-xl bg-gradient-to-br ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <span className={`flex items-center text-sm font-medium ${trendColor}`}>
            {change}
            <span className="ml-1">{trendIcon}</span>
          </span>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
          <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </motion.div>
  );
}