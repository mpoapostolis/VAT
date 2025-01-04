export interface Category {
  id: string;
  name: string;
  description?: string;
  vatRate: number;
  isActive: boolean;
  created: string;
  updated: string;
  type: "income" | "expense";
}
