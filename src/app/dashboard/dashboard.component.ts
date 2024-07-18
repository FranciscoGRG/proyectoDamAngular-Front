import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private router: Router) { }

  navigateToCreateRoute() {
    this.router.navigate(['/createRoute']);
  }

  videoUrls: string[] = [
    "https://static.vecteezy.com/system/resources/previews/007/660/166/mp4/close-up-hand-of-fashion-designer-or-stylist-manage-new-clothes-collection-on-rack-in-studio-woman-tailor-dressmaker-prepare-wardrobe-clothing-for-sale-free-video.mp4",
    "https://static.vecteezy.com/system/resources/previews/007/668/059/mp4/close-up-clothes-of-fashion-designer-or-stylist-manage-new-clothes-collection-on-rack-in-studio-young-man-tailor-dressmaker-prepare-wardrobe-clothing-for-sale-free-video.mp4",
    "https://static.vecteezy.com/system/resources/previews/007/668/046/mp4/close-up-clothes-of-fashion-designer-or-stylist-manage-new-clothes-collection-on-rack-in-studio-woman-tailor-dressmaker-prepare-wardrobe-clothing-for-sale-free-video.mp4",
    "https://static.vecteezy.com/system/resources/previews/001/796/865/mp4/home-wardrobe-or-clothing-shop-changing-room-asian-young-woman-choosing-her-fashion-outfit-clothes-in-closet-at-home-or-store-free-video.mp4"
  ]

  currentVideoIndex: number = 0;

  handleEnded(): void {
    this.currentVideoIndex = (this.currentVideoIndex + 1) % this.videoUrls.length;
  }
}
