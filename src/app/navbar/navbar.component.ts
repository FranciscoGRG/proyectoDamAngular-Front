import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { AuthService } from '../Services/auth.service';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) { }

  menuVisible = false;
  isLoggedIn = false;
  user: any = [];
  private authSubscription: Subscription | null = null;

  ngOnInit(): void {
    this.authSubscription = this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      if (this.isLoggedIn) {
        this.fetchUser();
      } else {
        this.user = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  logOut() {
    this.authService.logOut(); // Cierra la sesión
    this.router.navigate(['/']); // Redirige a la página de inicio
  }

  mostrarMenu() {
    this.menuVisible = !this.menuVisible;
    console.log(this.menuVisible);
  }

  navigateToCreateRoute() {
    this.router.navigate(['/createRoute']);
  }

  navigateToGetRoute() {
    this.router.navigate(['/getRoutes']);
  }

  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }

  navigateToGetCreatedRoutes() {
    this.router.navigate(['/getCreatedRoutes']);
  }

  navigateToJoinedRoutes() {
    this.router.navigate(['/joinedRoutes'])
  }

  navigateToUpdateImage() {
    this.router.navigate(['/updateProfileImage'])
  }

  fetchUser() {

    const token = this.authService.getToken();

    console.log(token);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get('http://localhost/proyectoDamAngular-BACK/public/api/getUser', {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    })
      .subscribe(
        (data: any) => {
          this.user = data;
          // console.log('User obtenido', this.user);
        },
        error => {
          console.error('Error al obtener el user:', error);
        }
      );
  }

}
