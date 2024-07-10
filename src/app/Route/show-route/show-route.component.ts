import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule


@Component({
  selector: 'app-show-route',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './show-route.component.html',
  styleUrl: './show-route.component.css'
})
export default class ShowRouteComponent implements OnInit {

  routes: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.fetchRoutes();
  }

  fetchRoutes() {
    this.http.get('http://localhost/proyectoDamAngular-BACK/public/api/getRoutes')
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

  participar(ruta_id: number) {
    console.log(ruta_id)

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Registro del usuario
    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/inscribirseRoute', {
      ruta_id: ruta_id
    }, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (registerResponse: any) => {
        console.log('Te has inscrito a la ruta correctamente:', registerResponse);
        alert('Te has inscrito a la ruta correctamente')
      },
      error => {
        console.error('Error al inscribirse en la ruta:', error);
        alert('Error al inscribirse en la ruta')
      }
    );
  }

}
