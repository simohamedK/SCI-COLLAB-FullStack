import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = false;

  constructor() {
    // Au démarrage, on vérifie si l'utilisateur avait déjà choisi le mode sombre
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.setDarkMode(true);
    }
  }

  isDarkMode() {
    return this.darkMode;
  }

  toggleTheme() {
    this.setDarkMode(!this.darkMode);
  }

  private setDarkMode(isDark: boolean) {
    this.darkMode = isDark;
    if (isDark) {
      document.body.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}