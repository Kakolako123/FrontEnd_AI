import { Injectable } from '@angular/core';
import { createWorker } from 'tesseract.js';

@Injectable({
  providedIn: 'root'
})
export class ImageAnalysisService {
  private worker: any;
  private isInitialized = false;

  constructor() {
    this.initializeWorker();
  }

  private async initializeWorker() {
    if (!this.isInitialized) {
      this.worker = await createWorker('fra');
      await this.worker.loadLanguage('fra');
      await this.worker.initialize('fra');
      this.isInitialized = true;
    }
  }

  async analyzeTemplateImage(imageUrl: string): Promise<any> {
    try {
      await this.initializeWorker();

      // Analyser l'image
      const result = await this.worker.recognize(imageUrl);
      
      // Analyser le texte pour trouver les champs
      const fields = this.extractFields(result.data.text);
      
      return {
        success: true,
        fields: fields
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse de l\'image:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private extractFields(text: string): any {
    // Convertir le texte en minuscules pour faciliter la recherche
    const lowerText = text.toLowerCase();
    
    const fields = {
      photoPosition: null,
      nameField: null,
      idField: null,
      birthDateField: null
    };

    // Rechercher les mots clés communs dans les cartes d'identité
    const lines = lowerText.split('\n');
    lines.forEach((line, index) => {
      // Champ nom
      if (line.includes('nom') || line.includes('name')) {
        fields.nameField = {
          label: 'Nom',
          position: index,
          text: line.trim()
        };
      }
      
      // Champ ID
      if (line.includes('id') || line.includes('n°') || line.includes('numero')) {
        fields.idField = {
          label: 'Numéro étudiant',
          position: index,
          text: line.trim()
        };
      }
      
      // Champ date de naissance
      if (line.includes('naissance') || line.includes('né') || line.includes('birth')) {
        fields.birthDateField = {
          label: 'Date de naissance',
          position: index,
          text: line.trim()
        };
      }
    });

    // Estimation de la position de la photo (généralement dans le coin supérieur gauche)
    fields.photoPosition = {
      x: '15%',
      y: '20%',
      width: '25%',
      height: '60%'
    };

    return fields;
  }

  async terminate() {
    if (this.worker && this.isInitialized) {
      await this.worker.terminate();
      this.isInitialized = false;
    }
  }
}
