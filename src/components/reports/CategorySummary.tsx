import React from 'react';
import { motion } from 'framer-motion';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { useCategories } from '@/lib/hooks/useCategories';
import { calculateCategoryTotals } from '@/lib/utils/category-utils';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export function CategorySummary() {
  const { invoices } = useInvoices();
  const { categories } = useCategories();
  
  const categoryTotals = calculateCategoryTotals(invoices, categories);
  const data = categoryTotals.map(total => ({
    name: categories.find(c => c.id === total.categoryId)?.name || 'Unknown',
    value: total.total,
    color: categories.find(c => c.id === total.categoryId)?.color || '#CBD5E1'
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
    >
      <h2 className="text-xl font-bold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
        Category Distribution
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '0.5rem',
                border: 'none',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {item.name}
              </h3>
            </div>
            <p className="mt-2 text-lg font-bold text-gray-900 dark:text-gray-100">
              {formatCurrency(item.value)}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}