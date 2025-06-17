import { NgModule } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { CardModule } from 'primeng/card';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { RouterModule } from '@angular/router';
import { PopoverModule } from 'primeng/popover';
import { ProgressBarModule } from 'primeng/progressbar';

const primeNgModules = [
  CommonModule,
  ButtonModule,
  TableModule,
  ToolbarModule,
  InputTextModule,
  DropdownModule,
  FileUploadModule,
  ToastModule,
  ConfirmDialogModule,
  CardModule,
  MessageModule,
  TooltipModule,
  DialogModule,
  ReactiveFormsModule,
  SelectModule,
  FloatLabel,
  InputNumberModule,
  DatePickerModule,
  TextareaModule,
  ChipModule,
  FormsModule,
  IconFieldModule,
  InputIconModule,
  RouterModule,
  DatePipe,
  CurrencyPipe,
  ConfirmDialog,
  FileUpload,
  PopoverModule,
  ProgressBarModule]
@NgModule({
  declarations: [
  ],
  imports: primeNgModules,
  exports: primeNgModules
})
export class SharedUiModule { }