import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Transaction } from '../../models/transaction.model';
import { CategoryService } from '../../services/category-service';
import { TransactionService } from '../../services/transaction';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './transaction-list.html',
  styleUrls: ['./transaction-list.scss']
})
export class TransactionListComponent {

  constructor(private categoryService: CategoryService,
    private transactionService: TransactionService,
    private toast: ToastService 
  ) {}
  
  @Input()selectedMonth!: string;
  @Input() transactions!: Transaction[];  
  @Output() save = new EventEmitter<Transaction[]>();

  editingId: number | null = null;
  editingTransaction: Transaction | null = null;
  backupTransaction: Transaction | null = null;
  selectedType = '';
  selectedCategory = '';
  searchQuery = '';

  get filteredTransactions(): Transaction[] {
    return this.transactions
      .filter(t => t.date.slice(0, 7) === this.selectedMonth)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(t=>!this.selectedType || t.type === this.selectedType)
      .filter(t=>!this.selectedCategory || t.category===this.selectedCategory)
    .filter(t=>(t.description ?? '').toLowerCase().includes(this.searchQuery.toLowerCase()))
  }

  getAllCategories() {
  const all = [
    ...this.categoryService.getCategoriesForType('income'),
    ...this.categoryService.getCategoriesForType('expense')
  ];
  return [...new Set(all)]; 
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
    this.transactionService.updateTransaction(this.editingId, this.editingTransaction).subscribe({
      next: (updatedTransaction) => {
        const index = this.transactions.findIndex(t => t.id === this.editingId);
        if (index !== -1) {
          this.transactions[index] = { ...this.editingTransaction! };
          this.save.emit(this.transactions);
        }
        this.toast.success('Transaction updated!');
        this.stopEditing(); 
      },
      error: () => {
        this.toast.error('Failed to update transaction');
        this.stopEditing(); 
      }
    });
  }
}

onDeleteTransaction(t: Transaction) {
  if (!confirm('Are you sure you want to delete this transaction?')) return;
  
  this.transactionService.deleteTransaction(t.id).subscribe({
    next: () => {
      this.save.emit(this.transactions); 
      this.toast.success('Transaction deleted!');
    },
    error: () => this.toast.error('Failed to delete transaction')
  });
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
}
