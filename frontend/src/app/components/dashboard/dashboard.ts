import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TransactionFormComponent } from '../transaction-form/transaction-form';
import { TransactionListComponent } from '../transaction-list/transaction-list';
import { CategoryProgressComponent } from '../../category-progress/category-progress';
import { Transaction } from '../../models/transaction.model';
import { TransactionService } from '../../services/transaction';
import { MonthService } from '../../services/month';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [TransactionFormComponent, TransactionListComponent, CategoryProgressComponent, FormsModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
isLoading = false;
  transactions: Transaction[] = [];
  selectedMonth: string = new Date().toISOString().slice(0, 7);
    private monthSub!: Subscription;

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];


   constructor(
    private transactionService: TransactionService,
    private monthService: MonthService,
     private toast: ToastService
  ) {}


ngOnInit() {
  localStorage.removeItem('transactions'); 
  this.selectedMonth = this.monthService.getMonth();
  
  this.monthSub = this.monthService.selectedMonth$.subscribe(month => {
    this.selectedMonth = month;
  });

  this.loadTransactions();
}
  ngOnDestroy() {
    this.monthSub.unsubscribe();
  }
addTransaction(transaction: Transaction) {
  this.transactionService.addTransaction(transaction).subscribe({
    next: () => {
      this.loadTransactions(true);
    },
    error: () => this.toast.error('Failed to add transaction')
  });
}

loadTransactions(showSuccess = false) {  
  this.isLoading = true;
  this.transactionService.getTransactions().subscribe({
    next: (data) => {
      this.transactions = data;
      this.isLoading = false;
      if (showSuccess) {
        this.toast.success('Transaction added!'); 
      }
    },
    error: () => {
      this.isLoading = false;
      this.toast.error('Failed to load transactions');
    }
  });
}

saveToStorage(updatedTransactions: Transaction[]) {
  this.loadTransactions(); 
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
    totals[t.category] += parseFloat(t.amount.toString()); 
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
