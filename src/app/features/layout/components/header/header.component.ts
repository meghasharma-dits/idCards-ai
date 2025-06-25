import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';

@Component({
  selector: 'app-header',
  imports: [ButtonModule, BadgeModule, AvatarModule, InputTextModule, CommonModule, Menubar],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  headerItems: MenuItem[] | undefined;

  ngOnInit() {

    this.headerItems = [
      {
        label: 'Introduction',
        icon: 'pi pi-info-circle',
        routerLink: '/introduction',
        routerLinkActiveOptions: { exact: true },
      },
      {
        label: 'ID Card',
        icon: 'pi pi-id-card',
        routerLink: '/idcards',
        routerLinkActiveOptions: { exact: true },
      }
    ]

  }

  redirectToProdListing() {
      window.location.href = environment.redirectUrl;
  }
}
