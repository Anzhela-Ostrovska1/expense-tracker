import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class MonthService {
  private month = new BehaviorSubject<string>(
    localStorage.getItem('selectedMonth') || 
    new Date().toISOString().slice(0, 7)
  );

  selectedMonth$ = this.month.asObservable();

  setMonth(month: string) {
    localStorage.setItem('selectedMonth', month); 
    this.month.next(month);
  }

  getMonth(): string {
    return this.month.getValue();
  }
}