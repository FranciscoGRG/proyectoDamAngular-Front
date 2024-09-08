import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-route',
  standalone: true,
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './edit-route.component.html',
  styleUrl: './edit-route.component.css'
})
export class EditRouteComponent implements OnInit {
  routes: any = {};
  routeId: number | null = null;
  
  formData = {
    id: '',
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

  constructor(private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        this.routeId = +idParam;
      } else {
        this.routeId = null;
      }
      this.fetchRoutes();
    });
  }

  fetchRoutes() {
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
            this.formData.id = this.routes.id;
            this.formData.title = this.routes.title;
            this.formData.description = this.routes.description;
            this.formData.distance = this.routes.distance;
            this.formData.unevenness = this.routes.unevenness;
            this.formData.difficulty = this.routes.difficulty;
            this.formData.mapsIFrame = this.routes.mapsIFrame;
            this.formData.location = this.routes.location;
            this.formData.imagenes = this.routes.imagen;
            this.formData.fecha = this.routes.fecha;
            this.formData.hora = this.routes.hora;
            this.formData.category = this.routes.category;
          } else {
            console.error('La respuesta del servidor no contiene datos válidos.');
          }
        },
        error => {
          console.error('Error al obtener la ruta:', error);
        }
      );
  }

  editRoute() {

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.put('http://localhost/proyectoDamAngular-BACK/public/api/editRoute', this.formData, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (response: any) => {
        console.log(response)
      },
      error => {
        console.error('Error al crear la ruta:', error);
        alert("No se ha podido crear la ruta")
      }
    );
  }
}
