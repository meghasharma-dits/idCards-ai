import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { ApiEndpoints } from '../../core/configs/api-endpoints';
import { environment } from '../../../environments/environment';
import { SpinnerService } from '../../core/services/spinner.service';
import { finalize } from 'rxjs';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';

@Component({
  selector: 'app-mail-linking',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    FloatLabel,
    ButtonModule,
    InputNumberModule,
    TableModule,
    Tag
    ],
  providers: [DatePipe],
  templateUrl: './mail-linking.component.html',
  styleUrl: './mail-linking.component.scss'
})
export class MailLinkingComponent {
  mailForm!: FormGroup;
  tableData: any[] = [];
  tableConfig: any = {
    columns: ['count_of_invoice', 'invoices_amount_due',],
    // fileDownloadUrl: this.envUrl + ApiEndpoints.fileDownload
  };
  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private datePipe: DatePipe,
    private spinnerService: SpinnerService
  ) { }

  ngOnInit(): void {
    this.mailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      server_hostname: ['', Validators.required],
      port: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      date_filter: ['7', Validators.required]
    });

  }

  onSubmit(): void {
    this.spinnerService.show();
    const date = new Date();
    date.setDate(date.getDate() - this.mailForm.value.date_filter);
    // this.mailForm.value.date_filter = `${this.mailForm.value.date_filter} Days`;
    const formattedDate = this.datePipe.transform(date, 'dd-MMM-yyyy');
    // this.mailForm.value.date_filter = formattedDate
    const payload = {
      ...this.mailForm.value,
      date_filter: formattedDate
    };
    if (this.mailForm.valid) {
      this.http.post(environment.apiUrl + ApiEndpoints.emailReader, payload)
  .pipe(
    finalize(() => this.spinnerService.hide())
  )
  .subscribe({
    next: (res: any) => {
      this.tableData = [res.data];
      this.loadData(res.data);
    },
    error: (error) => {
      console.error('Email failed:', error);
    }
  });
    }
  }

    // Your JSON data
    invoiceData: any[] = [];
    total_amount: number = 0;
    total_upcoming_due_amount: number = 0;
    total_due_amount: number = 0;
    total_overdue_amount: number = 0;
  
    loadData(data: any): void {
      // Combine all invoices into one array with type indicators
      this.invoiceData = [
        ...data.overdue_invoices.map((i: any) => ({ ...i, type: 'overdue' })),
        ...data.due_invoices.map((i: any) => ({ ...i, type: 'due' })),
        ...data.upcoming_invoices.map((i: any) => ({ ...i, type: 'upcoming' }))
      ];
  
      // Set totals
      this.total_amount = data.total_amount;
      this.total_upcoming_due_amount = data.total_upcoming_due_amount;
      this.total_due_amount = data.total_due_amount;
      this.total_overdue_amount = data.total_overdue_amount;
    }
  
    getInvoiceType(invoice: any): string {
      return invoice.type.charAt(0).toUpperCase() + invoice.type.slice(1);
    }
  
    getStatus(invoice: any): string {
      if (invoice.type === 'overdue') return 'Overdue';
      if (invoice.type === 'due') return 'Due';
      return 'Upcoming';
    }
  
    getSeverity(invoice: any): any {
      if (invoice.type === 'overdue') return 'danger';
      if (invoice.type === 'due') return 'warning';
      return 'info';
  }
}
