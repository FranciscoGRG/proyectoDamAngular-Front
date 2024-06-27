import { Component } from '@angular/core';
import { Injectable } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export default class RegisterComponent {

  constructor(private http: HttpClient) { }

  formData = {
    name: '',
    email: '',
    password: '',
  };


  register() {
    console.log('Form Data:', this.formData);

    // Registro del usuario
    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/register', {
      name: this.formData.name,
      email: this.formData.email,
      password: this.formData.password,
    }).subscribe(
      (registerResponse: any) => {
        console.log('Usuario registrado:', registerResponse);

        // Una vez registrado, intenta iniciar sesión automáticamente
        this.login();
      },
      error => {
        console.error('Error al registrar usuario:', error);
      }
    );
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
      },
      error => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}
