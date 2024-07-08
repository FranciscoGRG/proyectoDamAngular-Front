import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export default class LoginComponent {

  constructor(private http: HttpClient, private router: Router) { }
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
        localStorage.setItem('user', JSON.stringify(loginResponse.token));

        this.navigateToCreateRoute()
      },
      error => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
