import { Route } from "@angular/router";

export const AUTH_ROUTES: Route[] = [
    {
        path: '', loadComponent: () => import('./authentication.component').then(m => m.AuthenticationComponent), children: [
            { path: '', redirectTo: 'login', pathMatch: 'full' },
            {
                path: 'login', loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
            }
        ]
    }
]