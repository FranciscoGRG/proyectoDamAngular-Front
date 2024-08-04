import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { NotificationService } from '../../Services/notification.service';

@Component({
  selector: 'app-update-image',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './update-image.component.html',
  styleUrl: './update-image.component.css'
})
export class UpdateImageComponent {
  profile_image = "";
  imagePreview: string | ArrayBuffer | null = null;

  constructor(private http: HttpClient, private notificationService: NotificationService) { }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.profile_image = (reader.result as string).split(',')[1]; // Remove the "data:image/png;base64," part
      };
      reader.readAsDataURL(file);
    }
  }

  actualizarImagen() {
    if (!this.profile_image) {
      alert('Por favor seleccione una imagen');
      return;
    }

    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    const payload = {
      profile_image: this.profile_image
    };

    this.http.put('http://localhost/proyectoDamAngular-BACK/public/api/update.profile', payload, {
      headers: headers,
      withCredentials: true // Habilita el envío de credenciales
    }).subscribe(
      (response: any) => {
        // alert("Imagen actualizada correctamente")
        this.notificationService.showSuccess("Imagen actualizada correctamente");
      },
      error => {
        // console.error('Error al actualizar la imagen:', error);
        this.notificationService.showError("Error al actualizar la imagen");
      }
    );
  }
}
