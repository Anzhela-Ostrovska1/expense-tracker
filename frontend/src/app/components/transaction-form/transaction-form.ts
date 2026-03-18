import { Component, OnInit, OnDestroy, Output,Input,EventEmitter, inject } from '@angular/core';
// import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
 import { CategoryService } from '../../services/category-service';
//  import { Transaction } from '../../models/transaction.model';


@Component({
  selector: 'app-transaction-form',
  standalone: true,  
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.html',
  styleUrls: ['./transaction-form.scss']
})
export class TransactionFormComponent implements OnInit, OnDestroy {
  // @Input() tr!: Transaction[];
  @Output() newTransaction = new EventEmitter<any>();

  private destroy$ = new Subject<void>();

  categoryService = inject(CategoryService)
  
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
  Validators.pattern(/^(0\.\d{1,2}|[1-9]\d*(\.\d{1,2})?)$/)
]),
// amount: new FormControl('', [
//   Validators.required,
//   Validators.pattern(/^(0|[1-9]\d*)(\.\d{1,2})?$/) // только положительные числа, максимум 2 знака после запятой
// ]),
    // amount: new FormControl(null, [Validators.required, Validators.min(0.01), Validators.max(10000000)]),
    date: new FormControl(this.getTodayDate(), Validators.required),
    category: new FormControl('', Validators.required),
    type: new FormControl('expense'),
    description: new FormControl('', Validators.maxLength(200))
  });


onAmountInput(event: Event) {
  const input = event.target as HTMLInputElement;
  let value = input.value;

  // Заменяем запятую на точку
  value = value.replace(',', '.');

  // Убираем все символы кроме цифр и точки
  value = value.replace(/[^0-9.]/g, '');

  // Разрешаем только одну точку
  const parts = value.split('.');
  if (parts.length > 2) {
    value = parts[0] + '.' + parts[1];
  }

  // Ограничиваем 2 знака после точки
  if (parts[1]?.length > 2) {
    value = parts[0] + '.' + parts[1].slice(0, 2);
  }

  // Убираем лишние ведущие нули (кроме 0.xx)
  if (/^0\d+/.test(value)) {
    value = value.replace(/^0+/, '');
  }

  input.value = value;
  // Обновляем FormControl без вызова событий valueChanges
  this.transactionForm.get('amount')?.setValue(value, { emitEvent: false });
}

  ngOnInit(): void {
    // Подписка на изменения поля type с безопасной отпиской
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
    this.transactionForm.reset({
      type: 'expense', 
      date: this.getTodayDate()
    });
  } else {
    this.transactionForm.markAllAsTouched();
  }
}

  get date() { return this.transactionForm.get('date'); }
  get amount() { return this.transactionForm.get('amount'); }
  get category() { return this.transactionForm.get('category'); }

}
