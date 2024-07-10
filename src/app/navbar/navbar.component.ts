import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  constructor(private router: Router) { }

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

}
