import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { CategoryList } from '@/components/categories/CategoryList';
import { CreateCategory } from '@/components/categories/CreateCategory';

export function Categories() {
  return (
    <Routes>
      <Route
        index
        element={
          <AnimatedPage>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage transaction categories</p>
                </div>
                <Link to="new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    New Category
                  </Button>
                </Link>
              </div>
              <CategoryList />
            </div>
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CreateCategory />} />
    </Routes>
  );
}