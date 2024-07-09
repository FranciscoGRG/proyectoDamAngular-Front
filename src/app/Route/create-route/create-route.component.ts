import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './create-route.component.html',
  styleUrls: ['./create-route.component.css']
})
export default class CreateRouteComponent {

  constructor(private http: HttpClient) { }

  formData = {
    title: '',
    description: '',
    distance: '',
    unevenness: '',
    difficulty: '',
    mapsIFrame: '',
    location: '',
    imagen: '',
    fecha: '',
    hora: '',
    category: '',
  };

  createRoute() {

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/createRoute', {
      title: this.formData.title,
      description: this.formData.description,
      distance: this.formData.distance,
      unevenness: this.formData.unevenness,
      difficulty: this.formData.difficulty,
      mapsIFrame: this.formData.mapsIFrame,
      location: this.formData.location,
      imagen: this.formData.imagen,
      fecha: this.formData.fecha,
      hora: this.formData.hora,
      category: this.formData.category,
    }, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (response: any) => {
        console.log('Ruta creada:', response);
        alert("Ruta creada correctamente")
      },
      error => {
        console.error('Error al crear la ruta:', error);
        alert("No se ha podido crear la ruta")
      }
    );
  }
}
