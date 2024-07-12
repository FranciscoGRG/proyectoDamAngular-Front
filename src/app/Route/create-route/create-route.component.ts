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

    // Variable que contiene el iframe
    // let mapsIframe = '<iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d12597.198956814289!2d-4.796167676672617!3d37.87667240135537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2ses!4v1720705259736!5m2!1ses!2ses" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';

    // Expresión regular para extraer el valor del atributo src
    let regex = /src="([^"]*)"/;

    // Ejecutar la expresión regular en la cadena
    let match = this.formData.mapsIFrame.match(regex);

    // Guardar el enlace en una nueva variable si hay coincidencia
    let enlace = match ? match[1] : null;

    console.log(enlace);


    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost/proyectoDamAngular-BACK/public/api/createRoute', {
      title: this.formData.title,
      description: this.formData.description,
      distance: this.formData.distance,
      unevenness: this.formData.unevenness,
      difficulty: this.formData.difficulty,
      mapsIFrame: enlace,
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
