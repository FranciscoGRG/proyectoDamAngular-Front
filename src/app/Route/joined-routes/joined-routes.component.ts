import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-joined-routes',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './joined-routes.component.html',
  styleUrl: './joined-routes.component.css'
})
export class JoinedRoutesComponent implements OnInit {

  constructor(private http: HttpClient) { }

  routes: any[] = [];
  mensaje: string = "Ya ha finalizado la ruta"

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

  esMasTarde(fecha: string, hora: string): boolean {
    const fechaHora = new Date(`${fecha}T${hora}`);
    const ahora = new Date();

    console.log(fechaHora < ahora)
    return fechaHora < ahora;
  }
}
