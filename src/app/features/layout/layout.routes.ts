import { Route } from "@angular/router";
import { UploadSectionComponent } from "../upload-section/upload-section.component";
import { DashboardComponent } from "../dashboard/dashboard.component";

export const LAYOUT_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () => import('./layout.component').then(m => m.LayoutComponent), children: [
            {
                path: '',
                component: UploadSectionComponent
            },
            {
                path: 'accounts', loadChildren: () => import('./../accounts/accounts.routes').then(m => m.ACCOUNT_ROUTES)
            },
            {
                path: 'dashboard', component: DashboardComponent
            },
        ]
    }
]