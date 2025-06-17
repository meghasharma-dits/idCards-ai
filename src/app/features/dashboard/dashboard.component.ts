import { Component, signal } from '@angular/core';
import { AdvanceTableComponent } from '../../shared/components/advance-table/advance-table.component';
import { TableColumn, TableConfig } from '../../shared/components/advance-table/advance-table.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/configs/api-endpoints';
import { animationFrames, finalize, takeWhile } from 'rxjs';
import { SpinnerService } from '../../core/services/spinner.service';
import { saveAs } from 'file-saver';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TemplateInvoicePreviewComponent } from '../../shared/components/template-invoice-preview/template-invoice-preview.component';
import { FormControl } from '@angular/forms';
import { EventSourceMessage, fetchEventSource } from '@microsoft/fetch-event-source';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SharedUiModule } from '../../shared/shared-ui.module';
interface EmailInvoicesResponse {
  data: {
    last_fetched_email_datetime: any;
    total_amount_info: any; // Replace 'any' with a more specific type if known
    header_list: TableColumn[];
    email_invoices: any[]; // Replace 'any' with a proper invoice type
  };
  // Add other response properties if they exist (like status, message, etc.)
}

interface Name {
  name: string;
  code: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    AdvanceTableComponent,
    SharedUiModule,
  ],
  providers: [DialogService, DatePipe, CurrencyPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  accounts!: Name[];

  selectedName: Name | undefined;
  totalAmountInfo: any = {
    total_amount: 0,
    total_upcoming_amount: 0,
    total_due_amount: 0,
    total_overdue_amount: 0,
    total_paid: 0
  };
  ref: DynamicDialogRef | undefined;
  accountControl = new FormControl<any | null>(null);

  lastFetchedEmailDatetime: any;
  constructor(private http: HttpClient,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    public dialogService: DialogService
  ) {
  }

  ngOnInit() {
    this.getAccountDetails();
  }

  tableConfig: TableConfig = {
    columns: [
    ],
    syncMessage: '',
    toolbarConfig: {
      showToolbar: true,
      showAdd: false,
      showDelete: false,
      showEdit: false,
      showExport: true,
      showImport: false,
      showFilter: false,
      showSearch: true,
      showBulkAction: false,
      isMessageSection: false
    }
  }

  tableData: any[] = []

  getAccountDetails() {
    this.http.get(environment.apiUrl + ApiEndpoints.accountDetails).pipe(
      finalize(() => this.spinnerService.hide())
    )
      .subscribe({
        next: (res: any) => {
          this.accounts = res.data;
          if (res.data.length) {
            this.accountControl.setValue(res.data[0]);
            this.getEmailInvoices(res.data[0]._id);
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: `Failed to fetch`
          });
          console.error('Email failed:', error);
        }
      });
  }

  getEmailInvoices(emailId: string): void {
    this.spinnerService.show(); // Show spinner before making the request

    this.http.get<EmailInvoicesResponse>(`${environment.apiUrl}${ApiEndpoints.emailInvoices}`, {
      params: { email_id: emailId }
    }).pipe(
      finalize(() => {
        this.spinnerService.hide()
      })
    ).subscribe({
      next: (res) => {
        for (let val in res.data.total_amount_info) {
          this.animateValueChange(res.data.total_amount_info, val);
        }
        this.lastFetchedEmailDatetime = res.data.last_fetched_email_datetime
        this.tableConfig.toolbarConfig.isMessageSection = this.lastFetchedEmailDatetime ?  true : false;
        // Process columns
        this.tableConfig.columns = res.data.header_list.map((header: TableColumn) => ({
          ...header,
          header: this.formatHeader(header.header), // Format header display text
          sortable: true,
          minWidth: '12rem'
        }));

        // Add actions column
        this.tableConfig.columns.push({
          field: 'actions',
          header: 'Actions',
          sortable: false,
          minWidth: '5rem',
          isDelete: false,
          isEdit: false,
          canMarkPaid: true,
          canViewJSON: true,
          canViewTemplate: true,
          canViewOriginal: true,
          isBulkAction: false
        });

        this.tableData = res.data.email_invoices;
      },
      error: (error) => {
        console.error('Failed to load email invoices:', error);
        // Consider adding user notification here (e.g., toast message)
      }
    });
  }

  formatHeader(key: string): string {
    return key
      .replace(/_/g, ' ')          // Replace underscores with spaces
      .replace(/([a-z])([A-Z])/g, '$1 $2')  // Add space before capital letters
      .replace(/\b\w/g, char => char.toUpperCase());  // Capitalize first letters
  }

  accountChange(event: any) {
    this.getEmailInvoices(event.value._id);
  }

  actionClicked(event: any) {
    const { rowData, action } = event;
    switch (action) {
      case 'viewOriginal':
        this.viewOriginalFile(rowData);
        break;
      case 'viewJSON':
        this.downloadFile(rowData);
        break;
      case 'viewTemplate':
        this.ref = this.dialogService.open(TemplateInvoicePreviewComponent, {
          header: 'Template View', data: rowData,
          modal: true,
          maximizable: true,
          closable: true
        });
        break;
      case 'markAsPaid':
        this.changeInvoiceStatus(rowData);
        break;
      default:
        break;
    }
  }

  viewOriginalFile(row: any) {
    this.spinnerService.show();
    this.http.get(`${environment.apiUrl + ApiEndpoints.fileDownload}?file_id=${row.file_id}`, {
      responseType: 'blob',
      observe: 'response'
    }).pipe(
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

  downloadFile(invoice: any) {
    const fileName = `${invoice.fileName || 'data'}.json`;
    const fileContent = JSON.stringify(invoice, null, 2);
    const blob = new Blob([fileContent], { type: 'application/json;charset=utf-8' });
    saveAs(blob, fileName);
  }

  changeInvoiceStatus(rowData: any) {
    this.spinnerService.show();
    this.http.put(environment.apiUrl + ApiEndpoints.markAsPaid, { invoice_id: rowData.invoice_id, mark_as_paid: !rowData.mark_as_paid }).pipe(
      finalize(() => {
        this.spinnerService.hide();
      })
    )
      .subscribe({
        next: (res: any) => {
          this.getEmailInvoices(this.accountControl.value?._id || '');
        },
        error: (error) => {
          console.error('Email failed:', error);
        }
      });
  }

  async  syncInvoices() {
    const payload = {
      email_id: this.accountControl.value?._id,
      email: this.accountControl.value.email
    }
    const ctrl = new AbortController();
  
    const retryStrategy = {
      maxRetries: 3,
      retryDelay: (attempt: number) => Math.min(1000 * 2 ** attempt, 30000),
    };
  
    let retryCount = 0;
  
    await fetchEventSource(`${environment.apiUrl}${ApiEndpoints.syncInvoices}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa('admin:password123'),
      },
      body: JSON.stringify(payload),
      signal: ctrl.signal, 
  
      onmessage: (event) => {
        retryCount = 0; 
        const data = JSON.parse(event.data);
        if(data.status == 'error'){
              ctrl.abort(); 
              this.handleSyncError();
              return;
        } 
        this.handleSyncUpdate(event);
      },
  
      onerror: (err) => {
        if (retryCount++ >= retryStrategy.maxRetries) {
          ctrl.abort(); 
          this.handleSyncError(err);
        }
        throw err;
      },
  
      onclose: () => {
        if (!ctrl.signal.aborted) {
          console.log('Connection closed unexpectedly, reconnecting...');
        }
      },
  
      openWhenHidden: true, 
      fetch: (input, init) => {
        return fetch(input, {
          ...init,
          cache: 'no-store',
        });
      },
    });
  }
  
   handleSyncUpdate(event: EventSourceMessage) {
    this.tableConfig.toolbarConfig.isMessageSection = true;
    this.tableConfig.syncError = false;
    this.tableConfig.isSpinnerRunning = true;
    
    const data = JSON.parse(event.data);
    this.tableConfig.syncMessage = data.message;
    this.tableConfig.totalEmails = data?.total_emails;
  
    if (data.data) {
      this.tableData.unshift(data.data.email_invoices[0]);
    }
  
    if (data.status === 'complete' || data.message.includes('Sync completed')) {

      this.tableConfig.isSpinnerRunning = false;
      this.getEmailInvoices(this.accountControl.value?._id || '');
      // for (let val in data.total_amount_info) {
      //   this.animateValueChange(data.total_amount_info, val);
      // }
    }
  }
  
   handleSyncError(err?: any) {
    this.tableConfig.isSpinnerRunning = false;
    this.tableConfig.syncMessage = 'Sync failed. Please try again.';
    this.tableConfig.syncError = true;
    this.tableConfig.totalEmails = '';
    console.error('Final sync failure:', err);
  }

  animateValueChange(newValue: any, key: string) {
    const duration = 800;
    const start = this.totalAmountInfo[key] || 0;
    const end = newValue[key] || 0;

    if (start === end) return;

    const easeOutQuad = (t: number) => t * (2 - t);

    animationFrames().pipe(
      takeWhile(({ elapsed }) => elapsed <= duration),
      finalize(() => {
        this.totalAmountInfo[key] = end;
      })
    ).subscribe(({ elapsed }) => {
      const progress = easeOutQuad(Math.min(elapsed / duration, 1));
      this.totalAmountInfo[key] = Math.floor(start + (end - start) * progress);
    });
  }

}
