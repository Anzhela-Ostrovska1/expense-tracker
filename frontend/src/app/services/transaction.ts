import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth';
import { Transaction } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:5000/api/transactions';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Заголовок с токеном для каждого запроса
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });
  }

  // ПОЛУЧИТЬ ВСЕ ТРАНЗАКЦИИ

  getTransactions(): Observable<Transaction[]> {  // ← вместо any[]
  return this.http.get<Transaction[]>(this.apiUrl, {
    headers: this.getHeaders()
  });
}
  // getTransactions(): Observable<any[]> {
  //   return this.http.get<any[]>(this.apiUrl, {
  //     headers: this.getHeaders()
  //   });
  // }

  // // ДОБАВИТЬ ТРАНЗАКЦИЮ
  addTransaction(transaction: Omit<Transaction, 'id'>): Observable<Transaction> {
  return this.http.post<Transaction>(this.apiUrl, transaction, {
    headers: this.getHeaders()
  });
}
  // addTransaction(transaction: any): Observable<any> {
  //   return this.http.post(this.apiUrl, transaction, {
  //     headers: this.getHeaders()
  //   });
  // }

  // РЕДАКТИРОВАТЬ ТРАНЗАКЦИЮ
  updateTransaction(id: number, transaction: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, transaction, {
      headers: this.getHeaders()
    });
  }

  // УДАЛИТЬ ТРАНЗАКЦИЮ
  deleteTransaction(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders()
    });
  }
}