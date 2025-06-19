import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorageKeys } from '../core/enums/storage-keys.enum';
import { environment } from '../../environments/environment';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule, RouterModule, ToastModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent implements AfterViewInit {
  token: string | null = null;
  redirectUrl: string = environment.redirectUrl;

  constructor(private router: Router, private route: ActivatedRoute, private messageService: MessageService) { }
  ngAfterViewInit(): void {
    setTimeout(() => this._openLoginModal(), 100);
  }

  private _openLoginModal() {
    this.route.queryParams.subscribe(async params => {
      this.token = params['token'];
      if (this.token) {
        sessionStorage.setItem(StorageKeys.token, this.token);
        this.router.navigate(['/invoice']);
      } else {
        this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Token not found. Redirecting to Product Listing.', life: 3000 });
        setTimeout(() => {
          this.redirectToListingPage();
        }, 3000);
      }
    });
  }

  redirectToListingPage() {
    sessionStorage.clear();
    window.location.href = this.redirectUrl; //actual url of the application
  }
}
