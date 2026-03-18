export interface Transaction {
  id: number;
  type: 'income' | 'expense';
  amount: number;
  date: string; // формат "YYYY-MM-DD"
  category: string;
  description?: string;
}