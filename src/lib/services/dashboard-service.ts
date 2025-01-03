import { pb } from "../pocketbase";
import type { Invoice } from "../pocketbase";
import { addDays, isWithinInterval, startOfDay } from "date-fns";

interface DashboardStats {
  totalInvoices: number;
  totalRevenue: number;
  netSales: number;
  closeToEnd: number;
  recentTransactions: Invoice[];
}

interface DashboardFilters {
  from?: string;
  to?: string;
  companyId?: string;
}

class DashboardService {
  async getStats(filters?: DashboardFilters): Promise<DashboardStats> {
    try {
      let filterConditions = [];
      
      if (filters?.from && filters?.to) {
        filterConditions.push(`date >= '${filters.from}' && date <= '${filters.to}'`);
      }
      
      if (filters?.companyId) {
        filterConditions.push(`companyId = '${filters.companyId}'`);
      }

      const filter = filterConditions.join(" && ");

      // Get recent invoices with expanded customer and category data
      const invoices = await pb.collection("invoices").getList(1, 500, {
        filter,
        sort: "-date",
        expand: "customerId,categoryId",
      });

      // Calculate total revenue (sum of all invoice totals)
      const totalRevenue = invoices.items.reduce((sum, invoice) => {
        return sum + (invoice.total || 0);
      }, 0);

      // Calculate net sales (revenue minus VAT)
      const netSales = invoices.items.reduce((sum, invoice) => {
        return sum + ((invoice.total || 0) - (invoice.vat || 0));
      }, 0);

      // Count invoices close to end (due within next 7 days)
      const today = startOfDay(new Date());
      const closeToEnd = invoices.items.reduce((count, invoice) => {
        if (!invoice.dueDate) return count;
        const dueDate = new Date(invoice.dueDate);
        return isWithinInterval(dueDate, {
          start: today,
          end: addDays(today, 7),
        })
          ? count + 1
          : count;
      }, 0);

      // Update overdue invoices
      await this.updateOverdueInvoices(invoices.items);

      // Get the 5 most recent invoices
      const recentTransactions = invoices.items
        .sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);
          if (dateA.getTime() === dateB.getTime()) {
            return a.id.localeCompare(b.id);
          }
          return dateB.getTime() - dateA.getTime();
        })
        .slice(0, 5);

      return {
        totalInvoices: invoices.items.length,
        totalRevenue,
        netSales,
        closeToEnd,
        recentTransactions,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`);
    }
  }

  private async updateOverdueInvoices(invoices: Invoice[]) {
    const today = startOfDay(new Date());
    const overdueInvoices = invoices.filter((invoice) => {
      return (
        invoice.status === "pending" &&
        invoice.dueDate &&
        new Date(invoice.dueDate) < today
      );
    });

    // Update status to overdue for relevant invoices
    const updatePromises = overdueInvoices.map((invoice) =>
      pb.collection("invoices").update(invoice.id, {
        status: "overdue",
      })
    );

    try {
      await Promise.all(updatePromises);
    } catch (error) {
      console.error("Failed to update overdue invoices:", error);
      throw new Error(`Failed to update overdue invoices: ${error.message}`);
    }
  }
}

export const dashboardService = new DashboardService();
