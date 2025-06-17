import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/configs/api-endpoints';
import { SpinnerService } from '../../core/services/spinner.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AdvanceTableComponent } from "../../shared/components/advance-table/advance-table.component";
import { TableConfig } from '../../shared/components/advance-table/advance-table.model';
import { NumberChipsComponent } from "../../shared/components/number-chips/number-chips.component";
import { SharedUiModule } from '../../shared/shared-ui.module';
@Component({
  selector: 'app-accounts',
  imports: [
    AdvanceTableComponent,
    NumberChipsComponent,
    SharedUiModule
  ],
  providers: [MessageService, ConfirmationService, DatePipe],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent {
  @ViewChild(AdvanceTableComponent) dt!: AdvanceTableComponent;
  @ViewChild(NumberChipsComponent) chip!: NumberChipsComponent;

  mailForm!: FormGroup;
  tableData: any[] = [];
  numberChips: number[] = [];

  productDialog: boolean = false;

  selectedAccount!: any[] | null;

  isTableView: boolean = true;

  statuses!: any[];

  tableConfig: TableConfig = {
    columns: [
      {
        field: 'name', header: 'Account Name', customExportHeader: 'Product Code', sortable: false, minWidth: '12rem'
      },
      { field: 'email', header: 'Email', sortable: false, minWidth: '12rem' },
      { field: 'last_fetched_email_datetime', header: 'Last sync', sortable: false, minWidth: '12rem', type: 'date' },
      { field: 'actions', header: 'Actions', isDelete: true, isEdit: true, sortable: false, minWidth: '5rem' }],
    toolbarConfig: {
      showToolbar: true,
      showAdd: true,
      showDelete: false,
      showEdit: true,
      showExport: true,
      showImport: false,
      showFilter: true,
      showSearch: true,
      showBulkAction: false
    }
  };
  isEditable: string = '';

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private datePipe: DatePipe,
    private spinnerService: SpinnerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.mailForm = this.fb.group({
      name: ['', [Validators.required, Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      server_hostname: ['', Validators.required],
      port: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      start_date: ['']
    });
    this.getAccountDetails();
  }

  onSubmit(): void {
    this.spinnerService.show();
    const formattedDate = this.datePipe.transform(this.mailForm.value.start_date, 'dd-MMM-yyyy');
    let payload = {
      ...this.mailForm.value,
      start_date: formattedDate,
      due_format: this.chip.numberChips.join(','),
    };
    const lastFetchedEmailDatetime = this.mailForm.value.start_date;
    const date = new Date(lastFetchedEmailDatetime);
    const utcDate = date.toISOString();
    const apiCall$ = this.isEditable
      ? this.http.put(
          `${environment.apiUrl}${ApiEndpoints.editEmail}`,
          { ...payload, email_id: this.isEditable, last_fetched_email_datetime: utcDate }
        )
      : this.http.post(
          `${environment.apiUrl}${ApiEndpoints.addEmail}`,
          payload
        );
  
    apiCall$.pipe(
      finalize(() => this.spinnerService.hide())
    ).subscribe({
      next: (res: any) => {
        const action = this.isEditable ? 'updated' : 'added';
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Account ${action} successfully`
        });
        
        this.handleSuccessResponse(res);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
        });
      }
    });
  }
  
  private handleSuccessResponse(res: any): void {
    this.tableData = [res.data];
    this.isTableView = true;
    this.getAccountDetails();
    this.mailForm.reset();
    this.isEditable = ''; // Reset edit mode after successful update
  }

  getAccountDetails() {
    this.http.get(environment.apiUrl + ApiEndpoints.accountDetails).pipe(
      finalize(() => this.spinnerService.hide())
    )
      .subscribe({
        next: (res: any) => {
          this.tableData = res.data;
        },
        error: (error) => {
          console.error('Email failed:', error);
        }
      });
  }

  // table setup
  isAddRow(isAdd: boolean) {
    this.isTableView = isAdd;
    this.selectedAccount = null;
    this.mailForm.reset();
  }

  actionClicked(event: { rowData: any; action: string }) {
    const { rowData, action } = event;
    switch (action) {
      case 'edit':
        this.mailForm.patchValue(rowData);
        this.mailForm.patchValue({
          start_date: new Date(rowData.last_fetched_email_datetime)
        });
        
        this.numberChips = rowData.due_format;
        this.isTableView = false;
        this.isEditable = rowData._id;
        break;
      case 'delete':
        this.confirmationService.confirm({
          message: 'Are you sure you want to delete this record?',
          accept: () => {
            this.spinnerService.show();
            this.http.delete(`${environment.apiUrl}${ApiEndpoints.deleteEmail}`, {
            params: { email_id: rowData._id } }).pipe(
              finalize(() => this.spinnerService.hide())
            )
              .subscribe({
                next: (res: any) => {
                  this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Record deleted successfully' });
                  this.getAccountDetails();
                },
                error: (error) => {
                  console.error('Email failed:', error);
                }
              });
          }
        });
        break;
      default:
        break;
    }
  }
}
