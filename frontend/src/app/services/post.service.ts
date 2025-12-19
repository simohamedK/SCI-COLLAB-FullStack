import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user.model';

export interface Post {
  id: number; 
  title: string; 
  content: string; 
  createdAt: string;
  updatedAt: string; // <--- AJOUTE CETTE LIGNE ICI
  author: User; 
  skills: any[]; 
  comments: any[];
}

@Injectable({ providedIn: 'root' })
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;
  constructor(private http: HttpClient) {}

  update(id: number, data: { title: string, content: string }) {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, data);
  }
  getAll() { return this.http.get<Post[]>(this.apiUrl); }
  getRecommended() { return this.http.get<Post[]>(`${this.apiUrl}/recommended`); }
  create(data: any) { return this.http.post(this.apiUrl, data); }
  addComment(id: number, content: string) { return this.http.post(`${this.apiUrl}/${id}/comments`, { content }); }
}