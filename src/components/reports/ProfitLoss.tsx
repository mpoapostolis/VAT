import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Download, FileSpreadsheet } from "lucide-react";
import { AnimatedPage } from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { formatCurrency } from "@/lib/utils";

const profitLossData = {
  revenue: [
    { name: "Sales Revenue", amount: 850000 },
    { name: "Service Revenue", amount: 250000 },
    { name: "Other Revenue", amount: 50000 },
  ],
  expenses: [
    { name: "Cost of Goods Sold", amount: 425000 },
    { name: "Salaries and Wages", amount: 280000 },
    { name: "Rent and Utilities", amount: 75000 },
    { name: "Marketing and Advertising", amount: 45000 },
    { name: "Office Supplies", amount: 15000 },
    { name: "Insurance", amount: 25000 },
    { name: "Other Expenses", amount: 35000 },
  ],
};

export function ProfitLoss() {
  const navigate = useNavigate();

  const totalRevenue = profitLossData.revenue.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const totalExpenses = profitLossData.expenses.reduce(
    (sum, item) => sum + item.amount,
    0
  );
  const netIncome = totalRevenue - totalExpenses;

  const handleExport = (format: "pdf" | "excel") => {
    console.log(`Exporting profit & loss statement as ${format}`);
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
                Profit & Loss
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                View your income statement
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

        <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6">
          <div className="space-y-8">
            <div>
              <h2 className="text-xs font-medium mb-4">Revenue</h2>
              <div className="space-y-2">
                {profitLossData.revenue.map((item) => (
                  <div key={item.name} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-4 pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Revenue</span>
                    <span>{formatCurrency(totalRevenue)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xs font-medium mb-4">Expenses</h2>
              <div className="space-y-2">
                {profitLossData.expenses.map((item) => (
                  <div key={item.name} className="flex justify-between">
                    <span className="text-gray-600">{item.name}</span>
                    <span className="font-medium text-red-600">
                      ({formatCurrency(item.amount)})
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 mt-4 pt-2">
                  <div className="flex justify-between font-medium">
                    <span>Total Expenses</span>
                    <span className="text-red-600">
                      ({formatCurrency(totalExpenses)})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t-2 border-gray-200 pt-4">
              <div className="flex justify-between text-xs font-semibold">
                <span>Net Income</span>
                <span
                  className={netIncome >= 0 ? "text-green-600" : "text-red-600"}
                >
                  {formatCurrency(netIncome)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
}
