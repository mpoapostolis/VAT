import { pb } from '../pocketbase';
import type { TableParams } from '../hooks/useTableParams';
import { buildPocketBaseParams } from '../hooks/useTableParams';

export class BaseService<T> {
  protected collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  async getList(params: TableParams) {
    try {
      const pocketBaseParams = buildPocketBaseParams(params);
      return await pb.collection(this.collection).getList(
        params.page,
        params.perPage,
        pocketBaseParams
      );
    } catch (error) {
      console.error(`Failed to fetch ${this.collection}:`, error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      return await pb.collection(this.collection).getOne(id);
    } catch (error) {
      console.error(`Failed to fetch ${this.collection}:`, error);
      throw error;
    }
  }

  async create(data: Omit<T, 'id'>) {
    try {
      return await pb.collection(this.collection).create(data);
    } catch (error) {
      console.error(`Failed to create ${this.collection}:`, error);
      throw error;
    }
  }

  async update(id: string, data: Partial<T>) {
    try {
      return await pb.collection(this.collection).update(id, data);
    } catch (error) {
      console.error(`Failed to update ${this.collection}:`, error);
      throw error;
    }
  }

  async delete(id: string) {
    try {
      await pb.collection(this.collection).delete(id);
      return true;
    } catch (error) {
      console.error(`Failed to delete ${this.collection}:`, error);
      throw error;
    }
  }
}