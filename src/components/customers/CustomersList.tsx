import React from 'react';
import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { Eye, FileEdit, Trash2, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Customer } from '@/lib/pocketbase';

export function CustomersList() {
  const { data } = useSWR<{ items: Customer[] }>('customers');

  const handleDeleteCustomer = (customerId: string) => {
    // Handle customer deletion
    console.log('Deleting customer:', customerId);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Customer
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Email
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Phone
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Tax Registration Number
            </th>
            <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 border-b border-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="stagger-animate">
          {data?.items.map((customer) => (
            <tr 
              key={customer.id}
              className="table-row-animate border-b border-gray-100 hover:bg-gray-50/50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${customer.name}&background=random`}
                    alt={customer.name}
                    className="w-10 h-10 border border-gray-200"
                  />
                  <Link
                    to={`/customers/${customer.id}`}
                    className="font-medium text-[#0066FF] hover:text-blue-700"
                  >
                    {customer.name}
                  </Link>
                </div>
              </td>
              <td className="px-6 py-4 text-gray-500">{customer.email}</td>
              <td className="px-6 py-4 text-gray-500">{customer.phone}</td>
              <td className="px-6 py-4 text-gray-500">{customer.trn}</td>
              <td className="px-6 py-4">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/customers/${customer.id}`, '_blank')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Link to={`/customers/${customer.id}/edit`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <FileEdit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}