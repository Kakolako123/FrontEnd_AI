import { Component, Input, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  selector: 'app-id-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './id-card.component.html',
  styleUrls: ['./id-card.component.scss']
})
export class IdCardComponent {
  @Input() user!: SalesforceUser;

  constructor(private elementRef: ElementRef) {}

  getInitials(nom: string, prenom: string): string {
    const n = (nom || '').charAt(0);
    const p = (prenom || '').charAt(0);
    return (n + p).toUpperCase();
  }

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

  async exportToPDF() {
    // Récupérer l'élément de la carte
    const card = this.elementRef.nativeElement.querySelector('.id-card');
    
    try {
      // Créer le canvas
      const canvas = await html2canvas(card, {
        scale: 2,
        logging: false,
        useCORS: true
      });

      // Créer le PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Calculer les dimensions pour centrer la carte
      const imgWidth = 210; // Largeur A4 en mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xPosition = 0;
      const yPosition = (297 - imgHeight) / 2; // 297mm est la hauteur A4

      // Ajouter l'image au PDF
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', xPosition, yPosition, imgWidth, imgHeight);

      // Sauvegarder le PDF
      pdf.save(`carte-identite-${this.user.nom__c}-${this.user.prenom__c}.pdf`);
    } catch (error) {
      console.error('Erreur lors de l\'export PDF:', error);
    }
  }
}
