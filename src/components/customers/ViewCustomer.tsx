import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useSWR from 'swr';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { formatCurrency } from '@/lib/utils';
import type { Customer, Invoice } from '@/lib/pocketbase';

export function ViewCustomer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: customer } = useSWR<Customer>(`customers/${id}`);
  const { data: invoices } = useSWR<{ items: Invoice[] }>('invoices');

  const customerInvoices = invoices?.items.filter(
    (invoice) => invoice.customerId === id
  );

  const totalBilled = customerInvoices?.reduce(
    (sum, invoice) => sum + invoice.total,
    0
  );

  const totalOutstanding = customerInvoices?.reduce(
    (sum, invoice) =>
      invoice.status !== 'paid' ? sum + invoice.total : sum,
    0
  );

  if (!customer) return null;

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          className="mr-4"
          onClick={() => navigate('/customers')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-semibold text-gray-900">{customer.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Customer Details</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1">{customer.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Phone</dt>
              <dd className="mt-1">{customer.phone}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1">{customer.address}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Tax Registration Number
              </dt>
              <dd className="mt-1">{customer.trn}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Financial Summary</h2>
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Total Billed</dt>
              <dd className="mt-1 text-2xl font-semibold text-gray-900">
                {formatCurrency(totalBilled || 0)}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Outstanding Balance</dt>
              <dd className="mt-1 text-2xl font-semibold text-red-600">
                {formatCurrency(totalOutstanding || 0)}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">Invoices</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice Number</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customerInvoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {invoice.number}
                  </Link>
                </TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'overdue'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoice.total)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}