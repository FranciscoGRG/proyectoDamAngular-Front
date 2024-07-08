import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-create-route',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './create-route.component.html',
  styleUrl: './create-route.component.css'
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
    // console.log('Form Data:', this.formData);

    const user = JSON.parse(localStorage.getItem('user') || '{}'); // Obtén el token desde el almacenamiento local, usa '{}' si es null
    const token = user?.token || ''; // Asegúrate de obtener el token, usa '' si es null

    // console.log(token)

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

      category: this.formData.category,
    }, {headers, withCredentials: true}).subscribe(
      (response: any) => {
        console.log('Ruta creada:', response);
      },
      error => {
        console.error('Error al crear la ruta:', error);
      }

    )
  }
}