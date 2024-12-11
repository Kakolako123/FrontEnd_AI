import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdCardComponent } from '../id-card/id-card.component';
import { SalesforceService } from '../../services/salesforce.service';

interface SalesforceUser {
  attributes: {
    type: string;
    url: string;
  };
  Id: string;
  nom__c: string;
  prenom__c: string;
  sexe__c: string;
  date_naissance__c: string;
  identifiant__c: string;
  adresse__c: string;
  continent__c: string;
  locale__c: string;
  date_validite__c: string;
  Image_URL__c?: string;
}

@Component({
  selector: 'app-salesforce-test',
  standalone: true,
  imports: [CommonModule, IdCardComponent],
  templateUrl: './salesforce-test.component.html',
  styleUrls: ['./salesforce-test.component.scss']
})
export class SalesforceTestComponent implements OnInit {
  // Public properties accessibles dans le template
  status: string = 'Prêt à charger les données';
  error: boolean = false;
  errorMessage: string = '';
  detailedError: string = '';
  users: SalesforceUser[] = [];
  rawData: any = null;
  isLoading: boolean = false;
  showDebug: boolean = false;
  viewMode: 'table' | 'cards' = 'table';

  constructor(private salesforceService: SalesforceService) {}

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    try {
      this.isLoading = true;
      this.status = 'Chargement des données...';
      this.error = false;
      this.errorMessage = '';
      this.detailedError = '';

      const data = await this.salesforceService.getUsers().toPromise();
      this.users = data;
      this.rawData = data;
      this.status = 'Données chargées avec succès';
    } catch (error: any) {
      this.error = true;
      this.errorMessage = 'Erreur lors du chargement des données';
      this.detailedError = error.message || 'Erreur inconnue';
      this.status = 'Erreur';
      console.error('Erreur complète:', error);
      if (error.response) {
        console.log('Données de réponse:', error.response.data);
        console.log('Status:', error.response.status);
        console.log('Headers:', error.response.headers);
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Formater les dates pour l'affichage
  formatDate(date: string): string {
    if (!date) return '-';
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  }

  // Obtenir les initiales pour l'avatar par défaut
  getInitials(nom: string, prenom: string): string {
    const n = (nom || '').charAt(0);
    const p = (prenom || '').charAt(0);
    return (n + p).toUpperCase();
  }

  toggleDebug() {
    this.showDebug = !this.showDebug;
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }
}
