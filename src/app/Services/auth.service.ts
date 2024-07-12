import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  isLoggedIn(): boolean {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;
    return token != null;
  }

  logIn(token: string): void {
    localStorage.setItem('user', JSON.stringify(token));
    this.loggedIn.next(true);
  }

  logOut(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  getToken(): string {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    return token;
  }
}
