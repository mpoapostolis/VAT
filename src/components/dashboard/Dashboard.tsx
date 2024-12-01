import React from 'react';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';
import { StatCard } from './StatCard';
import { RevenueChart } from './RevenueChart';
import { CategorySummary } from '@/components/reports/CategorySummary';
import { CategoryReport } from '@/components/reports/CategoryReport';
import {
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  CalculatorIcon,
  UserGroupIcon,
  ChartBarIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';
import {
  metrics,
  revenueData,
  categoryData,
  recentTransactions,
  upcomingPayments,
  customerMetrics,
  projectStatus,
} from '@/lib/mock/dashboardData';

export function Dashboard() {
  const revenueGrowth = ((metrics.currentMonthRevenue - metrics.lastMonthRevenue) / metrics.lastMonthRevenue * 100).toFixed(1);
  const yearOverYearGrowth = ((metrics.currentYearRevenue - metrics.lastYearRevenue) / metrics.lastYearRevenue * 100).toFixed(1);

  const stats = [
    {
      title: 'Monthly Revenue',
      value: formatCurrency(metrics.currentMonthRevenue),
      change: `${revenueGrowth}% vs last month`,
      trend: Number(revenueGrowth) >= 0 ? 'up' : 'down',
      icon: ArrowTrendingUpIcon,
      color: 'from-violet-500 to-violet-600',
      bgGlow: 'before:bg-violet-500/10',
    },
    {
      title: 'Outstanding Invoices',
      value: formatCurrency(metrics.outstandingInvoices),
      change: `${metrics.customerCount} active clients`,
      trend: 'neutral',
      icon: BanknotesIcon,
      color: 'from-emerald-500 to-emerald-600',
      bgGlow: 'before:bg-emerald-500/10',
    },
    {
      title: 'Overdue Amount',
      value: formatCurrency(metrics.overdueInvoices),
      change: `${projectStatus.atRisk} at risk`,
      trend: 'down',
      icon: ClockIcon,
      color: 'from-red-500 to-red-600',
      bgGlow: 'before:bg-red-500/10',
    },
    {
      title: 'Next VAT Payment',
      value: formatCurrency(metrics.nextVatPayment),
      change: 'Due in 14 days',
      trend: 'neutral',
      icon: CalculatorIcon,
      color: 'from-amber-500 to-amber-600',
      bgGlow: 'before:bg-amber-500/10',
    }
  ];

  const additionalStats = [
    {
      title: 'Active Projects',
      value: projectStatus.totalProjects.toString(),
      change: `${projectStatus.onTrack} on track`,
      trend: 'up',
      icon: ChartBarIcon,
      color: 'from-blue-500 to-blue-600',
      bgGlow: 'before:bg-blue-500/10',
    },
    {
      title: 'Customer Base',
      value: customerMetrics.totalCustomers.toString(),
      change: `${customerMetrics.newCustomersThisMonth} new this month`,
      trend: 'up',
      icon: UserGroupIcon,
      color: 'from-indigo-500 to-indigo-600',
      bgGlow: 'before:bg-indigo-500/10',
    },
    {
      title: 'Avg. Invoice Value',
      value: formatCurrency(metrics.averageInvoiceValue),
      change: `${yearOverYearGrowth}% vs last year`,
      trend: Number(yearOverYearGrowth) >= 0 ? 'up' : 'down',
      icon: BanknotesIcon,
      color: 'from-purple-500 to-purple-600',
      bgGlow: 'before:bg-purple-500/10',
    },
    {
      title: 'Cash Position',
      value: formatCurrency(metrics.cashOnHand),
      change: `${formatCurrency(metrics.projectedRevenue)} projected`,
      trend: 'up',
      icon: BuildingOfficeIcon,
      color: 'from-teal-500 to-teal-600',
      bgGlow: 'before:bg-teal-500/10',
    }
  ];

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-sm p-8">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
        <div className="relative flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white bg-gradient-to-br from-violet-600 to-violet-700 bg-clip-text text-transparent">
              Financial Dashboard
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Real-time overview of your business performance
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-gradient-to-br from-violet-600 to-violet-700 hover:from-violet-500 hover:to-violet-600 shadow-sm transition-all duration-200 hover:shadow-md">
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatCard {...stat} index={index} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {additionalStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
          >
            <StatCard {...stat} index={index} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
          <div className="relative p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Revenue Trend</h3>
            <RevenueChart data={revenueData} />
          </div>
        </motion.div>
        
        <motion.div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
          <div className="relative p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Income by Category</h3>
            <CategorySummary data={categoryData} />
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.0 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
          <div className="relative p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Transactions</h3>
              <select className="form-select rounded-lg border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-800 focus:ring-violet-500 focus:border-violet-500">
                <option>All Transactions</option>
                <option>Invoices Only</option>
                <option>Expenses Only</option>
              </select>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <th className="px-4 py-3">Transaction</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="text-sm">
                      <td className="px-4 py-3 text-gray-900 dark:text-white">
                        {transaction.customer || transaction.description}
                      </td>
                      <td className="px-4 py-3 text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">
                        {formatCurrency(transaction.amount)}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                          ${transaction.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent"></div>
          <div className="relative p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Upcoming Payments</h3>
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {payment.customer || payment.description}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Due {new Date(payment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {payment.type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}