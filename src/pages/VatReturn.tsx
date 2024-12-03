import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AnimatedPage } from '@/components/AnimatedPage';
import { Button } from '@/components/ui/button';
import { VatReturnList } from '@/components/vat-return/VatReturnList';
import { CreateVatReturn } from '@/components/vat-return/CreateVatReturn';
import { EditVatReturn } from '@/components/vat-return/EditVatReturn';

export function VatReturn() {
  return (
    <Routes>
      <Route
        index
        element={
          <AnimatedPage>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900">VAT Returns</h1>
                  <p className="text-sm text-gray-500 mt-1">Manage and submit your VAT returns</p>
                </div>
                <Link to="new">
                  <Button>Prepare New Return</Button>
                </Link>
              </div>
              <VatReturnList />
            </div>
          </AnimatedPage>
        }
      />
      <Route path="new" element={<CreateVatReturn />} />
      <Route path="/:id/edit" element={<EditVatReturn />} />
    </Routes>
  );
}