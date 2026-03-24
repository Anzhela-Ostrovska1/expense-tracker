import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  // РЕГИСТРАЦИЯ
  register(email: string, password: string, username: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { email, password, username });
  }

  // ЛОГИН
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // СОХРАНИТЬ ТОКЕН
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // ПОЛУЧИТЬ ТОКЕН
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // ПРОВЕРИТЬ ЗАЛОГИНЕН ЛИ
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // ВЫЙТИ
  logout(): void {
    localStorage.removeItem('token');
  }
}

