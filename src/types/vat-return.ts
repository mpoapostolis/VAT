export interface VATReturn {
  salesVat: number;
  purchasesVat: number;
  netVAT: number;
  submittedAt: string;
  status: "draft" | "submitted" | "overdue";
  startDate: string;
  endDate: string;
  period: string;
}
