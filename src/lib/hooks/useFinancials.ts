import { useQuery } from '@tanstack/react-query';

interface FinancialItem {
  id: string;
  date: string;
  dueDate: string;
  customerName: string;
  amount: number;
  vatAmount: number;
  status: 'pending' | 'overdue' | 'paid';
}

interface FinancialSummary {
  totalReceivables: number;
  totalPayables: number;
  monthlyReceivables: { month: string; amount: number }[];
  monthlyPayables: { month: string; amount: number }[];
  recentReceivables: FinancialItem[];
  recentPayables: FinancialItem[];
}

export function useFinancials() {
  const { data } = useQuery<FinancialSummary>({
    queryKey: ['financials'],
    queryFn: async () => {
      const response = await fetch('/api/financials/summary');
      if (!response.ok) throw new Error('Failed to fetch financials');
      return response.json();
    },
  });

  return data || {
    totalReceivables: 0,
    totalPayables: 0,
    monthlyReceivables: [],
    monthlyPayables: [],
    recentReceivables: [],
    recentPayables: [],
  };
}
