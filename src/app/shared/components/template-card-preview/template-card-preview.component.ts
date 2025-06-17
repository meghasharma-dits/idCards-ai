import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-template-card-preview',
  imports: [CardModule, ButtonModule],
  templateUrl: './template-card-preview.component.html',
  styleUrl: './template-card-preview.component.scss'
})
export class TemplateCardPreviewComponent {

}
