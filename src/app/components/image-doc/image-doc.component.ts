import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-image-doc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-doc.component.html',
  styleUrls: ['./image-doc.component.css']
})
export class ImageDocComponent {
  description: string = '';
  numberOfImages: number = 1;

  generateImages(): void {
    console.log('Generating Images with:', this.description, this.numberOfImages);
    this.simulateDownload();
  }

  simulateDownload(): void {
    console.log('Simulating Download...');
    const imageUrl = 'assets/placeholder.png';
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'image_example.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Download completed')

  }
  redirectToHome(): void {
    window.location.href = '/api-documentation';
  }
}
