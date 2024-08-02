import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { AuthService } from '../../Services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-createdroute',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './show-createdroute.component.html',
  styleUrl: './show-createdroute.component.css'
})
export class ShowCreatedrouteComponent implements OnInit {

  routes: any[] = [];

  constructor(private router: Router, private http: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.fetchRoutes();

    this.authService.rutas$.subscribe(newRutas => {
      this.routes = newRutas;
    });
  }

  fetchRoutes() {

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get('http://localhost/proyectoDamAngular-BACK/public/api/getCreatedRoutes', {
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

  deleteRoute(routeId: number) {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.delete(`http://localhost/proyectoDamAngular-BACK/public/api/deleteRoute/${routeId}`, {
      headers: headers,
      withCredentials: true,
    }).subscribe(
      (response: any) => {
        alert("Ruta borrada correctamente")
        this.authService.actualizarRutas(response)

      },
      error => {
        console.error('Error al borrar la ruta:', error);
        alert("No se ha podido borrar la ruta")
      }
    );
  }

  navigateToEditRoute(routeId: number) {
    this.router.navigate(['editRoute',routeId ])
  }
}
