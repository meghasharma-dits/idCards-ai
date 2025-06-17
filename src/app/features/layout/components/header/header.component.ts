import { Component } from '@angular/core';
import { StorageKeys } from '../../../../core/enums/storage-keys.enum';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Router } from '@angular/router';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, Menu, Menubar, BadgeModule, AvatarModule, InputTextModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  username: string = sessionStorage.getItem(StorageKeys.user) ?? '';
  items: MenuItem[] | undefined;
  headerItems: MenuItem[] | undefined;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
    this.items = [
      {
        label: 'Accounts',
        icon: 'pi pi-users',
        command: () => {
          this.router.navigate(['/accounts']);
        }
      },
    ];

    this.headerItems = [
          {
            label: 'Home',
            icon: 'pi pi-home',
            routerLink: '/dashboard',
            routerLinkActiveOptions: { exact: true },
          },
          {
            label: 'Tools',
            icon: 'pi pi-cog',
            routerLink: '/',
            routerLinkActiveOptions: { exact: true },
          },
    ];
  }


  redirectToProdListing() {
      window.location.href = environment.redirectUrl;
  }
}
