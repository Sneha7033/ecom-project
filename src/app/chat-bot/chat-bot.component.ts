import { Component } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatMessage } from '../data-type';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
  open = false;
  messages: {from: 'user' | 'bot'; text: string}[] = [];
  userInput: string = '';
  history: ChatMessage[]=[];
  loading = false;

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.open = !this.open;
  }

  sendMessage() {
    const trimmed = this.userInput.trim();
    if (!trimmed) {
      return;
    }
    this.messages.push({ from: 'user', text: trimmed});
    this.loading = true;
     
  
    this.chatService.
    sendMessageWithRag(trimmed, this.history)
    .subscribe({
      next: (res)=>{
        this.messages.push({ from: 'bot', text: res.answer });
        this.history = res.newHistory;
        this.userInput = '';
        this.loading = false;
      },
      error: err => {
        console.error('Error during chat processing:', err);
        this.messages.push({ 
          from: 'bot', 
          text: "Sorry, something went wrong. Please try again later." 
        });
        this.loading = false;
      }
    });
  }
  
}
