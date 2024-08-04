import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../Services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Importar CommonModule

@Component({
  selector: 'app-liked-routes',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './liked-routes.component.html',
  styleUrl: './liked-routes.component.css'
})
export class LikedRoutesComponent implements OnInit {

  constructor(private http: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer) { }

  routes: any[] = [];
  mensaje: string = "Ya ha finalizado la ruta"

  ngOnInit() {
    this.fetchRoutes();
  }

  fetchRoutes() {

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get('http://localhost/proyectoDamAngular-BACK/public/api/likedRoutes', {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    })
      .subscribe(
        (data: any) => {
          if (data && Array.isArray(data)) {
            this.routes = data.map((route: any) => ({
              ...route,
              safeMapsIFrame: this.sanitizer.bypassSecurityTrustResourceUrl(route.mapsIFrame),
              imagen: JSON.parse(route.imagen)
            }));
          } else {
            console.error('La respuesta del servidor no contiene datos válidos.');
          }
        },
        error => {
          console.error('Error al obtener las rutas:', error);
        }
      );
  }

  esMasTarde(fecha: string, hora: string): boolean {
    const fechaHora = new Date(`${fecha}T${hora}`);
    const ahora = new Date();

    return fechaHora < ahora;
  }

}
