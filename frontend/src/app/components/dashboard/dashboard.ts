import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionFormComponent } from '../transaction-form/transaction-form';
import { TransactionListComponent } from '../transaction-list/transaction-list';
import { CategoryProgressComponent } from '../../category-progress/category-progress';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TransactionFormComponent, TransactionListComponent, CategoryProgressComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  transactions: Transaction[] = [];
  selectedMonth: string = new Date().toISOString().slice(0, 7);

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  constructor(private transactionService: TransactionService) {}

  ngOnInit() {
    this.loadTransactions(); // ← загружаем с бекенда при старте
  }

  loadTransactions() {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
      }
    });
  }

  addTransaction(transaction: Transaction) {
    this.transactionService.addTransaction(transaction).subscribe({
      next: (newTransaction) => {
        this.transactions.push(newTransaction);
      },
      error: (err) => {
        console.error('Error adding transaction:', err);
      }
    });
  }

  saveToStorage(updatedTransactions: Transaction[]) {
    updatedTransactions.forEach(t => {
      this.transactionService.updateTransaction(t.id, t).subscribe({
        error: (err) => console.error('Error updating:', err)
      });
    });
    this.transactions = updatedTransactions;
  }

  getMonthTransactions(): Transaction[] {
    return this.transactions
      .filter(t => t.date.slice(0, 7) === this.selectedMonth)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getTotalIncome(): number {
    return this.getMonthTransactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  }

  getTotalExpense(): number {
    return this.getMonthTransactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  }

  getTotalBalance(): number {
    return this.getTotalIncome() - this.getTotalExpense();
  }

  getMonthName(): string {
    const [year, month] = this.selectedMonth.split('-').map(Number);
    return `${this.monthNames[month - 1]} ${year}`;
  }

  private getExpenses() {
    return this.getMonthTransactions().filter(t => t.type === 'expense');
  }

  private getTotalsByCategory(expenses: Transaction[]) {
    const totals: Record<string, number> = {};
    for (const t of expenses) {
      totals[t.category] ??= 0;
      totals[t.category] += t.amount;
    }
    return totals;
  }

  private getSortedCategories(totals: Record<string, number>) {
    const totalExpense = this.getTotalExpense();
    return Object.entries(totals)
      .map(([category, total]) => ({
        category,
        total,
        percent: totalExpense ? parseFloat(((total / totalExpense) * 100).toFixed(2)) : 0
      }))
      .sort((a, b) => b.total - a.total);
  }

  get categoriesData() {
    const expenses = this.getExpenses();
    const totals = this.getTotalsByCategory(expenses);
    return this.getSortedCategories(totals);
  }
}
