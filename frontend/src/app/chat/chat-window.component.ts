import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [NgFor, FormsModule, NgClass],
  templateUrl: "./chat-window.component.html",
  styleUrls: ["./chat-window.component.scss"],
})
export class ChatWindowComponent {
  messages = [
    { from: 'bot', text: 'Hola 👋 ¿En qué puedo ayudarte?' }
  ];
  newMessage = '';
  constructor(private chatService: ChatService) {}

  sendMessage() {
    console.log(this.newMessage);
    if (this.newMessage.trim()) {
      this.messages.push({ from: 'user', text: this.newMessage });
      // Simular respuesta del bot
      setTimeout(() => {
        this.messages.push({ from: 'bot', text: 'Gracias por tu mensaje.' });
      }, 1000);
      this.newMessage = '';
    }
  }

  close() {
    this.chatService.closeChat();
  }
}
