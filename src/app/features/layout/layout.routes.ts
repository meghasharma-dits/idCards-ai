import { Route } from "@angular/router";
import { UploadSectionComponent } from "../upload-section/upload-section.component";
import { IntroductionComponent } from "../introduction/introduction.component";

export const LAYOUT_ROUTES: Route[] = [
    {
        path: '',
        loadComponent: () => import('./layout.component').then(m => m.LayoutComponent), children: [
            {
                path: '',
                component: IntroductionComponent
            },
            {
                path: 'idcards',
                component: UploadSectionComponent
            }
        ]
    }
]