import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { ToastService } from 'angular-toastify';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(private toastService: ToastService) { }

  private loggedIn = new BehaviorSubject<boolean>(this.isLoggedIn());
  private likesSubject = new BehaviorSubject<number>(0);
  likes$ = this.likesSubject.asObservable();

  private likeSubject = new BehaviorSubject<boolean>(false);
  like$ = this.likeSubject.asObservable();

  private participanteSubject = new BehaviorSubject<boolean>(false);
  participante$ = this.participanteSubject.asObservable();

  private rutasCreadasSubject = new BehaviorSubject<[]>([]);
  rutas$ = this.rutasCreadasSubject.asObservable();

  private nuevaImagenSubject = new BehaviorSubject<string>('');
  imagen$ = this.nuevaImagenSubject.asObservable();

  get isLoggedIn$() {
    return this.loggedIn.asObservable();
  }

  isLoggedIn(): boolean {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;
    return token != null;
  }

  logIn(token: string): void {
    localStorage.setItem('user', JSON.stringify(token));
    this.loggedIn.next(true);
  }

  logOut(): void {
    localStorage.removeItem('user');
    this.loggedIn.next(false);
  }

  getToken(): string {
    const storedUser = localStorage.getItem('user');
    const token = storedUser ? JSON.parse(storedUser) : null;

    return token;
  }

  //Sube los likes
  updateLikes(newLikes: number) {
    this.likesSubject.next(newLikes);
  }

  //Marca que tiene like la ruta
  actualizarLike(nuevoLike: boolean){
    this.likeSubject.next(nuevoLike);
  }

  actualizarParticipante(nuevoParticipante: boolean){
    this.participanteSubject.next(nuevoParticipante);
  }

  actualizarRutas(rutas: []){
    this.rutasCreadasSubject.next(rutas);
  }

  actualizarImagen(nuevaImagen: string){
    this.nuevaImagenSubject.next(nuevaImagen);
  }
}
