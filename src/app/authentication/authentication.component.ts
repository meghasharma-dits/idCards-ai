import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { StorageKeys } from '../core/enums/storage-keys.enum';

@Component({
  selector: 'app-authentication',
  imports: [CommonModule, RouterModule],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.scss'
})
export class AuthenticationComponent implements AfterViewInit{
  token: string | null = null;

  constructor(private router: Router, private route: ActivatedRoute) {}
  ngAfterViewInit(): void {
    setTimeout(() => this._openLoginModal(), 100);
  }

  private _openLoginModal() {
    this.route.queryParams.subscribe(async params => {
      this.token = params['token']; 
      if(this.token) {
        sessionStorage.setItem(StorageKeys.token, this.token);
        this.router.navigate(['/invoice']);
      }
    });
  }
}
