import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { ToastService, AngularToastifyModule } from 'angular-toastify';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, AngularToastifyModule],
  providers: [ToastService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private _toastService: ToastService) { }
  formData = {
    email: '',
    password: '',
  };

  navigateToCreateRoute() {
    this.router.navigate(['/createRoute']);
  }

  login() {
    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/login', {
      email: this.formData.email,
      password: this.formData.password,
    }).subscribe(
      (loginResponse: any) => {
        console.log('Login response:', loginResponse);
        this.authService.logIn(loginResponse.token);
        this.addSuccessToast();
        this.router.navigate(['/createRoute']);
      },
      error => {
        console.error('Error al iniciar sesión:', error);
        this.addErrorToast();
      }
    );
  }

  addSuccessToast() {
    console.log('Success toast');
    this._toastService.success('Has iniciado sesión correctamente');
  }

  addErrorToast() {
    console.log('Error toast');
    this._toastService.error('Error al iniciar sesión');
  }
}
