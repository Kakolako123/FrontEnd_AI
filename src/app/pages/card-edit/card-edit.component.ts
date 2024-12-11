import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-edit',
  templateUrl: './card-edit.component.html',
  styleUrls: ['./card-edit.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CardEditComponent implements OnInit {
  @ViewChild('templateContainer') templateContainer!: ElementRef;
  selectedCardId: number = 1;
  templates = [
    {
      id: 1,
      name: 'Carte Simple',
      canvaUrl: 'https://www.canva.com/design/DAGYEZL-fWY/35fkn-h4hDtBs7AK1thvrw/edit',
      frontImage: 'assets/imgs/c1.1.PNG',
      backImage: 'assets/imgs/c1.2.PNG'
    },
    {
      id: 2,
      name: 'Carte Minimaliste',
      canvaUrl: 'https://www.canva.com/templates/EAFUJ5oTDmA-blue-and-white-minimalist-high-school-id-card/',
      frontImage: 'assets/imgs/c2.1.PNG',
      backImage: 'assets/imgs/c2.2.PNG'
    },
    {
      id: 3,
      name: 'Carte Moderne',
      canvaUrl: 'https://www.canva.com/design/DAGYEt0Ueyk/7ARKEW5FKowKyKHwBexCXA/edit',
      frontImage: 'assets/imgs/c3.1.PNG',
      backImage: 'assets/imgs/c3.2.PNG'
    },
    {
      id: 4,
      name: 'Carte Sport',
      canvaUrl: 'https://www.canva.com/design/DAGYEreZ_NI/IRqiCKW9NFcFs28HUGN9xQ/edit',
      frontImage: 'assets/imgs/c4.1.PNG',
      backImage: 'assets/imgs/c4.2.PNG'
    },
    {
      id: 5,
      name: 'Carte Pro',
      canvaUrl: 'https://www.canva.com/design/DAGYEoF1bG0/-LjIxkxDxwcCsfpT0afObw/edit',
      frontImage: 'assets/imgs/c5.1.PNG',
      backImage: 'assets/imgs/c5.2.PNG'
    },
    {
      id: 6,
      name: 'Carte Élégante',
      canvaUrl: 'https://www.canva.com/design/DAGYEp51KyQ/ZUyyNw8_YQI0-zN1U5WNjw/edit',
      frontImage: 'assets/imgs/c6.1.PNG',
      backImage: 'assets/imgs/c6.2.PNG'
    },
    {
      id: 7,
      name: 'Carte Premium',
      canvaUrl: 'https://www.canva.com/design/DAGYEjcInj0/EK9en9T1TvWOlwF3z0MwIw/edit',
      frontImage: 'assets/imgs/c7.1.PNG',
      backImage: 'assets/imgs/c7.2.PNG'
    },
    {
      id: 8,
      name: 'Carte Design',
      canvaUrl: 'https://www.canva.com/design/DAGYEr3QlZE/0V-2Y8ZzJmoYIQhMILAKsQ/edit',
      frontImage: 'assets/imgs/c8.1.PNG',
      backImage: 'assets/imgs/c8.2.PNG'
    },
    {
      id: 10,
      name: 'Carte Créative',
      canvaUrl: 'https://www.canva.com/design/DAGYEtGN8dU/B2nsv-GkpHwWGkLMJDbIpw/edit',
      frontImage: 'assets/imgs/c10.1.PNG',
      backImage: 'assets/imgs/c10.2.PNG'
    },
    {
      id: 11,
      name: 'Carte Dynamique',
      canvaUrl: 'https://www.canva.com/templates/EAFRAJq8QIs-blue-and-red-fetcher-school-id-card/',
      frontImage: 'assets/imgs/c11.1.PNG',
      backImage: 'assets/imgs/c11.2.PNG'
    },
    {
      id: 12,
      name: 'Carte Innovation',
      canvaUrl: 'https://www.canva.com/templates/EAFXh-vwR2c-blue-and-orange-modern-highschool-id-card/',
      frontImage: 'assets/imgs/c12.1.PNG',
      backImage: 'assets/imgs/c12.2.PNG'
    }
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const cardId = parseInt(params['id'], 10);
      if (cardId) {
        this.selectedCardId = cardId;
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.selectPreviousTemplate();
    } else if (event.key === 'ArrowRight') {
      this.selectNextTemplate();
    }
  }

  selectTemplate(templateId: number) {
    this.selectedCardId = templateId;
  }

  scrollLeft() {
    const container = this.templateContainer.nativeElement;
    const scrollAmount = container.clientWidth;
    container.scrollTo({
      left: container.scrollLeft - scrollAmount,
      behavior: 'smooth'
    });
  }

  scrollRight() {
    const container = this.templateContainer.nativeElement;
    const scrollAmount = container.clientWidth;
    container.scrollTo({
      left: container.scrollLeft + scrollAmount,
      behavior: 'smooth'
    });
  }

  selectPreviousTemplate() {
    const currentIndex = this.templates.findIndex(t => t.id === this.selectedCardId);
    if (currentIndex > 0) {
      this.selectTemplate(this.templates[currentIndex - 1].id);
    }
  }

  selectNextTemplate() {
    const currentIndex = this.templates.findIndex(t => t.id === this.selectedCardId);
    if (currentIndex < this.templates.length - 1) {
      this.selectTemplate(this.templates[currentIndex + 1].id);
    }
  }

  editInCanva() {
    const template = this.templates.find(t => t.id === this.selectedCardId);
    if (template) {
      window.open(template.canvaUrl, '_blank');
    }
  }

  cancel() {
    this.router.navigate(['/side-bar']);
  }

  getActiveTemplate() {
    return this.templates.find(template => template.id === this.selectedCardId) || this.templates[0];
  }
}
