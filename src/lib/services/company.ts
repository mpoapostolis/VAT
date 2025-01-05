import { BaseService } from "./base-service";
import type { Company } from "@/types/company";
import { pb } from "@/lib/pocketbase";
import type { TableParams } from "@/lib/hooks/useTableParams";

class CompanyService extends BaseService<Company> {
  constructor() {
    super("companies");
  }

  async getList(params: TableParams) {
    try {
      const sortField = params.sort || "-created";

      const result = await pb
        .collection("companies")
        .getList(params.page, params.perPage, {
          sort: sortField,
        });
      return result;
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      throw error;
    }
  }

  async getAll() {
    return this.getList({
      page: 1,
      perPage: 100,
      sort: "-created",
    });
  }

  async getById(id: string): Promise<Company> {
    return pb.collection("companies").getOne(id);
  }

  async create(data: Partial<Company>): Promise<Company> {
    return pb.collection("companies").create(data);
  }

  async update(id: string, data: Partial<Company>): Promise<Company> {
    return pb.collection("companies").update(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return pb.collection("companies").delete(id);
  }
}

export const companyService = new CompanyService();
