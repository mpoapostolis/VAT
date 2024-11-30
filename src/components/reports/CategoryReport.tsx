import React from 'react';
import { motion } from 'framer-motion';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { useCategories } from '@/lib/hooks/useCategories';
import { calculateCategoryTotals } from '@/lib/utils/category-utils';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export function CategoryReport() {
  const { invoices } = useInvoices();
  const { categories } = useCategories();
  
  const categoryTotals = calculateCategoryTotals(invoices, categories);
  const data = categoryTotals.map(total => ({
    name: categories.find(c => c.id === total.categoryId)?.name || 'Unknown',
    amount: total.total,
    count: total.count
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
        Category Analysis
      </h2>

      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="name" 
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
            <Bar
              dataKey="amount"
              fill="url(#colorGradient)"
              radius={[4, 4, 0, 0]}
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#7C3AED" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {item.name}
            </h3>
            <div className="mt-2 flex justify-between items-end">
              <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatCurrency(item.amount)}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {item.count} invoices
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}