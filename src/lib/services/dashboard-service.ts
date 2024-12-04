import { pb } from '../pocketbase';
import type { Invoice } from '../pocketbase';
import { addDays, isWithinInterval, startOfDay } from 'date-fns';

interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  netSales: number;
  closeToEnd: number;
  recentInvoices: Invoice[];
}

class DashboardService {
  async getStats(dateRange?: { from: string; to: string }): Promise<DashboardStats> {
    try {
      const filter = dateRange 
        ? `created >= '${dateRange.from}' && created <= '${dateRange.to}'`
        : '';

      // Get recent invoices with expanded customer data
      const invoices = await pb.collection('invoices').getList(1, 500, {
        filter,
        sort: '-created',
        expand: 'customerId',
      });

      // Calculate total revenue (sum of all invoice totals)
      const totalRevenue = invoices.items.reduce((sum, invoice) => {
        return sum + invoice.total;
      }, 0);

      // Calculate net sales (revenue minus VAT)
      const netSales = invoices.items.reduce((sum, invoice) => {
        return sum + (invoice.total - (invoice.vat || 0));
      }, 0);

      // Count invoices close to end (due within next 7 days)
      const today = startOfDay(new Date());
      const closeToEnd = invoices.items.reduce((count, invoice) => {
        if (!invoice.dueDate) return count;
        const dueDate = new Date(invoice.dueDate);
        return isWithinInterval(dueDate, {
          start: today,
          end: addDays(today, 7)
        }) ? count + 1 : count;
      }, 0);

      return {
        totalInvoices: invoices.items.length,
        totalRevenue,
        netSales,
        closeToEnd,
        recentInvoices: invoices.items,
      };
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();