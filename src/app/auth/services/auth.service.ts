import { CookieService } from 'ngx-cookie-service';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthSignal = signal<boolean>(false);

  constructor(readonly cookieService: CookieService) {}

  getToken(): string {
    return this.cookieService.get('test');
  }

  getUserRole(): string {
    return this.cookieService.get('userRole');
  }

  setToken(token: string) {
    this.cookieService.set('test', token, 2700);
  }

  setUserRole(role: string) {
    this.cookieService.set('userRole', role);
  }

  isAuthenticated() {
    const token = this.getToken();
    return token != undefined;
  }

  isAdmin() {
    const role = this.getUserRole();
    return role === 'admin';
  }

  logout() {
    this.isAuthSignal.set(false);
    this.cookieService.delete('userRole');
    this.cookieService.delete('test');
  }
}
