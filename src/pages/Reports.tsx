import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { BalanceSheet } from '@/components/reports/BalanceSheet';
import { ProfitLoss } from '@/components/reports/ProfitLoss';
import { CashFlow } from '@/components/reports/CashFlow';
import { AuditFile } from '@/components/reports/AuditFile';
import { ReportsList } from '@/components/reports/ReportsList';

export function Reports() {
  return (
    <Routes>
      <Route index element={<ReportsList />} />
      <Route path="balance-sheet" element={<BalanceSheet />} />
      <Route path="profit-loss" element={<ProfitLoss />} />
      <Route path="cash-flow" element={<CashFlow />} />
      <Route path="audit-file" element={<AuditFile />} />
    </Routes>
  );
}