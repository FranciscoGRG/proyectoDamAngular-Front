import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
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

}
