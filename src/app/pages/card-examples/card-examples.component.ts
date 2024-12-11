import { Component, AfterViewInit } from '@angular/core';
import AOS from 'aos';
import 'aos/dist/aos.css';

@Component({
  selector: 'app-card-examples',
  standalone: true,
  templateUrl: './card-examples.component.html',
  styleUrls: ['./card-examples.component.scss'],
})
export class CardExamplesComponent implements AfterViewInit {
  cardImages = [
    'src/assets/imgs/img1.PNG',
    '/assets/imgs/img2.PNG',
    '/assets/imgs/img3.PNG',
    '/assets/imgs/img4.PNG',
    '/assets/imgs/img5.PNG',
    '/assets/imgs/img6.PNG',
    '/assets/imgs/img7.PNG',
    '/assets/imgs/img8.PNG',
    '/assets/imgs/img9.PNG',
  ];

  ngAfterViewInit(): void {
    AOS.init(); // Initialise AOS après le rendu de la vue
  }
}
