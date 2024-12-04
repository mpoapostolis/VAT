import { BaseService } from './base-service';
import type { VatReturn } from '../pocketbase';
import { pb } from '../pocketbase';

class VatReturnService extends BaseService<VatReturn> {
  constructor() {
    super('vat_returns');
  }


  async getAll() {
    try {
      return await pb.collection(this.collection).getFullList(500);
    } catch (error) {
      console.error(`Failed to fetch ${this.collection}:`, error);
      throw error;
    }
  }

  async calculateVatTotals(startDate: string, endDate: string) {
    try {
      // Get all paid invoices within the date range
      const invoices = await pb.collection('invoices').getList(1, 1000, {
        filter: `status = 'paid' && date >= '${startDate}' && date <= '${endDate}'`,
      });

      let salesVat = 0;
      let purchasesVat = 0;

      invoices.items.forEach(invoice => {
        // Sum up VAT based on invoice type
        const vatAmount = invoice.vat || 0;
        if (invoice.type === 'income') {
          salesVat += vatAmount;
        } else {
          purchasesVat += vatAmount;
        }
      });

      return {
        salesVat,
        purchasesVat,
        netVat: salesVat - purchasesVat,
      };
    } catch (error) {
      console.error('Failed to calculate VAT totals:', error);
      throw error;
    }
  }

  async submit(id: string) {
    return this.update(id, {
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    });
  }
}

export const vatReturnService = new VatReturnService();