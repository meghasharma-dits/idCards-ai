import { Route } from "@angular/router";

export const ACCOUNT_ROUTES: Route[] = [
    {
        path: '', 
        loadComponent: () => import('./accounts.component').then(m => m.AccountsComponent),
    }
]