import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SocialService {
  private apiUrl = `${environment.apiUrl}/social`;
  constructor(private http: HttpClient) {}

  getFriends() { return this.http.get<any[]>(`${this.apiUrl}/friends`); }
  getPending() { return this.http.get<any[]>(`${this.apiUrl}/requests/pending`); }
  sendRequest(id: number) { return this.http.post(`${this.apiUrl}/request/${id}`, {}); }
  acceptRequest(id: number) { return this.http.patch(`${this.apiUrl}/request/${id}/accept`, {}); }
  getMessages(uid: number) { return this.http.get<any[]>(`${this.apiUrl}/messages/${uid}`); }
  sendMessage(rid: number, content: string) { return this.http.post<any>(`${this.apiUrl}/messages`, { receiverId: rid, content }); }
  getSentRequests() {
    return this.http.get<any[]>(`${this.apiUrl}/requests/sent`);
  }

  cancelRequest(requestId: number) {
    return this.http.delete(`${this.apiUrl}/requests/${requestId}`);
  }

  removeFriend(friendId: number) {
    return this.http.delete(`${this.apiUrl}/friends/${friendId}`);
  }
}