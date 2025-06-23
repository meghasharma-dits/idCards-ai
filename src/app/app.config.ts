import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthInterceptor } from './core/Interceptors/auth.interceptor';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),
  provideAnimationsAsync(),
    DynamicDialogConfig,
  provideHttpClient(
    withInterceptors([AuthInterceptor]),
  ),
  providePrimeNG({
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: false          // ✅ disable dark mode completely
      }
    }
  })
  ]
};
