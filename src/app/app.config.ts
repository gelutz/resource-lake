import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    // NOTE: Clerk + Convex initializer removed for this UI prototype.
    // Restore from app.config.ts history when continuing the auth/data WIP.
  ],
};
