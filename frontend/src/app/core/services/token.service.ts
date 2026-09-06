import { Injectable } from '@angular/core';

const TOKEN_KEY = 'grievance_token';
const USER_KEY  = 'grievance_user';

@Injectable({ providedIn: 'root' })
export class TokenService {

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  removeToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }

  getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  removeUser(): void {
    localStorage.removeItem(USER_KEY);
  }

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
}
