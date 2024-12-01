import React from 'react';
import { motion } from 'framer-motion';
import { formatCurrency } from '@/lib/utils';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface RevenueData {
  month: string;
  revenue: number;
  expenses: number;
  profit: () => number;
}

interface Props {
  data: RevenueData[];
}

export function RevenueChart({ data }: Props) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-sm text-violet-600 dark:text-violet-400">
              Revenue: {formatCurrency(payload[0].value)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Expenses: {formatCurrency(payload[1].value)}
            </p>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">
              Profit: {formatCurrency(payload[0].value - payload[1].value)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
  const totalProfit = data.reduce((sum, item) => sum + item.profit(), 0);
  const averageRevenue = totalRevenue / data.length;
  const growthRate = ((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20"
        >
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Revenue
          </div>
          <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totalRevenue)}
          </div>
          <div className="text-sm text-violet-600 dark:text-violet-400">
            {growthRate}% growth
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20"
        >
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Profit
          </div>
          <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(totalProfit)}
          </div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400">
            {(totalProfit / totalRevenue * 100).toFixed(1)}% margin
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/20"
        >
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Average Monthly
          </div>
          <div className="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
            {formatCurrency(averageRevenue)}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-400">
            Monthly average
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="h-[300px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6B7280" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#6B7280" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="month"
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6B7280"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `€${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#8B5CF6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#6B7280"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpenses)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}