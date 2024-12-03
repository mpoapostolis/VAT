import { BaseService } from './base-service';
import type { Invoice } from '@/lib/pocketbase';
import { pb } from '@/lib/pocketbase';
import type { TableParams } from '@/lib/hooks/useTableParams';
import { buildPocketBaseParams } from '@/lib/hooks/useTableParams';

class InvoiceService extends BaseService<Invoice> {
  constructor() {
    super('invoices');
  }

  async getList(params: TableParams) {
    try {
      const pocketBaseParams = buildPocketBaseParams(params);
      return await pb.collection('invoices').getList(
        params.page,
        params.perPage,
        {
          ...pocketBaseParams,
          expand: 'customerId',
        }
      );
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      throw error;
    }
  }

  async updateStatus(id: string, status: Invoice['status']) {
    return this.update(id, { status });
  }
}

export const invoiceService = new InvoiceService();