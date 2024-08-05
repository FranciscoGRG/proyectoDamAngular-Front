import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css']
})
export class CreateRouteComponent {

  numeroPregunta: number = 0;
  totalPreguntas: number;

  constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) {
    this.totalPreguntas = 4; // Número total de preguntas en el formulario
  }

  formData = {
    title: '',
    description: '',
    distance: '',
    unevenness: '',
    difficulty: '',
    mapsIFrame: '',
    location: '',
    imagenes: [],
    fecha: '',
    hora: '',
    category: '',
  };

  ciudades: string[] = [
    "Álava", "Albacete", "Alicante", "Almería", "Asturias",
    "Ávila", "Badajoz", "Baleares", "Barcelona", "Burgos",
    "Cáceres", "Cádiz", "Cantabria", "Castellón", "Ciudad Real",
    "Córdoba", "Cuenca", "Gerona", "Granada", "Guadalajara",
    "Guipúzcoa", "Huelva", "Huesca", "Jaén", "La Coruña",
    "La Rioja", "Las Palmas", "León", "Lérida", "Lugo",
    "Madrid", "Málaga", "Murcia", "Navarra", "Orense",
    "Palencia", "Pontevedra", "Salamanca", "Segovia", "Sevilla",
    "Soria", "Tarragona", "Santa Cruz de Tenerife", "Teruel", "Toledo",
    "Valencia", "Valladolid", "Vizcaya", "Zamora", "Zaragoza"
  ];

  createRoute() {

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    // Expresión regular para extraer el valor del atributo src
    let regex = /src="([^"]*)"/;

    // Ejecutar la expresión regular en la cadena
    let match = this.formData.mapsIFrame.match(regex);

    // Guardar el enlace en una nueva variable si hay coincidencia
    let enlace = match ? match[1] : "";

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const formData = new FormData();
    formData.append('title', this.formData.title);
    formData.append('description', this.formData.description);
    formData.append('distance', this.formData.distance);
    formData.append('unevenness', this.formData.unevenness);
    formData.append('difficulty', this.formData.difficulty);
    formData.append('mapsIFrame', enlace);
    formData.append('location', this.formData.location);
    formData.append('fecha', this.formData.fecha);
    formData.append('hora', this.formData.hora);
    formData.append('category', this.formData.category);

    // Añadir archivos a FormData
    if (this.formData.imagenes.length > 0) {
      Array.from(this.formData.imagenes).forEach((file: File) => {
        formData.append('imagenes[]', file, file.name);
      });
    }

    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/createRoute', formData, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (response: any) => {
        this.notificationService.setTemporaryMessage('Ruta creada correctamente');
        this.navigateToRouteDetails(response.route)
      },
      error => {
        console.error('Error al crear la ruta:', error);
        alert("No se ha podido crear la ruta");
      }
    );
  }

  navigateToRouteDetails(routeId: number) {
    this.router.navigate(['/showRouteDetails/', routeId]);
  }

  siguientePregunta() {
    if (this.numeroPregunta < this.totalPreguntas - 1) {
      this.numeroPregunta++;
    }
  }

  preguntaAnterior() {
    if (this.numeroPregunta > 0) {
      this.numeroPregunta--;
    }
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.formData.imagenes = Array.from(event.target.files);
    }
  }


}
