import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileSpreadsheet } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { formatCurrency } from "@/lib/utils";

const balanceSheetData = {
  assets: {
    current: [
      { name: "Cash and Cash Equivalents", amount: 250000 },
      { name: "Accounts Receivable", amount: 180000 },
      { name: "Inventory", amount: 120000 },
    ],
    nonCurrent: [
      { name: "Property and Equipment", amount: 450000 },
      { name: "Intangible Assets", amount: 75000 },
    ],
  },
  liabilities: {
    current: [
      { name: "Accounts Payable", amount: 95000 },
      { name: "Short-term Loans", amount: 120000 },
    ],
    nonCurrent: [{ name: "Long-term Debt", amount: 280000 }],
  },
  equity: [
    { name: "Share Capital", amount: 500000 },
    { name: "Retained Earnings", amount: 80000 },
  ],
};

export function BalanceSheet() {
  const navigate = useNavigate();

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting balance sheet as ${format}`);
  };

  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/reports")}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Balance Sheet
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                View your financial position
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <DateRangePicker />
            <Button onClick={() => handleExport("pdf")}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" onClick={() => handleExport("excel")}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-xs font-medium mb-4">Assets</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-3">
                    Current Assets
                  </h3>
                  <div className="space-y-2">
                    {balanceSheetData.assets.current.map((item) => (
                      <div key={item.name} className="flex justify-between">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Current Assets</span>
                      <span>
                        {formatCurrency(
                          balanceSheetData.assets.current.reduce(
                            (sum, item) => sum + item.amount,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-3">
                    Non-Current Assets
                  </h3>
                  <div className="space-y-2">
                    {balanceSheetData.assets.nonCurrent.map((item) => (
                      <div key={item.name} className="flex justify-between">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Non-Current Assets</span>
                      <span>
                        {formatCurrency(
                          balanceSheetData.assets.nonCurrent.reduce(
                            (sum, item) => sum + item.amount,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Total Assets</span>
                  <span>
                    {formatCurrency(
                      [
                        ...balanceSheetData.assets.current,
                        ...balanceSheetData.assets.nonCurrent,
                      ].reduce((sum, item) => sum + item.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
              <h2 className="text-xs font-medium mb-4">Liabilities & Equity</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-3">
                    Current Liabilities
                  </h3>
                  <div className="space-y-2">
                    {balanceSheetData.liabilities.current.map((item) => (
                      <div key={item.name} className="flex justify-between">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Current Liabilities</span>
                      <span>
                        {formatCurrency(
                          balanceSheetData.liabilities.current.reduce(
                            (sum, item) => sum + item.amount,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-3">
                    Non-Current Liabilities
                  </h3>
                  <div className="space-y-2">
                    {balanceSheetData.liabilities.nonCurrent.map((item) => (
                      <div key={item.name} className="flex justify-between">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Non-Current Liabilities</span>
                      <span>
                        {formatCurrency(
                          balanceSheetData.liabilities.nonCurrent.reduce(
                            (sum, item) => sum + item.amount,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 mb-3">
                    Equity
                  </h3>
                  <div className="space-y-2">
                    {balanceSheetData.equity.map((item) => (
                      <div key={item.name} className="flex justify-between">
                        <span className="text-gray-600">{item.name}</span>
                        <span className="font-medium">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total Equity</span>
                      <span>
                        {formatCurrency(
                          balanceSheetData.equity.reduce(
                            (sum, item) => sum + item.amount,
                            0
                          )
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 mt-6 pt-4">
                <div className="flex justify-between text-xs font-semibold">
                  <span>Total Liabilities & Equity</span>
                  <span>
                    {formatCurrency(
                      [
                        ...balanceSheetData.liabilities.current,
                        ...balanceSheetData.liabilities.nonCurrent,
                        ...balanceSheetData.equity,
                      ].reduce((sum, item) => sum + item.amount, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
