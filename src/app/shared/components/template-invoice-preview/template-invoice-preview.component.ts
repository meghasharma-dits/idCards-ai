import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-template-invoice-preview',
  imports: [CardModule, TableModule, TagModule, DatePipe, CurrencyPipe],
  providers: [CurrencyPipe],
  templateUrl: './template-invoice-preview.component.html',
  styleUrl: './template-invoice-preview.component.scss'
})
export class TemplateInvoicePreviewComponent {
invoice: any;


constructor( public config: DynamicDialogConfig){
  this.invoice = config.data
}
}
