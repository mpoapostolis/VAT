import { pb } from "../pocketbase";

class SearchService {
  async search(query: string) {
    try {
      const [invoices, customers, categories, vatReturns, companies] =
        await Promise.all([
          pb.collection("invoices").getList(1, 15, {
            filter: `number ~ '${query}'`,
            expand: "customerId",
            sort: "-created",
          }),
          pb.collection("customers").getList(1, 15, {
            filter: `name ~ '${query}' || email ~ '${query}'`,
            sort: "-created",
          }),
          pb.collection("categories").getList(1, 15, {
            filter: `name ~ '${query}'`,
            sort: "-created",
          }),
          pb.collection("vat_returns").getList(1, 15, {
            filter: `period ~ '${query}'`,
            sort: "-created",
          }),
          pb.collection("companies").getList(1, 15, {
            filter: `companyNameEN ~ '${query}'`,
            sort: "-created",
          }),
        ]);

      return {
        invoices: invoices.items,
        customers: customers.items,
        categories: categories.items,
        vatReturns: vatReturns.items,
        companies: companies.items,
      };
    } catch (error) {
      console.error("Search failed:", error);
      throw error;
    }
  }
}

export const searchService = new SearchService();
