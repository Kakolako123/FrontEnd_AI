import { Component } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {HttpClient, HttpClientModule, HttpHeaders} from "@angular/common/http";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-contact',
  imports:[ReactiveFormsModule,HttpClientModule,CommonModule],
  templateUrl: './contact.component.html',
  standalone:true,
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contactForm: FormGroup;
  message: string = '';  // Variable pour le message
  messageType: string = '';  // Variable pour le type du message (success ou error)

  constructor(private fb: FormBuilder, private http: HttpClient) {
    // Création du formulaire réactif avec des contrôles
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  submitContactUs() {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      const apiUrl = 'https://ensa37-dev-ed.develop.my.salesforce.com/services/apexrest/contactUs';  // Remplacez par l'URL de votre API Salesforce

      const headers = new HttpHeaders().set('Authorization', 'Bearer 00DWU00000A5RJZ!AQEAQPwfEZAxDkN7DCovQLJz8TJSA7rtpKULG314z4pm9zNr_0HA45bNZtb977t6kmgl4_nxyGhS7ReCsdmN4TLsX7KI41aT');  // Jeton d'accès Salesforce

      // Envoi de la requête POST avec les données du formulaire
      this.http.post(apiUrl, formData, { headers }).subscribe(
        (response) => {
          console.log('Message envoyé avec succès', response);
          this.message = 'Votre message a été envoyé avec succès!';
          this.messageType = 'success';  // Message de succès
          this.autoHideMessage();  // Fonction pour cacher le message après 3 secondes
        },
        (error) => {
          console.error('Erreur lors de l\'envoi du message', error);
          this.message = 'Une erreur s\'est produite lors de l\'envoi de votre message. Veuillez réessayer.';
          this.messageType = 'error';  // Message d'erreur
          this.autoHideMessage();  // Fonction pour cacher le message après 3 secondes
        }
      );
    } else {
      this.message = 'Le formulaire est invalide. Veuillez vérifier vos informations.';
      this.messageType = 'error';  // Message d'erreur
      this.autoHideMessage();  // Fonction pour cacher le message après 3 secondes
    }
  }

  // Fonction pour cacher le message après un délai
  private autoHideMessage() {
    setTimeout(() => {
      this.message = '';  // Effacer le message après 3 secondes
      this.messageType = '';
    }, 3000);
  }

}
