import { pb } from '../pocketbase';
import type { Company } from '../../types/company';

const COLLECTION = 'companies';

export const companyService = {
  async create(data: Omit<Company, 'id' | 'created' | 'updated'>) {
    return pb.collection(COLLECTION).create(data);
  },

  async update(id: string, data: Partial<Company>) {
    return pb.collection(COLLECTION).update(id, data);
  },

  async getById(id: string) {
    return pb.collection(COLLECTION).getOne(id);
  },

  async list(page = 1, perPage = 30) {
    return pb.collection(COLLECTION).getList(page, perPage, {
      sort: '-created'
    });
  },

  async delete(id: string) {
    return pb.collection(COLLECTION).delete(id);
  },

  // Helper function to get companies for SWR
  async getCompanies(key: string) {
    const [_, page, perPage] = key.split('/');
    return companyService.list(Number(page), Number(perPage));
  }
};
