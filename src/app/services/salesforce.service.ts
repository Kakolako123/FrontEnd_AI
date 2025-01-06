import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SalesforceService {
  private baseUrl = 'https://ensa37-dev-ed.develop.my.salesforce.com/services/apexrest/users';
  private accessToken = '00DWU00000A5RJZ!AQEAQPwfEZAxDkN7DCovQLJz8TJSA7rtpKULG314z4pm9zNr_0HA45bNZtb977t6kmgl4_nxyGhS7ReCsdmN4TLsX7KI41aT';

  private refreshTokenUrl = 'https://login.salesforce.com/services/oauth2/token';
  private clientId = '3MVG9PwZx9R6_UrfkYUnZW2eYksdSS7g_n_aPmGjotm9eTG9hBVz9aHwQWCHKFGO9PYm9303ndsmnSsGCzpB.';
  private clientSecret = '787B95F675F7CA8630DC308A97E885CA96D3654278BB0427DE70F30C5C8465DA';
  private refreshToken = '00DWU00000A5RJZ!AQEAQPwfEZAxDkN7DCovQLJz8TJSA7rtpKULG314z4pm9zNr_0HA45bNZtb977t6kmgl4_nxyGhS7ReCsdmN4TLsX7KI41aT';

  constructor() {}

  private async refreshAccessToken(): Promise<string> {
    try {
      const response = await axios.post(this.refreshTokenUrl, null, {
        params: {
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: this.refreshToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erreur lors du rafraîchissement du token:', error.response?.data);
      } else {
        console.error('Erreur inconnue:', error);
      }
      throw error;
    }
  }
  
  private async handleRequest(requestFn: () => Promise<any>): Promise<any> {
    try {
      return await requestFn();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        // Rafraîchir le token et réessayer la requête
        console.log('Token expiré, tentative de rafraîchissement...');
        await this.refreshAccessToken();
        return await requestFn(); // Réessayer la requête après le rafraîchissement
      }
      throw error;
    }
  }
  

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
