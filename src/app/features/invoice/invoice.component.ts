import { Component, resource, ViewChild } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/configs/api-endpoints';
import { InvoiceData } from './invoice-models/invoice.model';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-invoice',
  imports: [
    TableComponent, 
    FileUploadComponent, 
    ButtonModule
  ],
  providers: [DialogService],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent {
  @ViewChild(TableComponent) tableRef!: TableComponent;
  ref!: DynamicDialogRef<TableComponent>;
  tableData: any[] = [];
  envUrl = environment.apiUrl;
  previousInvoice: string = ApiEndpoints.getInvoice
  uploadInvoice: string = ApiEndpoints.uploadInvoice
  tableConfig: any = {
    columns: ['invoice_id', 'invoice_date', 'due_date', 'igst', 'vat', 'sgst', 'cgst', 
      'total_amount', 'vendor_name', 'vendor_email', 'vendor_address', 
      'customer_name', 'customer_email', 'customer_address', 'action'],
    fileDownloadUrl: this.envUrl + ApiEndpoints.fileDownload
  };

  constructor(
    public dialogService: DialogService, 
    private http: HttpClient
  ) { }
  
  showPreviousFiles() {
    this.http.get(this.envUrl + this.previousInvoice).subscribe((res: any) => {
      this.ref = this.dialogService.open(TableComponent, {
        data: { tableData: res.data.invoice_details, tableConfig: this.tableConfig },
        header: 'Previous Invoices',
        width: '70%',
        contentStyle: { 
          height: '100%',
          overflow: 'auto' 
        },
        baseZIndex: 10000,
        styleClass: 'dialog',
        maximizable: true,
        closable: true,
        closeOnEscape: true,
        focusOnShow: false
      });
  
      this.ref.onChildComponentLoaded.subscribe((componentInstance: TableComponent) => {
        this.ref.onMaximize.subscribe((dialogConfig: any) => {
          if (componentInstance.adjustTableHeight && dialogConfig.maximized) {
            setTimeout(() => {
              componentInstance.adjustTableHeight();
            }, 100);
            } else {
              componentInstance.scrollHeight = '600px';
            }
          });
      });
    });
  }
  

  getInvoiceDetail(details: InvoiceData[]) {
    this.tableData = [];
    details.forEach((detail: any) => {
      detail.data.invoice_details.forEach((invoice: any) => {
        invoice.OriginalFileName = detail.filename;
        this.tableData.push(invoice);
      });
    });
    setTimeout(() => {
      this.tableData = [...this.tableData];
    }, 0);
  }
}
