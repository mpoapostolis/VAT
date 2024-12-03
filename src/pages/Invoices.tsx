import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { InvoicesList } from '@/components/invoices/InvoicesList';
import { CreateInvoice } from '@/components/invoices/CreateInvoice';
import { ViewInvoice } from '@/components/invoices/ViewInvoice';

export function Invoices() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AnimatedPage>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage your invoices and payments</p>
                </div>
                <Link to="/invoices/new">
                  <Button className="bg-[#0066FF] hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Invoice
                  </Button>
                </Link>
              </div>
              <div className="bg-white border border-gray-200/60 shadow-lg shadow-gray-200/20">
                <InvoicesList />
              </div>
            </div>
          </AnimatedPage>
        }
      />
      <Route path="/new" element={<CreateInvoice />} />
      <Route path="/:id" element={<ViewInvoice />} />
    </Routes>
  );
}