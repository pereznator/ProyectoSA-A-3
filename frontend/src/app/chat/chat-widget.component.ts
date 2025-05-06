import { Component } from '@angular/core';
import { ChatService } from './chat.service';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [],
  template: `
    <button class="chat-fab" (click)="toggleChat()">
      💬
    </button>
  `,
  styles: [`
    .chat-fab {
      position: fixed;
      bottom: 20px;
      right: 20px;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 24px;
      background-color: #007bff;
      color: white;
      cursor: pointer;
      z-index: 999;
    }
  `]
})
export class ChatWidgetComponent {
  constructor(private chatService: ChatService) {}

  toggleChat() {
    this.chatService.toggleChat();
  }
}
