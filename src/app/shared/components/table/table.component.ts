import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { saveAs } from 'file-saver';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ApiEndpoints } from '../../../core/configs/api-endpoints';
import { SpinnerService } from '../../../core/services/spinner.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [TableModule, CommonModule, ButtonModule],
  providers: [DialogService, DynamicDialogRef],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  
  @Input() tableData: any[] = []; 
  @Input() tableConfig: any = {}; 
  @Output() rowDetail = new EventEmitter<any>();
  
  scrollHeight = '550px';
  invoices: any[] = [];
  columns: any[] = [];
  envUrl = environment.apiUrl;
  downloadFileUrl: string = ApiEndpoints.fileDownload;
  isChildValues = ['igst', 'vat', 'sgst', 'cgst'];

  constructor(
    public config: DynamicDialogConfig,
    private http: HttpClient,
    private spinnerService: SpinnerService
  ) {
  }

  ngOnChanges() {
    this.createInvoiceData();
  }

  ngOnInit() {
   if(this.config.data?.tableData){
      this.tableConfig = this.config.data.tableConfig;
      this.createInvoiceData();
   }
  }

  ngAfterViewInit() {
    this.adjustTableHeight();
  }

  adjustTableHeight() {
    const containerHeight = this.tableContainer.nativeElement.offsetHeight;
    this.scrollHeight = `${containerHeight}px`;
  }

  createInvoiceData() {
    const dialogData = this.config.data?.tableData || [];
    const inputData = this.tableData || [];
    this.invoices = dialogData.length > 0 ? dialogData : inputData;
    if (this.invoices.length > 0) {
      const allKeys = new Set<string>();
      this.invoices.forEach(invoice => {
        Object.keys(invoice).forEach(key => {
          if (key !== 'items' && this.tableConfig.columns.includes(key)) {
            if (this.isChildValues.includes(key)) {
              const shouldInclude = this.invoices.some(invoice => {
                const taxDetails = invoice[key];
                return taxDetails?.rate !== null || taxDetails?.amount !== null;
              });
  
              if (shouldInclude) {
                allKeys.add(key);
              }
            } else {
              allKeys.add(key);
            }
          }
        });
      });
  
      this.columns = Array.from(allKeys).map(key => ({
        field: key,
        header: this.formatHeader(key)
      }));
  
      // Add the 'Actions' column
      if(this.tableConfig.columns.includes('action')) {
        this.columns.push({ field: 'action', header: 'Actions' });
      }
    }
  }

  formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  downloadFile(invoice: any) {
    const fileName = `${invoice.fileName || 'data'}.json`;
    const fileContent = JSON.stringify(invoice, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json;charset=utf-8' });
    saveAs(blob, fileName);
  }

  downloadOriginalFile(row: any) {
    this.spinnerService.show();
    this.http.get(`${this.tableConfig.fileDownloadUrl}?file_id=${row.file_id}`, {
      responseType: 'blob',
      observe: 'response'
    }) .pipe(
        finalize(() => this.spinnerService.hide())
      ).subscribe({
      next: (res: any) => {
        const contentDisposition = res.headers.get('Content-Disposition');
        let fileName = 'file';
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1]; 
          }
        }
        const blob = new Blob([res.body], { type: res.body.type });
        saveAs(blob, fileName);
      },
      error: (error) => {
        console.error('Download failed:', error);
      }
    });
  }
  
}