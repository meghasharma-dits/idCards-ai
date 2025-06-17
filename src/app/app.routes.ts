import { Routes } from '@angular/router';
import { redirectionGuard } from './core/guards/redirection.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
    },
    {
        path: '',
        loadChildren: () => import('./features/layout/layout.routes').then(m => m.LAYOUT_ROUTES),
        canActivate: [authGuard]
    },
    {
        path: 'auth',
        loadChildren: () => import('./authentication/authentication.routes').then(m => m.AUTH_ROUTES),
        canActivate: [redirectionGuard]
    },
    { path: '**', redirectTo: '' }

];
