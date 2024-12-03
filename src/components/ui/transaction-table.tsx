import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface Transaction {
  id: number;
  name: string;
  role: string;
  type: string;
  number: string;
  date: string;
  amount: string;
  status: 'PENDING' | 'PAID';
}

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  return (
    <div className="overflow-x-auto animate-fade-in">
      <table className="w-full">
        <thead>
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Company Name
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Type
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Date
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 border-b border-gray-200">
              Employee Status
            </th>
            <th className="px-6 py-4 border-b border-gray-200"></th>
          </tr>
        </thead>
        <tbody className="stagger-animate">
          {transactions.map((transaction) => (
            <tr 
              key={transaction.id} 
              className="table-row-animate border-b border-gray-100 hover:bg-gray-50/50"
            >
              <td className="px-6 py-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://ui-avatars.com/api/?name=${transaction.name}&background=random`}
                    alt={transaction.name}
                    className="w-10 h-10 border border-gray-200"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{transaction.name}</div>
                    <div className="text-sm text-gray-500">{transaction.role}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="font-medium text-[#0066FF]">{transaction.type}</div>
                <div className="text-sm text-gray-500">{transaction.number}</div>
              </td>
              <td className="px-6 py-4 text-gray-500">{transaction.date}</td>
              <td className="px-6 py-4 font-medium text-gray-900">{transaction.amount}</td>
              <td className="px-6 py-4">
                <span className={`status-badge inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${
                  transaction.status === 'PAID'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                }`}>
                  {transaction.status}
                </span>
              </td>
              <td className="px-6 py-4">
                <button className="text-gray-400 hover:text-gray-600 transition-colors button-animate">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}