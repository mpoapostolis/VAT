import { Invoice } from '@/types';
import { axiosInstance } from './axios-instance';

export const invoiceApi = {
  async getInvoices(): Promise<Invoice[]> {
    const response = await axiosInstance.get('/invoices');
    return response.data;
  },

  async getInvoice(id: string): Promise<Invoice> {
    const response = await axiosInstance.get(`/invoices/${id}`);
    return response.data;
  },

  async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
    const response = await axiosInstance.post('/invoices', invoice);
    return response.data;
  },

  async updateInvoice(id: string, invoice: Partial<Invoice>): Promise<Invoice> {
    const response = await axiosInstance.patch(`/invoices/${id}`, invoice);
    return response.data;
  },

  async deleteInvoice(id: string): Promise<void> {
    await axiosInstance.delete(`/invoices/${id}`);
  },

  async generatePdf(id: string): Promise<Blob> {
    const response = await axiosInstance.get(`/invoices/${id}/pdf`, {
      responseType: 'blob'
    });
    return response.data;
  }
};