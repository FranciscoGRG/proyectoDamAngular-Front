import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }
  formData = {
    email: '',
    password: '',
  };

  navigateToCreateRoute() {
    this.router.navigate(['/createRoute']);
  }

  login() {
    // Intento de login con las credenciales del formulario
    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/login', {
      email: this.formData.email,
      password: this.formData.password,
    }).subscribe(
      (loginResponse: any) => {
        console.log('Usuario logueado:', loginResponse);

        // Guarda el token en localStorage
        // localStorage.setItem('user', JSON.stringify(loginResponse.token));
        this.authService.logIn(loginResponse.token); // Envia el token al authService para guardarlo en el local storage y manejarlo durante la sesión activa.

        // Redirecciona al formulario de creación de rutas
        this.router.navigate(['/createRoute']);

        this.navigateToCreateRoute()
      },
      error => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
