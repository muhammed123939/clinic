import { Component } from '@angular/core';
import { CarouselModule } from 'ngx-bootstrap/carousel';
@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.css'
})
export class SlideshowComponent {

}
