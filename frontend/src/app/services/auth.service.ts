import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  constructor(private http: HttpClient, private router: Router) {}

  login(creds: any) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/login`, creds)
      .pipe(tap(res => localStorage.setItem('token', res.accessToken)));
  }
  register(data: any) {
    return this.http.post<{ accessToken: string }>(`${this.apiUrl}/register`, data)
      .pipe(tap(res => localStorage.setItem('token', res.accessToken)));
  }

  logout() { 
    localStorage.removeItem('token'); 
    this.router.navigate(['/login']); 
  }
  
  getToken() { 
    return localStorage.getItem('token');
  }
  
  isAuthenticated() { 
    return !!this.getToken(); 
  }
}