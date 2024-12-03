import { pb } from '../pocketbase';
import type { Invoice } from '../pocketbase';

interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalSpending: number;
  recentInvoices: Invoice[];
}

class DashboardService {
  async getStats(dateRange?: { from: string; to: string }): Promise<DashboardStats> {
    try {
      const filter = dateRange 
        ? `created >= '${dateRange.from}' && created <= '${dateRange.to}'`
        : '';

      // Get recent invoices with expanded customer data
      const invoices = await pb.collection('invoices').getList(1, 5, {
        filter,
        sort: '-created',
        expand: 'customerId',
      });

      // Calculate totals
      const totalIncome = invoices.items.reduce((sum, invoice) => {
        return invoice.status === 'paid' ? sum + invoice.total : sum;
      }, 0);

      const totalSpending = invoices.items.reduce((sum, invoice) => {
        return invoice.type === 'expense' ? sum + invoice.total : sum;
      }, 0);

      return {
        totalBalance: totalIncome - totalSpending,
        totalIncome,
        totalSpending,
        recentInvoices: invoices.items,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();