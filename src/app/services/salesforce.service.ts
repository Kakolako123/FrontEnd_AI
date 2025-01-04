import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesforceService {
  private baseUrl = 'https://ensa37-dev-ed.develop.my.salesforce.com/services/apexrest/users';
  private accessToken = '00DWU00000A5RJZ!AQEAQB79Bmo2Fbb9_tW9Aachh5OwoLO16vkKe_efozeiFW7LogV4XmLkOCo4bjaosfFUpERyxKdeaTJW2Mngd_8c6lkPV7_L';

  constructor() { }

  // Récupérer tous les utilisateurs
  getUsers(): Observable<any> {
    return from(this.getUsersAsync());
  }

  private async getUsersAsync() {
    try {
      const response = await axios.get(this.baseUrl, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      throw error;
    }
  }

  // Créer un nouvel utilisateur
  createUser(userData: any): Observable<any> {
    return from(this.createUserAsync(userData));
  }

  private async createUserAsync(userData: any) {
    try {
      const response = await axios.post(this.baseUrl, userData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      throw error;
    }
  }

  // Mettre à jour un utilisateur
  updateUser(userId: string, userData: any): Observable<any> {
    return from(this.updateUserAsync(userId, userData));
  }

  private async updateUserAsync(userId: string, userData: any) {
    try {
      const response = await axios.patch(`${this.baseUrl}/${userId}`, userData, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  // Supprimer un utilisateur
  deleteUser(userId: string): Observable<any> {
    return from(this.deleteUserAsync(userId));
  }

  private async deleteUserAsync(userId: string) {
    try {
      const response = await axios.delete(`${this.baseUrl}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur:', error);
      throw error;
    }
  }
  generateImage(userId: string) {
    return from(this.generateImageAsync(userId));
  }

  private async generateImageAsync(userId: string) {
    try {
      const response = await axios.post(`${this.baseUrl}/${userId}`,{}, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la génération de l\'image:', error);
      throw error;
    }
  }
}
