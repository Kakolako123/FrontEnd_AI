import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import axios, { AxiosRequestConfig, ResponseType } from 'axios';

@Component({
  selector: 'app-api-documentation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="api-doc-wrapper">
      <div class="sidebar">
        <div class="section-title">Get Random Users</div>
        <ul>
          <li (click)="loadExample('generateId')">Generate ID API</li>
          <li (click)="loadExample('randomUser')">Random User API</li>
          <li (click)="loadExample('jsonPlaceholder')">JSONPlaceholder API</li>
        </ul>

        <div class="section-title">Generate Images</div>
        <ul>
          <li (click)="loadExample('randomImage')">Random Image</li>
          <li (click)="loadExample('picsum')">Lorem Picsum</li>
          <li (click)="loadExample('unsplash')">Unsplash Random</li>
          <li (click)="loadExample('avatarImage')">Random Avatar</li>
        </ul>

        <li class="return-link" (click)="returnToCards()">Retour aux cartes</li>
      </div>
      
      <div class="main-content">
        <div class="content-section">
          <h3 class="text-center">
            <img class="einstein-image" src="assets/imgs/einshtein.png" alt="Einstein">
            Get All Random User
          </h3>
          
          <div class="code-block">
            <div class="request-section">
              <div class="method-select">
                <select [(ngModel)]="selectedMethod">
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="PATCH">PATCH</option>
                  <option value="DELETE">DELETE</option>
                </select>
              </div>
              
              <div class="url-input">
                <input type="text" [(ngModel)]="url" placeholder="Entrez l'URL de l'API">
              </div>

              <button (click)="sendRequest()" [disabled]="isLoading" class="send-btn">
                {{ isLoading ? 'Chargement...' : 'Envoyer' }}
              </button>
            </div>

            <div class="buttons-section">
              <button (click)="activateProxy()" class="activate-proxy">
                Activer CORS Proxy
              </button>
            </div>

            <div class="body-section" *ngIf="selectedMethod !== 'GET'">
              <textarea [(ngModel)]="requestBody" placeholder="Entrez le corps de la requête (JSON)"></textarea>
            </div>

            <div class="response-section" *ngIf="response">
              <pre>{{ response | json }}</pre>
            </div>
          </div>
        </div>

        <div class="content-section image-generation">
          <h3 class="text-center">
            Generate Custom Images
            <img class="boma-image" src="assets/imgs/boma.png" alt="Boma">
          </h3>
          
          <div class="code-block">
            <div class="request-section">
              <div class="prompt-input">
                <input type="text" [(ngModel)]="imagePrompt" placeholder="Décrivez l'image que vous souhaitez générer">
              </div>

              <div class="upsampling-select">
                <select [(ngModel)]="imageUpsampling">
                  <option value="1">1 Image</option>
                  <option value="3">3 Images</option>
                  <option value="5">5 Images</option>
                </select>
              </div>

              <button (click)="generateImage()" [disabled]="isGenerating" class="generate-btn">
                {{ isGenerating ? 'Génération en cours...' : 'Générer' }}
              </button>
            </div>

            <div class="status-section">
              <div *ngIf="isGenerating" class="loading-message">
                Veuillez patienter pendant la génération de votre image...
              </div>
              <div *ngIf="!isGenerating && imageGenerated" class="success-message">
                Image générée avec succès ! 
                <button (click)="downloadGeneratedImage()" class="download-btn">
                  Télécharger l'image
                </button>
              </div>
            </div>

            <div class="error-section" *ngIf="error">
              <div class="error-message">{{ error }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .api-doc-wrapper {
      display: flex;
      min-height: 100vh;
      background-color: #2D31FA;
      font-family: 'Inter', sans-serif;
      position: relative;
      overflow: hidden;
    }

    .content-section {
      background: white;
      border-radius: 20px;
      padding: 35px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      width: 90%;
      max-width: 1000px;
      position: relative;
      left: 50%;
      transform: translateX(-50%);
      margin: 0;
      overflow: visible;
    }

    .content-section h3 {
      color: #2D31FA;
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
      font-weight: 600;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 20px;
    }

    .einstein-image, .boma-image {
      position: static;
      width: 120px;
      height: auto;
      opacity: 0.95;
      pointer-events: none;
      margin-left: 15px;
      transition: transform 0.3s ease;
    }

    .einstein-image:hover, .boma-image:hover {
      transform: scale(1.1);
    }

    .main-content {
      flex: 1;
      margin-left: 280px;
      background: #2D31FA;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 15px;
      position: relative;
      z-index: 2;
      gap: 15px;
      overflow: visible;
    }

    .text-center {
      text-align: center;
    }

    .sidebar {
      width: 280px;
      padding: 25px;
      background: white;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      color: #2D31FA;
      overflow-y: auto;
      z-index: 100;
    }

    .section-title {
      color: #2D31FA;
      font-size: 1.4rem;
      font-weight: 600;
      padding: 15px;
      margin-top: 30px;
      margin-bottom: 15px;
      text-align: center;
      border-bottom: 2px solid rgba(45, 49, 250, 0.2);
    }

    .section-title:first-child {
      margin-top: 0;
    }

    .sidebar ul {
      list-style: none;
      padding: 0;
      margin: 0 0 20px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .sidebar li {
      padding: 12px 18px;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.3s ease;
      font-weight: 500;
      position: relative;
      background: rgba(45, 49, 250, 0.1);
      color: #2D31FA;
      text-align: center;
    }

    .sidebar li:hover {
      background: rgba(45, 49, 250, 0.2);
      transform: translateX(5px);
    }

    .sidebar li.active {
      background: #2D31FA;
      color: white;
    }

    .sidebar li.return-link {
      margin-top: 30px;
      padding: 12px 18px;
      background: #2D31FA;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s ease;
      text-align: center;
      list-style: none;
    }

    .sidebar li.return-link:hover {
      background: #2428c8;
      transform: translateX(5px);
    }

    .content-section h3 {
      color: #2D31FA;
      text-align: center;
      margin-bottom: 30px;
      font-size: 28px;
      font-weight: 600;
    }

    @media (max-width: 1200px) {
      .content-section {
        width: 95%;
      }
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 30px 15px;
      }
      .content-section {
        width: 98%;
        padding: 30px;
      }
    }

    .code-block {
      background: rgba(45, 49, 250, 0.05);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
      border: 1px solid rgba(45, 49, 250, 0.1);
    }

    .request-section {
      display: flex;
      gap: 30px;
      margin-bottom: 20px;
      justify-content: center;
      align-items: center;
    }

    .method-select select {
      padding: 8px 12px;
      border: 1px solid #2D31FA;
      border-radius: 6px;
      background: white;
      color: #2D31FA;
      font-weight: 500;
      min-width: 120px;
    }

    .url-input {
      flex-grow: 1;
      margin-right: 15px;
    }

    .url-input input {
      width: 100%;
      padding: 10px 15px;
      border: 1px solid #2D31FA;
      border-radius: 6px;
      font-size: 14px;
      color: #2D31FA;
      background: white;
    }

    .send-btn {
      background-color: #2D31FA;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      min-width: 120px;
      height: 40px;
    }

    .send-btn:hover {
      background-color: #2428c8;
      transform: translateY(-2px);
    }

    .send-btn:disabled {
      background-color: rgba(45, 49, 250, 0.5);
      cursor: not-allowed;
      transform: none;
    }

    .buttons-section {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }

    .activate-proxy {
      background: #2D31FA;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;
      min-width: 120px;
    }

    .activate-proxy:hover {
      background: #2428c8;
      transform: translateY(-2px);
    }

    .body-section {
      margin-top: 20px;
    }

    .body-section textarea {
      width: 100%;
      height: 150px;
      padding: 12px;
      border: 1px solid #2D31FA;
      border-radius: 6px;
      font-family: 'Courier New', Courier, monospace;
      color: #2D31FA;
      background: white;
    }

    .response-section {
      margin-top: 20px;
      background: white;
      border-radius: 8px;
      border: 1px solid rgba(45, 49, 250, 0.1);
    }

    pre {
      background: white;
      padding: 15px;
      border-radius: 6px;
      overflow-x: auto;
      color: #2D31FA;
      margin: 0;
    }

    .image-generation {
      margin-top: 30px;
      padding: 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .prompt-input {
      flex: 1;
      margin-right: 10px;
    }

    .prompt-input input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .upsampling-select select {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      background: white;
    }

    .generate-btn {
      padding: 10px 20px;
      background: #2D31FA;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .generate-btn:hover {
      background: #2428c8;
    }

    .generate-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    .error-message {
      color: #dc3545;
      padding: 10px;
      margin: 10px 0;
      background-color: #f8d7da;
      border: 1px solid #f5c6cb;
      border-radius: 4px;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    .content-section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 100%;
    }

    .image-generation {
      margin-top: 30px;
    }

    .error-section {
      margin-top: 15px;
    }

    .error-message {
      color: #dc3545;
      padding: 10px;
      background-color: rgba(220, 53, 69, 0.1);
      border-radius: 4px;
      margin: 10px 0;
    }

    .status-section {
      margin: 20px 0;
      text-align: center;
    }

    .loading-message {
      color: #2D31FA;
      padding: 15px;
      background-color: rgba(45, 49, 250, 0.1);
      border-radius: 4px;
      margin: 10px 0;
    }

    .success-message {
      color: #28a745;
      padding: 15px;
      background-color: rgba(40, 167, 69, 0.1);
      border-radius: 4px;
      margin: 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }

    .download-btn {
      padding: 8px 16px;
      background: #2D31FA;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .download-btn:hover {
      background: #2428c8;
    }
  `]
})
export class ApiDocumentationComponent {
  selectedMethod = 'GET';
  url = '';
  requestBody = '';
  response: any = null;
  error: string = '';
  responseStatus: string = '';
  isLoading = false;
  useProxy = true;

  // Image generation properties
  imagePrompt: string = '';
  imageUpsampling: string = '1';
  isGenerating: boolean = false;
  generatedImages: string[] = [];
  imageGenerated: boolean = false;

  private apiExamples = {
    generateId: {
      method: 'GET',
      url: 'https://fraijaayoubmed.pythonanywhere.com/generate_id/1'
    },
    randomUser: {
      method: 'GET',
      url: 'https://randomuser.me/api/'
    },
    jsonPlaceholder: {
      method: 'GET',
      url: 'https://jsonplaceholder.typicode.com/users'
    },
    randomImage: {
      method: 'GET',
      url: 'https://source.unsplash.com/random'
    },
    picsum: {
      method: 'GET',
      url: 'https://picsum.photos/400/300'
    },
    unsplash: {
      method: 'GET',
      url: 'https://api.unsplash.com/photos/random'
    },
    avatarImage: {
      method: 'GET',
      url: 'https://avatars.dicebear.com/api/human/random.svg'
    }
  };

  constructor(private router: Router) {}

  loadExample(exampleKey: keyof typeof this.apiExamples) {
    const example = this.apiExamples[exampleKey];
    this.selectedMethod = example.method;
    this.url = example.url;
    this.requestBody = '';
    this.response = null;
    this.error = '';
    this.responseStatus = '';
  }

  activateProxy() {
    window.open('https://cors-anywhere.herokuapp.com/corsdemo', '_blank');
  }

  returnToCards() {
    this.router.navigate(['/side-bar']);
  }

  async sendRequest() {
    this.isLoading = true;
    this.response = null;
    this.error = '';
    this.responseStatus = '';

    try {
      const targetUrl = this.url.startsWith('http') ? this.url : `https://${this.url}`;
      const finalUrl = this.useProxy ? `https://cors-anywhere.herokuapp.com/${targetUrl}` : targetUrl;
      
      const config = {
        method: this.selectedMethod,
        url: finalUrl,
        headers: this.useProxy ? {
          'Origin': window.location.origin,
          'X-Requested-With': 'XMLHttpRequest'
        } : {},
        data: this.selectedMethod !== 'GET' ? JSON.parse(this.requestBody || '{}') : undefined
      };

      console.log('Sending request with config:', config);

      const response = await axios(config);
      this.response = response.data;
      this.responseStatus = `${response.status} ${response.statusText}`;
    } catch (error: any) {
      console.error('Erreur complète:', error);
      this.responseStatus = `Erreur: ${error.response?.status || 'Unknown'} ${error.response?.statusText || ''}`;
      
      if (error.message.includes('cors-anywhere')) {
        this.error = 'Erreur CORS: Veuillez d\'abord activer le proxy CORS en visitant https://cors-anywhere.herokuapp.com/corsdemo';
      } else if (error.message.includes('Network Error') && !this.useProxy) {
        this.error = 'Erreur CORS: Essayez d\'activer le proxy CORS pour résoudre ce problème';
      } else {
        this.error = error.response?.data?.message || error.message || 'Une erreur est survenue';
      }
    } finally {
      this.isLoading = false;
    }
  }

  async generateImage() {
    this.isGenerating = true;
    this.error = '';
    this.generatedImages = [];
    this.imageGenerated = false;
    this.response = null;

    try {
      const targetUrl = 'https://fastapi-flux-v37k.onrender.com/generate-image';
      const finalUrl = this.useProxy ? `https://cors-anywhere.herokuapp.com/${targetUrl}` : targetUrl;

      // Limiter la taille du prompt
      const truncatedPrompt = this.imagePrompt.slice(0, 500); // Limiter à 500 caractères

      const config: AxiosRequestConfig = {
        method: 'POST',
        url: finalUrl,
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
          'Accept': 'application/json, image/*'
        },
        data: {
          prompt: truncatedPrompt,
          prompt_upsampling: parseInt(this.imageUpsampling)
        },
        responseType: 'arraybuffer' as ResponseType,
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        decompress: true,
        // Ajouter la gestion des chunks pour les grandes images
        onDownloadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || progressEvent.loaded));
          console.log(`Download Progress: ${percentCompleted}%`);
        }
      };

      console.log('Sending image generation request:', {
        ...config,
        data: { ...config.data, prompt: `${truncatedPrompt.slice(0, 50)}...` } // Log only first 50 chars
      });

      const response = await axios(config);
      
      if (response.data) {
        // Vérifier la taille de la réponse
        const sizeInMB = response.data.byteLength / (1024 * 1024);
        console.log(`Response size: ${sizeInMB.toFixed(2)} MB`);

        if (sizeInMB > 10) { // Si plus de 10MB
          this.error = 'L\'image générée est trop grande. Veuillez réessayer avec un prompt plus simple.';
          return;
        }

        // Convertir les données binaires en base64 de manière optimisée
        const base64 = await this.arrayBufferToBase64Async(response.data);
        this.generatedImages = [base64];
        this.imageGenerated = true;
      }
    } catch (error: any) {
      console.error('Erreur de génération d\'image:', error);
      
      if (error.message.includes('431')) {
        this.error = 'Le prompt est trop long. Veuillez le raccourcir et réessayer.';
      } else if (error.message.includes('cors-anywhere')) {
        this.error = 'Erreur CORS: Veuillez d\'abord activer le proxy CORS en visitant https://cors-anywhere.herokuapp.com/corsdemo';
      } else if (error.message.includes('Network Error') && !this.useProxy) {
        this.error = 'Erreur CORS: Essayez d\'activer le proxy CORS pour résoudre ce problème';
      } else {
        this.error = error.response?.data?.message || error.message || 'Erreur lors de la génération de l\'image';
      }
    } finally {
      this.isGenerating = false;
    }
  }

  // Version asynchrone et optimisée de la conversion ArrayBuffer en base64
  async arrayBufferToBase64Async(buffer: ArrayBuffer): Promise<string> {
    return new Promise((resolve) => {
      const blob = new Blob([buffer], { type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]); // Enlever le préfixe "data:image/jpeg;base64,"
      };
      reader.readAsDataURL(blob);
    });
  }

  // Optimiser la fonction de téléchargement
  downloadImage(base64Data: string, index: number): void {
    try {
      const link = document.createElement('a');
      link.href = 'data:image/jpeg;base64,' + base64Data;
      link.download = `generated-image-${index + 1}.jpg`;
      
      // Utiliser URL.createObjectURL pour une meilleure performance avec les grandes images
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });
      const blobUrl = URL.createObjectURL(blob);
      
      link.href = blobUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Libérer la mémoire
      setTimeout(() => {
        URL.revokeObjectURL(blobUrl);
      }, 100);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      this.error = 'Erreur lors du téléchargement de l\'image';
    }
  }

  downloadGeneratedImage(): void {
    this.downloadImage(this.generatedImages[0], 0);
  }
}
