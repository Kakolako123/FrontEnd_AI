import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Design {
  name: string;
  image: string;
  category: string;
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  selectedCategory: string = 'All';

  categories: string[] = [
    'Tout',
    'Cartes d\'Identité Scolaires',
    'Cartes d\'Identité Médicales',
    'Badges d\'Employés'
  ];

  allDesigns: Design[] = [
    // School ID Cards
    { name: 'Carte d\'Identité Étudiant', image: 'assets/imgs/c1.1.PNG', category: 'Cartes d\'Identité Scolaires' },
    { name: 'Carte d\'Identité Étudiant', image: 'assets/imgs/c2.1.PNG', category: 'Cartes d\'Identité Scolaires' },
    { name: 'Carte d\'Identité Étudiant', image: 'assets/imgs/c10.1.PNG', category: 'Cartes d\'Identité Scolaires' },
    { name: 'Carte d\'Identité Étudiant', image: 'assets/imgs/c11.1.PNG', category: 'Cartes d\'Identité Scolaires' },
    { name: 'Carte d\'Identité Étudiant', image: 'assets/imgs/c12.1.PNG', category: 'Cartes d\'Identité Scolaires' },
    

    // Cartes d'Identité Médicales
    { name: 'Carte d\'Identité Infirmière', image: 'assets/imgs/c6.1.PNG', category: 'Cartes d\'Identité Médicales' },
    { name: 'Carte d\'Identité Médecin Résident', image: 'assets/imgs/c13.1.PNG', category: 'Cartes d\'Identité Médicales' },
    { name: 'Badge d\'Identité Chirurgien', image: 'assets/imgs/c14.1.PNG', category: 'Cartes d\'Identité Médicales' },

    // Badges d'Employés
    { name: 'Carte d\'Identité Manager', image: 'assets/imgs/c3.1.PNG', category: 'Badges d\'Employés' },
    { name: 'Badge d\'Identité Manager', image: 'assets/imgs/c4.1.PNG', category: 'Badges d\'Employés' },
    { name: 'Carte d\'Identité Directeur', image: 'assets/imgs/c5.1.PNG', category: 'Badges d\'Employés' },
    { name: 'Carte d\'Identité Chef de Projet', image: 'assets/imgs/c7.1.PNG', category: 'Badges d\'Employés' },
    { name: 'Badge d\'Identité Marketing', image: 'assets/imgs/c8.1.PNG', category: 'Badges d\'Employés' },

  ];

  constructor(private router: Router) {}

  get filteredDesigns() {
    if (this.selectedCategory === 'Tout') {
      return this.allDesigns;
    }
    return this.allDesigns.filter(design => design.category === this.selectedCategory);
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
  }

  editCard(design: any) {
    // Naviguer vers l'éditeur de carte avec les données de la carte
    this.router.navigate(['/card-edit'], { state: { design } });
  }

  goToAccueil() {
    this.router.navigate(['/accueil']);
  }

  goToCardEdit() {
    this.router.navigate(['/card-edit']);
  }

  goToSalesforceTest() {
    this.router.navigate(['/salesforce-test']);
  }

  goToApiDocumentation() {
    this.router.navigate(['/api-documentation']);
  }
}
