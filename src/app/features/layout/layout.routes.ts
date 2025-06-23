import { Route } from "@angular/router";
import { UploadSectionComponent } from "../upload-section/upload-section.component";

export const LAYOUT_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () => import('./layout.component').then(m => m.LayoutComponent), children: [
            {
                path: '',
                component: UploadSectionComponent
            }
        ]
    }
]