import { Component } from '@angular/core';
import { TabsModule } from 'primeng/tabs';
import { InvoiceComponent } from '../invoice/invoice.component';
import { MailLinkingComponent } from '../mail-linking/mail-linking.component';
import { IdCardsComponent } from '../id-cards/id-cards.component';
// import { AiVoiceProcessingComponent } from "../ai-voice-processing/ai-voice-processing.component";

@Component({
  selector: 'app-upload-section',
  imports: [
    TabsModule,
    InvoiceComponent,
    MailLinkingComponent,
    IdCardsComponent,
    // AiVoiceProcessingComponent
],
  templateUrl: './upload-section.component.html',
  styleUrl: './upload-section.component.scss'
})
export class UploadSectionComponent {

}
