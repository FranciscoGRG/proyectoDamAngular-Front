import { Component, CUSTOM_ELEMENTS_SCHEMA, AfterViewInit, ViewChild, Input, ElementRef } from '@angular/core';
import { register } from 'swiper/element/bundle';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import Swiper from 'swiper';

register();

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CarruselComponent implements AfterViewInit {
  @ViewChild('swiperRef', { static: false }) swiperRef: any;
  swiper: Swiper | undefined;

  @Input() images: string[] = [];

  ngAfterViewInit() {
    // Inicialización de Swiper después de que la vista se ha inicializado
    this.swiper = this.swiperRef.nativeElement.swiper;
  }

  nextSlide() {
    this.swiper?.slideNext();
  }

  prevSlide() {
    this.swiper?.slidePrev();
  }
}
