import React from 'react';
import { motion } from 'framer-motion';
import { useInvoices } from '@/lib/hooks/useInvoices';
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
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, isWithinInterval } from 'date-fns';

export function RevenueChart() {
  const { invoices } = useInvoices();

  // Get the last 6 months
  const today = new Date();
  const sixMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 5, 1);
  const months = eachMonthOfInterval({ start: sixMonthsAgo, end: today });

  // Calculate monthly totals
  const monthlyData = months.map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthInvoices = invoices.filter(invoice => 
      isWithinInterval(new Date(invoice.date), { start: monthStart, end: monthEnd })
    );

    const revenue = monthInvoices.reduce((sum, inv) => sum + inv.totalIncVat, 0);
    const expenses = monthInvoices
      .filter(inv => inv.categoryId && categories.find(c => c.id === inv.categoryId)?.type === 'EXPENSE')
      .reduce((sum, inv) => sum + inv.totalIncVat, 0);

    return {
      month: format(month, 'MMM'),
      revenue,
      expenses
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
    >
      <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
        Revenue Overview
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="month" 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
            />
            <YAxis 
              stroke="#6B7280"
              tick={{ fill: '#6B7280' }}
              tickLine={{ stroke: '#6B7280' }}
              tickFormatter={(value) => formatCurrency(value)}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4F46E5"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRevenue)"
              name="Revenue"
            />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorExpenses)"
              name="Expenses"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
          <div className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Total Revenue
          </div>
          <div className="mt-2 text-2xl font-bold text-indigo-700 dark:text-indigo-300">
            {formatCurrency(monthlyData.reduce((sum, month) => sum + month.revenue, 0))}
          </div>
        </div>
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
          <div className="text-sm font-medium text-red-600 dark:text-red-400">
            Total Expenses
          </div>
          <div className="mt-2 text-2xl font-bold text-red-700 dark:text-red-300">
            {formatCurrency(monthlyData.reduce((sum, month) => sum + month.expenses, 0))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}