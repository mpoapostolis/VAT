import { Customer } from '@/types';
import { axiosInstance } from './axios-instance';

export const customerApi = {
  async getCustomers(): Promise<Customer[]> {
    const response = await axiosInstance.get('/customers');
    return response.data;
  },

  async getCustomer(id: string): Promise<Customer> {
    const response = await axiosInstance.get(`/customers/${id}`);
    return response.data;
  },

  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const response = await axiosInstance.post('/customers', customer);
    return response.data;
  },

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    const response = await axiosInstance.patch(`/customers/${id}`, customer);
    return response.data;
  },

  async deleteCustomer(id: string): Promise<void> {
    await axiosInstance.delete(`/customers/${id}`);
  }
};