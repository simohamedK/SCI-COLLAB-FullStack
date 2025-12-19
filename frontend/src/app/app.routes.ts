import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { 
    path: 'home', 
    component: HomeComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'profile', 
    component: UserProfileComponent, 
    canActivate: [authGuard] 
  },

  // === REDIRECTIONS PAR DÉFAUT ===
  // Si on va sur la racine (''), on va sur home (le guard vérifiera si on est connecté)
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  
  // Si on tape n'importe quoi, retour au login
  { path: '**', redirectTo: 'login' }
];