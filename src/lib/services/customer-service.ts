import { BaseService } from './base-service';
import type { Customer } from '../pocketbase';
import { pb } from '../pocketbase';
import type { TableParams } from '../hooks/useTableParams';
import { buildPocketBaseParams } from '../hooks/useTableParams';

class CustomerService extends BaseService<Customer> {
  constructor() {
    super('customers');
  }

  async getAll() {
    try {
      return await pb.collection('customers').getFullList();
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  }

  async getList(params: TableParams) {
    try {
      const pocketBaseParams = buildPocketBaseParams(params);
      return await pb.collection('customers').getList(
        params.page,
        params.perPage,
        pocketBaseParams
      );
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();