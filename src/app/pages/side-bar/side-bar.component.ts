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
    'All',
    'School ID Cards',
    'Medical ID Cards',
    'Employee Badges'
  ];

  allDesigns: Design[] = [
    // School ID Cards
    { name: 'Student ID Card', image: 'assets/imgs/c1.1.PNG', category: 'School ID Cards' },
    { name: 'Student ID Card', image: 'assets/imgs/c2.1.PNG', category: 'School ID Cards' },
    { name: 'Student ID Card', image: 'assets/imgs/c10.1.PNG', category: 'School ID Cards' },
    { name: 'Student ID Card', image: 'assets/imgs/c11.1.PNG', category: 'School ID Cards' },
    { name: 'Student ID Card', image: 'assets/imgs/c12.1.PNG', category: 'School ID Cards' },

    // Medical ID Cards
    { name: 'Nurse ID Card', image: 'assets/imgs/c6.1.PNG', category: 'Medical ID Cards' },
    { name: 'Resident Physician ID', image: 'assets/imgs/c13.1.PNG', category: 'Medical ID Cards' },
    { name: 'Surgeon ID Badge', image: 'assets/imgs/c14.1.PNG', category: 'Medical ID Cards' },

    // Employee Badges
    { name: 'Manager ID Card', image: 'assets/imgs/c3.1.PNG', category: 'Employee Badges' },
    { name: 'Manager ID Badge', image: 'assets/imgs/c4.1.PNG', category: 'Employee Badges' },
    { name: 'Director ID Card', image: 'assets/imgs/c5.1.PNG', category: 'Employee Badges' },
    { name: 'Project Manager ID', image: 'assets/imgs/c7.1.PNG', category: 'Employee Badges' },
    { name: 'Marketing ID Badge', image: 'assets/imgs/c8.1.PNG', category: 'Employee Badges' }
  ];

  constructor(private router: Router) {}

  get filteredDesigns() {
    if (this.selectedCategory === 'All') {
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
