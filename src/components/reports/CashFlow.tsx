import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileSpreadsheet } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { formatCurrency } from '@/lib/utils';

const cashFlowData = {
  operating: [
    { name: 'Net Income', amount: 350000 },
    { name: 'Depreciation', amount: 75000 },
    { name: 'Changes in Accounts Receivable', amount: -45000 },
    { name: 'Changes in Inventory', amount: -30000 },
    { name: 'Changes in Accounts Payable', amount: 25000 },
  ],
  investing: [
    { name: 'Purchase of Equipment', amount: -120000 },
    { name: 'Sale of Investments', amount: 80000 },
  ],
  financing: [
    { name: 'Proceeds from Long-term Debt', amount: 200000 },
    { name: 'Dividend Payments', amount: -50000 },
  ],
};

export function CashFlow() {
  const navigate = useNavigate();

  const totalOperating = cashFlowData.operating.reduce((sum, item) => sum + item.amount, 0);
  const totalInvesting = cashFlowData.investing.reduce((sum, item) => sum + item.amount, 0);
  const totalFinancing = cashFlowData.financing.reduce((sum, item) => sum + item.amount, 0);
  const netCashFlow = totalOperating + totalInvesting + totalFinancing;

  const handleExport = (format: 'pdf' | 'excel') => {
    console.log(`Exporting cash flow statement as ${format}`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/reports')}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Cash Flow</h1>
              <p className="text-sm text-gray-500 mt-1">View your cash flow statement</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DateRangePicker />
            <Button onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport('excel')}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium mb-4">Operating Activities</h2>
              <div className="space-y-2">
                {cashFlowData.operating.map((item) => (
                  <div key={item.name} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className={`font-medium ${
                      item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-4 pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Net Cash from Operating Activities</span>
                    <span className={totalOperating >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(totalOperating)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Investing Activities</h2>
              <div className="space-y-2">
                {cashFlowData.investing.map((item) => (
                  <div key={item.name} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className={`font-medium ${
                      item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-4 pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Net Cash from Investing Activities</span>
                    <span className={totalInvesting >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(totalInvesting)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium mb-4">Financing Activities</h2>
              <div className="space-y-2">
                {cashFlowData.financing.map((item) => (
                  <div key={item.name} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className={`font-medium ${
                      item.amount >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-4 pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Net Cash from Financing Activities</span>
                    <span className={totalFinancing >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(totalFinancing)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Net Change in Cash</span>
                <span className={netCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(netCashFlow)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}