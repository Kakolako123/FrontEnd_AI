import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class PdfService {
  async generateStudentCard(cardElement: HTMLElement, studentData: any): Promise<void> {
    try {
      // Créer un canvas avec les dimensions exactes
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 300;
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Impossible de créer le contexte 2D');
      }

      // Charger et dessiner le template
      const templateImage = new Image();
      templateImage.src = 'assets/imgs/c1.1-Photoroom.png'; // Utilisation du bon template
      
      await new Promise((resolve, reject) => {
        templateImage.onload = resolve;
        templateImage.onerror = (e) => {
          console.error('Erreur de chargement du template:', e);
          reject(new Error('Impossible de charger le template'));
        };
      });
      
      // Dessiner le template
      context.drawImage(templateImage, 0, 0, 500, 300);

      // Charger et dessiner la photo de l'étudiant si elle existe
      if (studentData.photo) {
        const photoImage = new Image();
        photoImage.src = studentData.photo;
        
        await new Promise((resolve, reject) => {
          photoImage.onload = resolve;
          photoImage.onerror = (e) => {
            console.error('Erreur de chargement de la photo:', e);
            reject(new Error('Impossible de charger la photo'));
          };
        });
        
        // Dessiner la photo dans la zone dédiée - plus grande et plus bas
        context.drawImage(photoImage, 40, 100, 120, 140);
      }

      // Configuration du texte
      context.font = '12px Arial';
      context.fillStyle = '#000000';

      // Dessiner les champs aux positions exactes
      context.fillText(studentData.dateOfBirth, 190, 210); // Date of Birth - décalé plus à droite
      context.fillText(studentData.studentId, 320, 210); // Student ID
      context.fillText(studentData.phone, 190, 260); // Phone - décalé plus à droite
      context.fillText(studentData.address, 320, 260); // Address

      // Créer le PDF avec les dimensions exactes
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'pt',
        format: [500, 300]
      });

      // Ajouter l'image du canvas au PDF
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 500, 300);

      // Sauvegarder le PDF
      pdf.save('carte-etudiant.pdf');
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      throw error;
    }
  }
}
