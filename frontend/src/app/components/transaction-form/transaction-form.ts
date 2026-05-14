import { Component, OnInit, OnDestroy, Output,Input,EventEmitter, inject } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CategoryService } from '../../services/category-service';
import { MonthService } from '../../services/month';

@Component({
  selector: 'app-transaction-form',
  standalone: true,  
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss']
})
export class TransactionFormComponent implements OnInit, OnDestroy {
  @Output() newTransaction = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  categoryService = inject(CategoryService)
  constructor(private monthService: MonthService) {}
  
private getTodayDate(): string {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
  

  transactionForm = new FormGroup({
  amount: new FormControl('', [
  Validators.required,
  Validators.min(0.01),
  Validators.max(99999999.99),
  Validators.pattern(/^(0\.\d{1,2}|[1-9]\d*(\.\d{1,2})?)$/)
]),
    date: new FormControl(this.getTodayDate(), Validators.required),
    category: new FormControl('', Validators.required),
    type: new FormControl('expense'),
    description: new FormControl('', Validators.maxLength(200))
  });


onAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  value = value.replace(',', '.');

  value = value.replace(/[^0-9.]/g, '');

  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts[1];
  }

  if (parts[1]?.length > 2) {
    value = parts[0] + '.' + parts[1].slice(0, 2);
  }

  if (/^0\d+/.test(value)) {
    value = value.replace(/^0+/, '');
  }

  input.value = value;
  this.transactionForm.get('amount')?.setValue(value, { emitEvent: false });

}


ngOnInit(): void {
  this.monthService.selectedMonth$.pipe(
    takeUntil(this.destroy$)
  ).subscribe(month => {
    console.log('form month changed:', month);
    const firstDayOfMonth = `${month}-01`;
    this.transactionForm.get('date')?.setValue(firstDayOfMonth);
  });

  this.transactionForm.get('type')?.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      this.transactionForm.get('category')?.setValue('');
    });
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  clearAmount() {
  const amountControl = this.transactionForm.get('amount');
  if (!amountControl) return;

  const value = amountControl.value;
  if (value === '' || value === null || value === undefined) {
    amountControl.setValue('');
  }
}

getCurrentCategories() {
  const type = (this.transactionForm.get('type')?.value || 'expense') as 'expense' | 'income';
  return this.categoryService.getCategoriesForType(type);
}
 transactions: any[] = []

 onFormSubmit() {
  if (this.transactionForm.valid) {
    this.newTransaction.emit(this.transactionForm.value);
    const currentMonth = this.monthService.getMonth();
    this.transactionForm.reset({
      type: 'expense',
      date: `${currentMonth}-01` 
    });
  } else {
    this.transactionForm.markAllAsTouched();
  }
}


  get date() { return this.transactionForm.get('date'); }
  get amount() { return this.transactionForm.get('amount'); }
  get category() { return this.transactionForm.get('category'); }

}
