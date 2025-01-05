import React from "react";
import { Link } from "react-router-dom";
import { AnimatedPage } from "@/components/AnimatedPage";
import { FileText, TrendingUp, Wallet, FileSpreadsheet } from "lucide-react";

const reports = [
  {
    id: "balance-sheet",
    name: "Balance Sheet",
    description: "View your assets, liabilities, and equity",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "profit-loss",
    name: "Profit & Loss",
    description: "Track your income and expenses",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    id: "cash-flow",
    name: "Cash Flow",
    description: "Monitor your cash movements",
    icon: Wallet,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: "audit-file",
    name: "Audit File",
    description: "Generate audit reports and files",
    icon: FileSpreadsheet,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
];

export function ReportsList() {
  return (
    <AnimatedPage>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
          <p className="text-xs text-gray-500 mt-1">
            Generate and view financial reports
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={report.id}
              className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-200 animate-fade-in"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-3 ${report.bgColor}`}>
                  <report.icon className={`h-6 w-6 ${report.color}`} />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{report.name}</h3>
                  <p className="text-xs text-gray-500">{report.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedPage>
  );
}
