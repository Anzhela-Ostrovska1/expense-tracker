import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { CategoryService } from '../../services/category-service';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionListComponent {

  constructor(private categoryService: CategoryService) {}
  
  @Input()selectedMonth!: string; //взяли от дашборд чтобы использовать здесь в компоненте
  @Input() transactions!: Transaction[];   //взяли от дашборд чтобы использовать здесь в компоненте
  @Output() save = new EventEmitter<Transaction[]>();

  editingId: number | null = null;
  editingTransaction: Transaction | null = null;
  backupTransaction: Transaction | null = null;

  get filteredTransactions(): Transaction[] {
    return this.transactions
      .filter(t => t.date.slice(0, 7) === this.selectedMonth)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  onEditTransaction(t: Transaction) {
    this.editingId = t.id;
    this.backupTransaction = { ...t };      
    this.editingTransaction = { ...t };     
  }

  getCategoriesFor(type: 'income' | 'expense') {
    return this.categoryService.getCategoriesForType(type);
  }
  
 onSaveTransaction() {
  if (this.editingId !== null && this.editingTransaction) {
    const index = this.transactions.findIndex(t => t.id === this.editingId);
    if (index !== -1) {
      this.transactions[index] = { ...this.editingTransaction };

      this.save.emit(this.transactions); 
    }
    this.stopEditing();
  }
}

  cancelEdit() {
    if (this.backupTransaction && this.editingId !== null) {
      const index = this.transactions.findIndex(t => t.id === this.editingId);
      if (index !== -1) {
        this.transactions[index] = { ...this.backupTransaction };
      }
    }
    this.stopEditing();
  }

  stopEditing() {
    this.editingId = null;
    this.editingTransaction = null;
    this.backupTransaction = null;
  }

  onDeleteTransaction(t: Transaction) {
    const index = this.transactions.indexOf(t);
    if (index > -1) {
      this.transactions.splice(index, 1);
      this.save.emit(this.transactions);
    }
  }
}
