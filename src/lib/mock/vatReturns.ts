import { VatReturn, VatReturnStatus } from '@/types';
import { subMonths } from 'date-fns';

export const mockVatReturns: VatReturn[] = [
  {
    id: '1',
    startDate: subMonths(new Date(), 3),
    endDate: subMonths(new Date(), 1),
    salesVat: 15000,
    purchasesVat: 8500,
    adjustments: -500,
    netVatDue: 6000,
    status: VatReturnStatus.SUBMITTED
  },
  {
    id: '2',
    startDate: subMonths(new Date(), 6),
    endDate: subMonths(new Date(), 4),
    salesVat: 12500,
    purchasesVat: 7200,
    adjustments: 0,
    netVatDue: 5300,
    status: VatReturnStatus.ACCEPTED
  },
  {
    id: '3',
    startDate: subMonths(new Date(), 9),
    endDate: subMonths(new Date(), 7),
    salesVat: 18200,
    purchasesVat: 9800,
    adjustments: 300,
    netVatDue: 8700,
    status: VatReturnStatus.ACCEPTED
  }
];