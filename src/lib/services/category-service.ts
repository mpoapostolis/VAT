import { BaseService } from "./base-service";
import type { Category, Invoice } from "../pocketbase";
import { pb } from "../pocketbase";

class CategoryService extends BaseService<Category> {
  constructor() {
    super("categories");
  }

  async getWithInvoices(id: string) {
    try {
      // Get category details
      const category = await this.getById(id);

      // Get related invoices
      const invoices = await pb.collection("invoices").getList(1, 50, {
        filter: `categoryId = '${id}'`,
        expand: "customerId",
        sort: "-date",
      });

      // Calculate totals
      const totalAmount = invoices.items.reduce(
        (sum, invoice) => sum + invoice.total,
        0
      );
      const paidAmount = invoices.items
        .filter((invoice) => invoice.status === "paid")
        .reduce((sum, invoice) => sum + invoice.total, 0);
      const pendingAmount = totalAmount - paidAmount;

      return {
        ...category,
        invoices: invoices.items,
        stats: {
          totalAmount,
          paidAmount,
          pendingAmount,
          invoiceCount: invoices.items.length,
        },
      };
    } catch (error) {
      console.error("Failed to fetch category with invoices:", error);
      throw error;
    }
  }

  async getListWithStats() {
    try {
      const result = await pb.collection("categories").getList(1, 50, {
        sort: "-created",
      });

      // Get all invoices in one query
      const invoices = await pb.collection("invoices").getList(1, 1000, {
        fields: "id,categoryId,total",
      });

      // Calculate stats for each category
      const itemsWithStats = result.items.map((category) => {
        const categoryInvoices = invoices.items.filter(
          (invoice) => invoice.categoryId === category.id
        );
        return {
          ...category,
          invoiceCount: categoryInvoices.length,
          totalAmount: categoryInvoices.reduce(
            (sum, invoice) => sum + invoice.total,
            0
          ),
        };
      });

      return {
        ...result,
        items: itemsWithStats,
      };
    } catch (error) {
      console.error("Failed to fetch categories with stats:", error);
      throw error;
    }
  }
}

export const categoryService = new CategoryService();
