import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
   expenseCategories = [
    'Groceries', 'Shopping', 'Food & Dining', 'Transportation',
    'Bills & Utilities', 'Entertainment', 'Health',
    'Personal', 'Travel', 'Other'
  ];

  incomeCategories = [
    'Salary', 'Bonus', 'Gift', 'Interest',
    'Investment', 'Other'
  ];

 getCategoriesForType(type: 'expense' | 'income') {
    return type === 'expense' ? this.expenseCategories : this.incomeCategories;
  }

}

