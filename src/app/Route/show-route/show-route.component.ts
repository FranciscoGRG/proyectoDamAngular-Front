import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importar DomSanitizer
import { AuthService } from '../../Services/auth.service';



@Component({
  selector: 'app-show-route',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './show-route.component.html',
  styleUrl: './show-route.component.css'
})
export default class ShowRouteComponent implements OnInit {

  routes: any[] = [];

  constructor(private http: HttpClient, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef, private authService: AuthService) { }

  ngOnInit() {
    this.fetchRoutes();
  }

  fetchRoutes() {
    this.http.get('http://localhost/proyectoDamAngular-BACK/public/api/getRoutes')
      .subscribe(
        (data: any) => {
          this.routes = data.map((route: { mapsIFrame: string; }) => ({
            ...route,
            safeMapsIFrame: this.sanitizer.bypassSecurityTrustResourceUrl(route.mapsIFrame) // Sanitizar URL
          }));
          console.log('Rutas obtenidas:', this.routes);
        },
        error => {
          console.error('Error al obtener las rutas:', error);
        }
      );
  }

  participar(ruta_id: number, ruta_name: string, ruta_fecha: number, ruta_hora: number) {
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

    // console.log(ruta_name, ruta_fecha, ruta_hora)

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
        console.log('Respuesta correo:', registerResponse);
      },
      error => {
        console.error('Error al inscribirse en la ruta:', error);
        alert('Error al inscribirse en la ruta')
      }
    );
  }

  like(ruta_id: number) {
    console.log(ruta_id);

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
        console.log(registerResponse);
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

}
