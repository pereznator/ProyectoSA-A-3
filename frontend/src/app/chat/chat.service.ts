import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private chatVisible = new BehaviorSubject<boolean>(false);
  chatVisible$ = this.chatVisible.asObservable();

  toggleChat(): void {
    this.chatVisible.next(!this.chatVisible.getValue());
  }

  closeChat(): void {
    this.chatVisible.next(false);
  }
}
