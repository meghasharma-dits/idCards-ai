import { Component, EventEmitter, Input, NgZone, Output, ViewChild } from '@angular/core';
import { MessageService } from 'primeng/api';
import { PrimeNG } from 'primeng/config';
import { FileUpload } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ProgressBar } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [FileUpload, ButtonModule, BadgeModule, ProgressBar, ToastModule, CommonModule],
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [MessageService]
})
export class FileUploadComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @Input() acceptedFileTypes!: string;
  @Input() apiEndpoint: string = '';

  @Output() invoiceDetail = new EventEmitter<any>();
  files: any[] = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;
  processedInvoices: any;
  interval: any;

  constructor(private config: PrimeNG, 
    private messageService: MessageService, 
    private http: HttpClient, 
    private ngZone: NgZone) {}

  choose(event: any, callback: () => void) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: { size: any; }, removeFileCallback: (arg0: any, arg1: any) => void, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
  }

  onClearTemplatingUpload(clear: () => void) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    if (this.files.length > 0) {
      this.uploadEvent(() => {});
    }
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
  }

  uploadEvent(callback: () => void) {
    if (this.files.length > 0) {
      const formData = new FormData();
  
      this.files.forEach(file => {
        formData.append('files', file);
      });
  
      const headers = new HttpHeaders({
        'Accept': 'application/json',
      });
  
      this.toCalculateProgressBar();
  
      this.http.post(this.apiEndpoint, formData, {
        headers: headers,
        reportProgress: true,
        observe: 'events'
      }).subscribe({
        next: (event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
          } else if (event.type === HttpEventType.Response) {
            this.totalSizePercent = 100;
            clearInterval(this.interval);
            if (event.body.data) {
              this.invoiceDetail.emit(event.body.data);
            }
  
            this.messageService.add({
              severity: 'info',
              summary: event.body.message,
              detail: event.body.message,
              life: 5000
            });
  
            setTimeout(() => {
              this.totalSize = 0;
              this.totalSizePercent = 0;
              this.files = [];
              this.fileUpload.clear();
            }, 1000);
          }
        },
        error: (err) => {
          clearInterval(this.interval);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'File Upload Failed',
            life: 5000
          });
          this.totalSize = 0;
          this.totalSizePercent = 0;
          this.files = [];
        }
      });
    }
  }

  toCalculateProgressBar() {
    this.ngZone.runOutsideAngular(() => {
      this.interval = setInterval(() => {
        this.ngZone.run(() => {
          const increment = Math.floor(Math.random() * 10) + 1;
          this.totalSizePercent = Math.min(this.totalSizePercent + increment, 90);
          if (this.totalSizePercent >= 90) {
            clearInterval(this.interval);
          }
        });
      }, 1500);
    });
  }
  
  formatSize(bytes: number) {
    const k = 1024;
    const dm = 3;
    const sizes: any = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  ngOnDestroy() {
    clearInterval(this.interval);
  }
}
