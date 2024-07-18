import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-show-createdroute',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './show-createdroute.component.html',
  styleUrl: './show-createdroute.component.css'
})
export class ShowCreatedrouteComponent implements OnInit {

  routes: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchRoutes();
  }

  fetchRoutes() {

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    console.log(token);

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get('http://localhost/proyectoDamAngular-BACK/public/api/getCreatedRoutes', {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    })
      .subscribe(
        (data: any) => {
          this.routes = data;
          console.log('Rutas obtenidas:', this.routes);
        },
        error => {
          console.error('Error al obtener las rutas:', error);
        }
      );
  }
}
