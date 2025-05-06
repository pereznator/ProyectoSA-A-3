import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ChatWindowComponent } from './chat/chat-window.component';
import { ChatWidgetComponent } from './chat/chat-widget.component';
import { ChatService } from './chat/chat.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ChatWindowComponent, ChatWidgetComponent, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  isChatVisible$ = this.chatService.chatVisible$;
  constructor(private chatService: ChatService) {}
}
