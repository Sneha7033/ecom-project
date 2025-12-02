import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChatMessage, ChatResponse } from '../data-type';



@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://localhost:5000/api/chat';//normal chat
  private ragApiUrl = 'http://localhost:5000/api/chat-rag';//rag chat
  constructor(private http: HttpClient) {}

  sendMessage(
    message:string, 
    history:ChatMessage[],
    systemPrompt?:string
  ):Observable<ChatResponse>{
    return this.http.post<ChatResponse>(this.apiUrl,{
      message,
      history,
      systemPrompt,
    });
  }

  sendMessageWithRag(
    message: string,
    history: ChatMessage[]
  ): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(this.ragApiUrl, {
      message,
      history,
    });
  }
}
