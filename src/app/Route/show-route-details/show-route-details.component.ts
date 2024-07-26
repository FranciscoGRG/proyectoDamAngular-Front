import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../Services/auth.service';
import { CarruselComponent } from '../../carrusel/carrusel.component';
import { faHeart as fasHeart } from '@fortawesome/free-solid-svg-icons';  // Corazón lleno
import { faHeart as farHeart } from '@fortawesome/free-regular-svg-icons'; // Corazón vacío
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-show-route-details',
  standalone: true,
  imports: [HttpClientModule, CommonModule, CarruselComponent, FontAwesomeModule],
  templateUrl: './show-route-details.component.html',
  styleUrls: ['./show-route-details.component.css'],
})
export class ShowRouteDetailsComponent implements OnInit {

  routeId: number | null = null;
  mensaje: string | null = null;
  mensaje2: string | null = null;
  mensajeParticipante: string | null = null;

  fasHeart = fasHeart;
  farHeart = farHeart;
  animationClass = '';

  esParticipante: boolean = false;
  like: boolean = false;

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
      this.fetchRoutes();
      this.participante();
      this.tieneLike();
    });

    // Suscribirse al observable de likes
    this.authService.likes$.subscribe(newLikes => {
      this.routes.likes = newLikes;
    });

    // Suscribirse al observable de like
    this.authService.like$.subscribe(newLike => {
      this.like = newLike;
    });

    // Suscribirse al observable de participante
    this.authService.participante$.subscribe(newLike => {
      this.esParticipante = newLike;
    });
  }



  fetchRoutes() {
    this.http.get(`http://localhost/proyectoDamAngular-BACK/public/api/numberParticipant/${this.routeId}`)
      .subscribe(
        (data: any) => {
          this.nParticipantes = data;
        },
        error => {
          console.error('Error al obtener los participantes:', error);
        }
      );

    this.http.get(`http://localhost/proyectoDamAngular-BACK/public/api/getRoute/${this.routeId}`)
      .subscribe(
        (data: any) => {
          if (data && data.length > 0) {
            const routeData = data[0];
            this.routes = {
              ...routeData,
              safeMapsIFrame: this.sanitizer.bypassSecurityTrustResourceUrl(routeData.mapsIFrame),
              imagen: JSON.parse(routeData.imagen)
            };
          } else {
            console.error('La respuesta del servidor no contiene datos válidos.');
          }
        },
        error => {
          console.error('Error al obtener la ruta:', error);
        }
      );
  }

  participante() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(`http://localhost/proyectoDamAngular-BACK/public/api/esParticipante/${this.routeId}`, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (response: any) => {
        this.esParticipante = response.esParticipante;
      },
      error => {
        console.error('Error al comprobar si es participante:', error);
      }
    );
  }

  tieneLike() {
    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get(`http://localhost/proyectoDamAngular-BACK/public/api/tieneLike/${this.routeId}`, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (response: any) => {
        this.like = response.tieneLike;
      },
      error => {
        console.error('Error al comprobar si tiene like:', error);
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

    const token = this.authService.getToken();

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
        alert('Te has inscrito a la ruta correctamente');
        this.authService.actualizarParticipante(true)
      },
      error => {
        console.error('Error al inscribirse en la ruta:', error);
        alert('Error al inscribirse en la ruta');
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
        alert('Correo enviado');
      },
      error => {
        console.error('Error al inscribirse en la ruta:', error);
        alert('Error al inscribirse en la ruta');
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

  mostrarMensaje2() {
    this.mensaje2 = 'No puedes apuntarte a esta ruta porque ya estas inscrito.';
  }

  mostrarMensajeParticipante() {
    this.mensajeParticipante = 'Ya estas inscrito.';
  }

  ocultarMensaje() {
    this.mensaje = null;
  }

  ocultarMensaje2() {
    this.mensaje2 = null;
  }

  ocultarMensajeParticipante() {
    this.mensajeParticipante = null;
  }

  darlike(ruta_id: number) {

    const token = this.authService.getToken();

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    if (this.like === false) {
      this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/darLike', {
        ruta_id: ruta_id
      }, {
        headers: headers,
        withCredentials: true // Habilita el envío de credenciales
      }).subscribe(
        (registerResponse: any) => {
          alert('Le has dado like');
          console.log(registerResponse.likes)
          this.authService.updateLikes(registerResponse.likes);
          if (this.like === true) {
            this.authService.actualizarLike(false);
          } else { this.authService.actualizarLike(true); }

          this.animationClass = this.like ? 'animate-unlike' : 'animate-like';
          console.log(this.like)

          setTimeout(() => {
            this.animationClass = '';
          }, 300);  // Debe coincidir con la duración de la animación
        },
        error => {
          console.error('Error al dar like:', error);
          alert('Error al dar like');
        }
      );
    } else {
      this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/quitarLike', {
        ruta_id: ruta_id
      }, {
        headers: headers,
        withCredentials: true // Habilita el envío de credenciales
      }).subscribe(
        (registerResponse: any) => {
          alert('Le has quitado el like');
          this.authService.updateLikes(registerResponse.likes);
          this.authService.actualizarLike(false);
          this.animationClass = this.like ? 'animate-unlike' : 'animate-like';

          setTimeout(() => {
            this.animationClass = '';
          }, 300);  // Debe coincidir con la duración de la animación
        },
        error => {
          console.error('Error al quitar like:', error);
          alert('Error al quitar like');
        }
      );
    }
  }

  estaLogeado() {
    return this.authService.isLoggedIn();
  }
}
