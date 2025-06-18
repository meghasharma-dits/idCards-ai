import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { IdCardsComponent } from '../id-cards/id-cards.component';

@Component({
  selector: 'app-upload-section',
  imports: [
    TabsModule,
    IdCardsComponent,
],
  templateUrl: './upload-section.component.html',
  styleUrl: './upload-section.component.scss'
})
export class UploadSectionComponent {

}
