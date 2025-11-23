import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ChatMessage{

  role: 'user'| 'assistant';
  content:string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat';
  constructor(private http: HttpClient) {}

  sendMessage(message:string, history:ChatMessage[]):Observable<{answer:string}>{
    return this.http.post<{answer:string}>(this.apiUrl,{
      message,
      history
    });
  }
}
