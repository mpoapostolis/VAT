export interface Category {
  id: string;
  name: string;
  description?: string;
  vatRate: number;
  isActive: boolean;
  created: string;
  updated: string;
  userId?: string;
  type: "income" | "expense";
}
