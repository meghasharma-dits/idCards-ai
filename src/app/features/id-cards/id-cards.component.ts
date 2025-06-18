import { Component, ViewChild } from '@angular/core';
import { TableComponent } from '../../shared/components/table/table.component';
import { FileUploadComponent } from '../../shared/components/file-upload/file-upload.component';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../../core/configs/api-endpoints';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-id-cards',
  imports: [
    TableComponent,
    FileUploadComponent,
    ButtonModule
  ],
  providers: [DialogService],
  templateUrl: './id-cards.component.html',
  styleUrl: './id-cards.component.scss'
})
export class IdCardsComponent {
  @ViewChild(TableComponent) tableRef!: TableComponent;
  ref!: DynamicDialogRef<TableComponent>;
  tableData: any[] = [];
  envUrl = environment.apiUrl;
  previousIdCardsURL: string = ApiEndpoints.previousIdDetails
  uploadIdCardURL: string = ApiEndpoints.idExtraction
  tableConfig: any = {
    columns: ["id_type", "id_number", "name", "dob", "issue_date", "expiry_date", "address", "organization", 'action'],
    fileDownloadUrl: this.envUrl + ApiEndpoints.IdDownload
  };
  acceptedFileTypes ='.jpeg,.jpg,.png,.webp';


  constructor(
    public dialogService: DialogService, 
    private http: HttpClient) { }

  showPreviousFiles() {
    this.http.get(this.envUrl + this.previousIdCardsURL).subscribe((res: any) => {
      this.ref = this.dialogService.open(TableComponent, {
        data: { tableData: res.data.id_details, tableConfig: this.tableConfig },
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


  getIdCardDetail(details: any[]) {
    this.tableData = [];
    details.forEach((detail: any) => {
      detail.data.id_details.forEach((idCard: any) => {
        idCard.OriginalFileName = detail.filename;
        this.tableData.push(idCard);
      });
    });
    setTimeout(() => {
      this.tableData = [...this.tableData];
    }, 0);
  }
}
