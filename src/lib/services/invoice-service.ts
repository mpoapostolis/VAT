import { BaseService } from './base-service';
import type { Invoice } from '@/lib/pocketbase';
import { pb } from '@/lib/pocketbase';
import type { TableParams } from '@/lib/hooks/useTableParams';

class InvoiceService extends BaseService<Invoice> {
  constructor() {
    super('invoices');
  }

  async getList(params: TableParams) {
    try {
      console.log('Fetching invoices with params:', params);
      const result = await pb.collection('invoices').getList(
        params.page,
        params.perPage,
        {
          expand: 'customerId,categoryId',
          sort: params.sort || '-created'
        }
      );
      console.log('Fetched invoices:', result);
      return result;
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      throw error;
    }
  }

  async getById(id: string) {
    try {
      console.log('Fetching invoice with id:', id);
      const result = await pb.collection('invoices').getOne(id, {
        expand: 'customerId,categoryId',
      });
      console.log('Fetched invoice:', result);
      return result;
    } catch (error) {
      console.error('Failed to get invoice:', error);
      throw error;
    }
  }

  async create(data: Partial<Invoice>) {
    try {
      console.log('Creating invoice with data:', data);
      const result = await pb.collection('invoices').create(data);
      console.log('Created invoice:', result);
      return result;
    } catch (error) {
      console.error('Failed to create invoice:', error);
      throw error;
    }
  }

  async update(id: string, data: Partial<Invoice>) {
    try {
      console.log('Updating invoice with id:', id, 'and data:', data);
      const result = await pb.collection('invoices').update(id, data);
      console.log('Updated invoice:', result);
      return result;
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  }

  async updateStatus(id: string, status: Invoice['status']) {
    console.log('Updating invoice status with id:', id, 'and status:', status);
    return this.update(id, { status });
  }

  async delete(id: string) {
    try {
      console.log('Deleting invoice with id:', id);
      const result = await pb.collection('invoices').delete(id);
      console.log('Deleted invoice:', result);
      return result;
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  }
}

export const invoiceService = new InvoiceService();