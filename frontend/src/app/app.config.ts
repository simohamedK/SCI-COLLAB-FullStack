import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// ATTENTION : provideHttpClient et withInterceptors viennent de @angular/common/http
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // C'est cette ligne exacte qui active l'intercepteur :
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};