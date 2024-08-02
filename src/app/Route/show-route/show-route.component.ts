import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importar DomSanitizer
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-show-route',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './show-route.component.html',
  styleUrl: './show-route.component.css'
})
export class ShowRouteComponent implements OnInit {

  routes: any[] = [];
  mensaje: string | null = null;

  constructor(private router: Router, private http: HttpClient, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit() {
    this.fetchRoutes();
  }

  fetchRoutes() {
    this.http.get('http://localhost/proyectoDamAngular-BACK/public/api/getRoutes')
      .subscribe(
        (data: any) => {
          this.routes = data.map((route: any) => ({
            ...route,
            safeMapsIFrame: this.sanitizer.bypassSecurityTrustResourceUrl(route.mapsIFrame), // Sanitizar URL
            imagen: JSON.parse(route.imagen) // Convertir la cadena JSON a un array
          }));
        },
        error => {
          console.error('Error al obtener las rutas:', error);
        }
      );
  }

  participar(ruta_id: number, ruta_name: string, ruta_fecha: number, ruta_hora: number) {

    let fechaStr: string = ruta_fecha.toString();
    let horaStr: string = ruta_hora.toString();

    if (this.esMasTarde(fechaStr, horaStr)) {
      this.mensaje = 'La fecha y hora de esta ruta ya han pasado.';
      return;
    }

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
        alert('Te has inscrito a la ruta correctamente')
      },
      error => {
        console.error('Error al inscribirse en la ruta:', error);
        alert('Error al inscribirse en la ruta')
      }
    );

    // Peticion para enviar el correo
    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/confirmar', {
      nombreRuta: ruta_name,
      fecha: ruta_fecha,
      hora: ruta_hora
    }, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (registerResponse: any) => {
        alert('Correo enviado')
      },
      error => {
        console.error('Error al inscribirse en la ruta:', error);
        alert('Error al inscribirse en la ruta')
      }
    );
  }

  like(ruta_id: number) {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Dar like a la ruta
    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/darLike', {
      ruta_id: ruta_id
    }, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (registerResponse: any) => {
        alert('Le has dado like');
        this.updateRouteLikes(ruta_id); // Llamar a la función para actualizar los likes
      },
      error => {
        console.error('Error al dar like:', error);
        alert('Error al dar like');
      }
    );
  }

  updateRouteLikes(ruta_id: number) {

    const token = this.authService.getToken()

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });


    this.http.get(`http://localhost/proyectoDamAngular-BACK/public/api/updatedLike/${ruta_id}`, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (data: any) => {
        const updatedRoute = this.routes.find(route => route.id === ruta_id);
        if (updatedRoute) {
          updatedRoute.likes = data.likes;
          this.cdr.detectChanges(); // Forzar la detección de cambios
        }
      },
      error => {
        console.error('Error al actualizar los likes de la ruta:', error);
      }
    );
  }

  navigateToRouteDetails(routeId: number) {
    this.router.navigate(['/showRouteDetails', routeId]);
  }

  // Nueva función para comparar fechas
  esMasTarde(fecha: string, hora: string): boolean {
    const fechaHora = new Date(`${fecha}T${hora}`);
    const ahora = new Date();
    return fechaHora < ahora;
  }

  mostrarMensaje() {
    this.mensaje = 'No puedes apuntarte a esta ruta porque la fecha y hora ya han pasado.';
  }

  ocultarMensaje() {
    this.mensaje = null;
  }

}
