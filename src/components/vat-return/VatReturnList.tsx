import React from 'react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Download, FileEdit, Trash2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

const vatPeriods = [
  {
    id: 1,
    period: 'Q1 2024',
    startDate: '2024-01-01',
    endDate: '2024-03-31',
    salesVat: 45000,
    purchasesVat: 32000,
    netVat: 13000,
    status: 'Due',
    dueDate: '2024-04-30',
  },
  {
    id: 2,
    period: 'Q4 2023',
    startDate: '2023-10-01',
    endDate: '2023-12-31',
    salesVat: 52000,
    purchasesVat: 38000,
    netVat: 14000,
    status: 'Submitted',
    dueDate: '2024-01-31',
  },
  {
    id: 3,
    period: 'Q3 2023',
    startDate: '2023-07-01',
    endDate: '2023-09-30',
    salesVat: 48000,
    purchasesVat: 35000,
    netVat: 13000,
    status: 'Submitted',
    dueDate: '2023-10-31',
  },
];

export function VatReturnList() {
  const handleDownloadPdf = (vatReturnId: number) => {
    // Handle PDF download
    console.log('Downloading PDF for VAT return:', vatReturnId);
  };

  const handleDeleteVatReturn = (vatReturnId: number) => {
    // Handle VAT return deletion
    console.log('Deleting VAT return:', vatReturnId);
  };

  return (
    <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium">VAT Return Periods</h2>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Date Range</TableHead>
            <TableHead>Sales VAT</TableHead>
            <TableHead>Purchases VAT</TableHead>
            <TableHead>Net VAT</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vatPeriods.map((period) => (
            <TableRow key={period.id} className="animate-fade-in">
              <TableCell className="font-medium">{period.period}</TableCell>
              <TableCell>
                {new Date(period.startDate).toLocaleDateString()} -{' '}
                {new Date(period.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{formatCurrency(period.salesVat)}</TableCell>
              <TableCell>{formatCurrency(period.purchasesVat)}</TableCell>
              <TableCell className="font-medium">{formatCurrency(period.netVat)}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                    period.status === 'Due'
                      ? 'bg-yellow-50 text-yellow-800 border border-yellow-200'
                      : 'bg-green-50 text-green-800 border border-green-200'
                  }`}
                >
                  {period.status}
                </span>
              </TableCell>
              <TableCell>{new Date(period.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/vat-return/${period.id}`, '_blank')}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadPdf(period.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FileEdit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteVatReturn(period.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}