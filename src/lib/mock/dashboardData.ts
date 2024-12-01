import { addMonths, subMonths, format } from 'date-fns';

// Generate last 12 months of dates
const generateLastTwelveMonths = () => {
  const months = [];
  for (let i = 11; i >= 0; i--) {
    const date = subMonths(new Date(), i);
    months.push(format(date, 'MMM yyyy'));
  }
  return months;
};

export const metrics = {
  currentMonthRevenue: 128750.00,
  lastMonthRevenue: 115200.00,
  currentYearRevenue: 1250000.00,
  lastYearRevenue: 980000.00,
  outstandingInvoices: 45200.00,
  overdueInvoices: 12800.00,
  nextVatPayment: 24150.00,
  customerCount: 84,
  averageInvoiceValue: 4250.00,
  cashOnHand: 285000.00,
  projectedRevenue: 145000.00
};

export const categoryData = [
  { name: 'Consulting Services', value: 450000, percentage: 36, trend: 'up' },
  { name: 'Software Development', value: 380000, percentage: 30.4, trend: 'up' },
  { name: 'Cloud Solutions', value: 220000, percentage: 17.6, trend: 'neutral' },
  { name: 'Training & Support', value: 120000, percentage: 9.6, trend: 'up' },
  { name: 'Hardware Sales', value: 80000, percentage: 6.4, trend: 'down' }
];

export const revenueData = generateLastTwelveMonths().map((month, index) => ({
  month,
  revenue: Math.floor(95000 + Math.random() * 35000),
  expenses: Math.floor(65000 + Math.random() * 15000),
  profit: function() { return this.revenue - this.expenses; }
}));

export const recentTransactions = [
  {
    id: 1,
    customer: 'TechCorp Solutions',
    date: '2024-01-15',
    amount: 12500.00,
    status: 'completed',
    type: 'invoice'
  },
  {
    id: 2,
    customer: 'Global Innovations Ltd',
    date: '2024-01-14',
    amount: 8750.00,
    status: 'pending',
    type: 'invoice'
  },
  {
    id: 3,
    description: 'Cloud Infrastructure',
    date: '2024-01-13',
    amount: 4200.00,
    status: 'completed',
    type: 'expense'
  },
  {
    id: 4,
    customer: 'Digital Dynamics',
    date: '2024-01-12',
    amount: 15800.00,
    status: 'overdue',
    type: 'invoice'
  },
  {
    id: 5,
    customer: 'Smart Systems Inc',
    date: '2024-01-11',
    amount: 9200.00,
    status: 'completed',
    type: 'invoice'
  }
];

export const upcomingPayments = [
  {
    id: 1,
    customer: 'NextGen Solutions',
    dueDate: '2024-01-25',
    amount: 18500.00,
    type: 'invoice'
  },
  {
    id: 2,
    description: 'Quarterly VAT Payment',
    dueDate: '2024-01-31',
    amount: 24150.00,
    type: 'tax'
  },
  {
    id: 3,
    customer: 'Tech Innovators',
    dueDate: '2024-02-05',
    amount: 12800.00,
    type: 'invoice'
  },
  {
    id: 4,
    description: 'Software Licenses',
    dueDate: '2024-02-10',
    amount: 5400.00,
    type: 'subscription'
  }
];

export const customerMetrics = {
  totalCustomers: 84,
  newCustomersThisMonth: 6,
  activeCustomers: 72,
  customerRetentionRate: 94
};

export const projectStatus = {
  totalProjects: 28,
  onTrack: 22,
  delayed: 4,
  atRisk: 2,
  completed: 45
};
