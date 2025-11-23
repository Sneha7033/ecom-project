import { Component } from '@angular/core';
import { ChatService, ChatMessage } from '../services/chat.service';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent {
  open = false;
  currentMessage = '';
  messages: ChatMessage[] = [];

  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.open = !this.open;
  }

  send() {
    const text = this.currentMessage.trim();
    if (!text) return;

    const userMsg: ChatMessage = { role: 'user', content: text };
    this.messages.push(userMsg);
    this.currentMessage = '';


    this.chatService.sendMessage(text, this.messages).subscribe({
      next: (res) => {
        const botMsg: ChatMessage = {
          role: 'assistant',
          content: res.answer  
        };
        this.messages.push(botMsg);
      },
      error: () => {
        this.messages.push({
          role: 'assistant',
          content: 'Sorry, I could not connect to the bot server.'
        });
      }
    });
  }
}
