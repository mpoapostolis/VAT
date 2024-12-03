import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, FileEdit, Trash2, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  {
    id: 1,
    name: 'Office Supplies',
    description: 'General office supplies and stationery',
    transactions: 145,
    amount: '$12,450.00',
    type: 'expense',
  },
  {
    id: 2,
    name: 'Software Subscriptions',
    description: 'Monthly and annual software licenses',
    transactions: 89,
    amount: '$8,920.00',
    type: 'expense',
  },
  {
    id: 3,
    name: 'Consulting Services',
    description: 'Professional consulting and advisory',
    transactions: 234,
    amount: '$45,670.00',
    type: 'income',
  },
  {
    id: 4,
    name: 'Marketing',
    description: 'Marketing and advertising expenses',
    transactions: 167,
    amount: '$23,450.00',
    type: 'expense',
  },
];

export function CategoryList() {
  const handleDeleteCategory = (categoryId: number) => {
    // Handle category deletion
    console.log('Deleting category:', categoryId);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20 p-6 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-200 animate-fade-in"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 ${
                category.type === 'income' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <FolderOpen className={`h-5 w-5 ${
                  category.type === 'income' ? 'text-green-500' : 'text-blue-500'
                }`} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.description}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`/categories/${category.id}`, '_blank')}
                className="text-gray-500 hover:text-gray-700"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Link to={`/categories/${category.id}/edit`}>
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
                onClick={() => handleDeleteCategory(category.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500">
              {category.transactions} transactions
            </div>
            <div className="font-medium text-gray-900">{category.amount}</div>
          </div>
        </div>
      ))}
    </div>
  );
}