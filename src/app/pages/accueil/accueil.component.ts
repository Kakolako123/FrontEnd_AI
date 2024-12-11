import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FeaturesSectionComponent } from "../features-section/features-section.component";
import { CardExamplesComponent } from "../card-examples/card-examples.component";
import { AvisComponent } from "../avis/avis.component";
import { AboutComponent } from "../about/about.component";
import { ContactComponent } from "../contact/contact.component";

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [
    FeaturesSectionComponent,
    CardExamplesComponent,
    AvisComponent,
    AboutComponent,
    ContactComponent
  ],
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css']
})
export class AccueilComponent {
  constructor(private router: Router) {}

  onLink() {
    console.log('Tentative de navigation vers side-bar...');
    this.router.navigate(['/side-bar']).then(
      success => {
        console.log('Navigation réussie:', success);
      },
      error => {
        console.error('Erreur de navigation:', error);
      }
    );
  }
}
