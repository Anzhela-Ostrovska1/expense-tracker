export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  date: string; //  "YYYY-MM-DD"
  category: string;
  description?: string;
}