import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Importar
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-show-route-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule],
  templateUrl: './show-route-details.component.html',
  styleUrl: './show-route-details.component.css'
})
export class ShowRouteDetailsComponent implements OnInit {

  routeId: number | null = null;
  mensaje: string | null = null;

  nParticipantes: number = 0;
  routes: any = {};

  constructor(private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer, private authService: AuthService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.routeId = +idParam; // '+' convierte el valor de string a número
      } else {
        this.routeId = null; // O maneja el caso en que el parámetro es null
      }
      this.fetchRoutes()
    });
  }


  fetchRoutes() {
    this.http.get(`http://localhost/proyectoDamAngular-BACK/public/api/numberParticipant/${this.routeId}`)
      .subscribe(
        (data: any) => {
          this.nParticipantes = data;
          console.log('Numero de participantes:', this.nParticipantes);
        },
        error => {
          console.error('Error al obtener los participantes:', error);
        }
      );

    this.http.get(`http://localhost/proyectoDamAngular-BACK/public/api/getRoute/${this.routeId}`)
      .subscribe(
        (data: any) => {
          if (data && data.length > 0) {
            const routeData = data[0]; // Acceder al primer elemento del array data
            this.routes = {
              ...routeData,
              safeMapsIFrame: this.sanitizer.bypassSecurityTrustResourceUrl(routeData.mapsIFrame),
              imagen: JSON.parse(routeData.imagen)
            };
            console.log('Ruta:', this.routes);
          } else {
            console.error('La respuesta del servidor no contiene datos válidos.');
          }
        },
        error => {
          console.error('Error al obtener la ruta:', error);
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
        //Mostrar con el resultado de la peticion los likes actualizados
      },
      error => {
        console.error('Error al actualizar los likes de la ruta:', error);
      }
    );
  }


}
