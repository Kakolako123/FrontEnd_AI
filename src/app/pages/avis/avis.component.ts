import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-avis',
  standalone: true,
  imports: [],
  templateUrl: './avis.component.html',
  styleUrl: './avis.component.css'
})
export class AvisComponent implements OnInit {
  avisList = [
    {
      name: 'Jean Dupont',
      rating: 4,
      comment: 'Super produit ! Très satisfait de mon achat.',
    },
    {
      name: 'Marie Lefevre',
      rating: 5,
      comment: 'Service impeccable et livraison rapide.',
    },
    {
      name: 'Ahmed Ben Ali',
      rating: 3,
      comment: 'Le produit est bon, mais l\'emballage pourrait être amélioré.',
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
