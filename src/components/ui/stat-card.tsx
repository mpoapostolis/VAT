import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  trend?: {
    value: number;
    label: string;
  };
}

export function StatCard({ icon, label, value, trend }: StatCardProps) {
  return (
    <div className="bg-white p-6 border border-gray-200/60 shadow-lg shadow-gray-200/20 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-200 hover-lift animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-[#F4F7FE] border border-gray-100">
            {icon}
          </div>
          <span className="text-sm text-gray-500 font-medium tracking-wide">
            {label}
          </span>
        </div>
        <button className="text-gray-400 hover:text-gray-600 transition-colors button-animate">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <div className={`flex items-center ${trend.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d={trend.value >= 0 
                  ? "M8 7l4-4 4 4m-4-4v18" 
                  : "M8 17l4 4 4-4M12 21V3"} 
                />
              </svg>
              <span className="ml-1 text-sm font-medium">{Math.abs(trend.value)}%</span>
            </div>
            <span className="text-sm text-gray-500">{trend.label}</span>
          </div>
        </div>
      )}
    </div>
  );
}