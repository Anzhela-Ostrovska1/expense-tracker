import { Component, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TransactionFormComponent } from '../transaction-form/transaction-form';  
import { TransactionListComponent } from '../transaction-list/transaction-list';
import { CategoryProgressComponent } from '../../category-progress/category-progress';
import { Transaction } from '../../models/transaction.model';


@Component({
  selector: 'app-dashboard',
  standalone: true,            
  imports: [TransactionFormComponent, TransactionListComponent, CategoryProgressComponent, FormsModule, ], 
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {

  @Input() selectedMonth!: string;

  transactions: Transaction[] = []; 
  // selectedMonth: string = new Date().toISOString().slice(0, 7); // "YYYY-MM" "2025-10-15T23:45:12.345Z"
  selectedDate: string = new Date().toISOString().slice(0,10);

  monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];



  constructor() {
    const data = localStorage.getItem('transactions');
    if (data) {
      this.transactions = JSON.parse(data);
    }
  }

  ngOnInit() {}

  // Добавление новой транзакции
  addTransaction(transaction: Transaction) {
    const newTransaction: Transaction ={
         ...transaction,
      id: Date.now(),
   
    };
    this.transactions.push(newTransaction);
    this.saveToStorage(this.transactions);
    
  }


saveToStorage(updatedTransactions: Transaction[]) {
  this.transactions = updatedTransactions;
  localStorage.setItem('transactions', JSON.stringify(this.transactions));
} 

  // Возвращает транзакции только за выбранный месяц
  getMonthTransactions(): Transaction[] {
    return this.transactions
      .filter(t => t.date.slice(0, 7) === this.selectedMonth)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // последние сверху
  }


  // Расчёт суммы доходов за месяц
  getTotalIncome(): number {
    return this.getMonthTransactions()
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  }

  // Расчёт суммы расходов за месяц
  getTotalExpense(): number {
    return this.getMonthTransactions()
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);
  }


  getTotalBalance(): number {
    return this.getTotalIncome() - this.getTotalExpense();
  }

  // Название выбранного месяца
  //selectedMonth = "2025-10";разделит её по дефису '-'→ получится массив:["2025", "10"] => .map(Number) 
  // преобразует строки в числа.  [year, month] деструктуризация массива.
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


private getColor(index: number) {
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
  return colors[index % colors.length];
}

get categoriesData() {
  const expenses = this.getExpenses();
  const totals = this.getTotalsByCategory(expenses);
  return this.getSortedCategories(totals);
}

}


