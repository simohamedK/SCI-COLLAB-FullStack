import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  console.log("Valise interceptée ! URL :", req.url); // <--- MOUCHARD 1

  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    console.log("Token trouvé, je le colle sur l'enveloppe !"); // <--- MOUCHARD 2
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  console.log("Pas de token disponible..."); // <--- MOUCHARD 3
  return next(req);
};