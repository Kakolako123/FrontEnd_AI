import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IdCardComponent } from '../id-card/id-card.component';
import { SalesforceService } from '../../services/salesforce.service';
import { FormsModule } from "@angular/forms";

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
  showInfo?:boolean;
}

@Component({
  selector: 'app-salesforce-test',
  standalone: true,
  imports: [CommonModule, IdCardComponent, FormsModule],
  templateUrl: './salesforce-test.component.html',
  styleUrls: ['./salesforce-test.component.scss']
})
export class SalesforceTestComponent implements OnInit {
  // Public properties accessible in the template
  status: string = 'Prêt à charger les données';
  error: boolean = false;
  errorMessage: string = '';
  detailedError: string = '';
  allUsers: SalesforceUser[] = [];
  users: SalesforceUser[] = [];
  rawData: any = null;
  isLoading: boolean = false;
  showDebug: boolean = false;
  viewMode: 'table' | 'cards' = 'table';
  editingUserId: string | null = null;
  editedUser: SalesforceUser | null = null;
  originalUser: SalesforceUser | null = null;
  generatingImage:boolean = false;
  constructor(private salesforceService: SalesforceService) { }

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
      this.allUsers = data;
      this.rawData = data;
      this.filterUsersWithImages();
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
  filterUsersWithImages() {
    this.users = this.allUsers.filter(user => user.Image_URL__c);
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

  startEdit(user: SalesforceUser) {
    this.editingUserId = user.Id;
    this.editedUser = { ...user };
    this.originalUser = { ...user };
  }

  cancelEdit() {
    this.editingUserId = null;
    this.editedUser = null;
    this.originalUser = null;
  }

  async saveEdit(user: SalesforceUser) {
    try {
      if (this.editedUser && this.originalUser) {
        this.isLoading = true;
        this.status = 'Mise à jour en cours...';

        // Prepare the object for Salesforce update
        const updatedUser = {
          nom__c: this.editedUser.nom__c,
          prenom__c: this.editedUser.prenom__c,
          sexe__c: this.editedUser.sexe__c,
          date_naissance__c: this.editedUser.date_naissance__c,
          identifiant__c: this.editedUser.identifiant__c,
          adresse__c: this.editedUser.adresse__c,
          continent__c: this.editedUser.continent__c,
          locale__c: this.editedUser.locale__c,
          date_validite__c: this.editedUser.date_validite__c,
          Image_URL__c: this.editedUser.Image_URL__c,
        };

        const updatedData = await this.salesforceService.updateUser(user.Id, updatedUser).toPromise();

        const index = this.users.findIndex(u => u.Id === user.Id);
        if (index > -1) {
          this.users[index] = { ...this.editedUser };
        }

        this.status = 'Mise à jour effectuée avec succès';
      }
    } catch (error: any) {
      this.error = true;
      this.errorMessage = 'Erreur lors de la mise à jour';
      this.detailedError = error.message || 'Erreur inconnue';
      this.status = 'Erreur';
      console.error('Erreur lors de la mise à jour:', error);
    } finally {
      this.isLoading = false;
      this.editingUserId = null;
      this.editedUser = null;
      this.originalUser = null;
    }
  }
  async generateImage() {
    const usersWithoutImage = this.getUsersWithoutImage();
    if (usersWithoutImage.length > 0 && !this.generatingImage) {
      this.generatingImage = true;
      const user =  usersWithoutImage[0];
      this.salesforceService.generateImage(user.Id).subscribe(
        (response:any) => {
          console.log('Image generated successfully:', response);
          // After generating the image, update the user's image URL
          // Here we assume that the API returns the new image URL in the response
          const updatedUsers =  this.allUsers.map(u => {
            if(u.Id === user.Id){
              return { ...u, Image_URL__c: response, showInfo: true };
            }
            return u;
          });
          this.allUsers = updatedUsers;
          this.filterUsersWithImages();
        },
        (error) => {
          this.error = true;
          this.errorMessage = 'Erreur lors de la génération des images';
          this.detailedError = error.message || 'Erreur inconnue'
          if (error.response) {
            console.log('Données de réponse:', error.response.data);
            console.log('Status:', error.response.status);
            console.log('Headers:', error.response.headers);
          }
          console.error('Error generating images:', error);
        },
        ()=>{
          this.generatingImage = false;
        }
      );

    }
  }
  getUsersWithoutImage(){
    return this.allUsers.filter(user => !user.Image_URL__c);
  }
}
