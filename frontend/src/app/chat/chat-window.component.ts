import { Component } from '@angular/core';
import { ChatService } from './chat.service';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-chat-window',
  standalone: true,
  imports: [NgFor, FormsModule, NgClass],
  templateUrl: "./chat-window.component.html",
  styleUrls: ["./chat-window.component.scss"],
})
export class ChatWindowComponent {
  userId: string;
  messages = [
    { from: 'bot', text: 'Hola 👋 ¿En qué puedo ayudarte?' }
  ];
  newMessage = '';
  constructor(
    private chatService: ChatService,
    private authService: AuthService
  ) {
    this.authService.currentUser$.pipe(take(1)).subscribe({
      next: (user) => {
        this.userId = user.id;
      }
    });
  }

  sendMessage() {
    console.log(this.newMessage);
    if (this.newMessage.trim()) {

      this.messages.push({ from: 'user', text: this.newMessage });
      this.chatService.sendMessage(this.newMessage, `${this.userId}`).pipe(take(1)).subscribe({
        next: (response) => {
          console.log(response);
          this.messages.push({ from: 'bot', text: response.respuesta });
          this.newMessage = '';
        },
        error: (error) => {
          this.newMessage = '';
          console.error('Error al enviar el mensaje:', error);
        }
      });
      // setTimeout(() => {
      //   this.messages.push({ from: 'bot', text: 'Gracias por tu mensaje.' });
      // }, 1000);
    }
  }

  close() {
    this.chatService.closeChat();
  }
}
