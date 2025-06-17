import { Route } from "@angular/router";

export const INVOICE_ROUTES: Route[] = [
    {
        path: '', 
        loadComponent: () => import('./invoice.component').then(m => m.InvoiceComponent),
    }
]