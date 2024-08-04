import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastService, AngularToastifyModule } from 'angular-toastify'; 
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [FormsModule, HttpClientModule, AngularToastifyModule],
  templateUrl: './create-route.component.html',
  providers: [ToastService],
  styleUrls: ['./create-route.component.css']
})
export class CreateRouteComponent implements OnInit {

  ngOnInit() {
    const message = this.notificationService.getTemporaryMessage();
    if (message) {
      this.notificationService.showSuccess(message);
    }
  }

  constructor(private http: HttpClient, private router: Router, private notificationService: NotificationService) { }

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

    // Seleccionar el elemento de input de archivos
    const inputElement = document.getElementById('imagen') as HTMLInputElement;
    if (inputElement && inputElement.files) {
      Array.from(inputElement.files).forEach((file, index) => {
        formData.append(`imagenes[${index}]`, file, file.name);
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
        this.notificationService.showError('Error al crear la ruta');
      }
    );
  }

  navigateToRouteDetails(routeId: number) {
    this.router.navigate(['/showRouteDetails/', routeId]);
  }


}
