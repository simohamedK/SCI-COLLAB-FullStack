import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config'; // <-- Vérifiez que c'est bien importé

bootstrapApplication(AppComponent, appConfig) // <-- Vérifiez que appConfig est passé ici
  .catch((err) => console.error(err));