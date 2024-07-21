import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  // constructor(private http: HttpClient) { }

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  likeUpdate = new Subject<any>();

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

  updateLikes(routeId: number, http: HttpClient): void {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    http.post('http://localhost/proyectoDamAngular-BACK/public/api/darLike', {
      ruta_id: routeId
    }, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (registerResponse: any) => {
        alert('Le has dado like');
      },
      error => {
        console.error('Error al dar like:', error);
        alert('Error al dar like');
      }
    );

  }
}
