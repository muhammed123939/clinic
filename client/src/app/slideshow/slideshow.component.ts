import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CarouselModule } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [CarouselModule , FormsModule , NgFor],
  templateUrl: './slideshow.component.html',
  styleUrl: '././slideshow.component.css'
})

export class SlideshowComponent {
 
  myInterval = 3000;
  activeSlideIndex = 1;
  slides: {image: string; text?: string}[] = [
    {image: '../../assets/slideshow/1.jpg' , text: 'First Slide'},
    {image: '../../assets/slideshow/2.jpg', text: 'Second Slide'},
    {image: '../../assets/slideshow/3.jpg', text: 'Third Slide'} 
  ];
}
