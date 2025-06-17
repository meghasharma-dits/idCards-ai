import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { TextareaModule } from 'primeng/textarea';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FileUpload } from 'primeng/fileupload';
import { FormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { TableConfig } from './advance-table.model';
import { PopoverModule } from 'primeng/popover';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { ProgressBarModule } from 'primeng/progressbar';
import { LineBreakAfterSubjectPipe } from '../../../features/dashboard/pipes/line-break-after-subject.pipe';
interface ExportColumn {
  title: string;
  dataKey: string;
}

@Component({
  selector: 'app-advance-table',
  imports: [
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    InputNumberModule,
    TableModule,
    DatePickerModule,
    ToastModule,
    ToolbarModule,
    ConfirmDialog,
    TextareaModule,
    CommonModule,
    FileUpload,
    DropdownModule,
    FormsModule,
    IconFieldModule,
    InputIconModule,
    PopoverModule,
    CardModule,
    MessageModule,
    ProgressBarModule,
    LineBreakAfterSubjectPipe
  ],
  providers: [MessageService, ConfirmationService, DatePipe, CurrencyPipe],
  templateUrl: './advance-table.component.html',
  styleUrl: './advance-table.component.scss'
})
export class AdvanceTableComponent {
  @ViewChild('dt') dt!: Table;

  @Input() tableData: any[] = [];
  @Input() tableConfig!: TableConfig;

  @Output() isAddRow = new EventEmitter<boolean>();
  @Output() actionClicked = new EventEmitter<{ rowData: any; action: string }>();


  selectedAccount!: any[] | null;
  statuses!: any[];

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cd: ChangeDetectorRef
  ) { }

  exportColumns!: ExportColumn[];
  exportCSV(e: any) {
    this.dt.exportCSV();
  }

  loadDemoData() {

    this.exportColumns = this.tableConfig.columns.map((col) => ({ title: col.header, dataKey: col.field }));
  }

  getFilterFields(): string[] {
    return this.tableConfig.columns
      .filter((col) => col.field !== 'image' && col.field !== 'actions')
      .map((col) => col.field);
  }

  AddNewRow() {
    this.isAddRow.emit(false);
  }

  deleteSelectedProducts() {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected products?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Products Deleted',
          life: 3000
        });
      }
    });
  }

  hideDialog() {
  }

  deleteProduct(product: any) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete ' + product.name + '?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Product Deleted',
          life: 3000
        });
      }
    });
  }

  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.tableData.length; i++) {
      if (this.tableData[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

  createId(): string {
    let id = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  actionClick(rowData: any , action: string) {
   this.actionClicked.emit({ rowData, action });
  }

  rowStyle(row: any) {
    if (row.mark_as_paid) {
        return { backgroundColor: '#dcfce7'  };
    }
    return
}
}
